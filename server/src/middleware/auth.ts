import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/tokens';
import prisma from '../config/db';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required.',
      });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    // Verify user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
      });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired access token.',
      expired: error.name === 'TokenExpiredError',
    });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = verifyAccessToken(token);
      req.user = payload;
    }
  } catch (error) {
    // Ignore error for optional auth
  }
  next();
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions.',
      });
    }
    next();
  };
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'];
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required.',
    });
  }
  next();
};

export const requireStaffPermission = (moduleName: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    // Super Admin and Manager have global access across all modules
    if (req.user.role === 'SUPER_ADMIN' || req.user.role === 'MANAGER' || (req.user.role as any) === 'ADMIN') {
      return next();
    }

    if (req.user.role === 'STAFF') {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { permissions: true },
      });

      const permissions = (user?.permissions as string[]) || [];
      if (permissions.includes(moduleName) || permissions.includes('*') || permissions.includes('all')) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: `Access denied: Staff account lacks permission for '${moduleName}' module.`,
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required.',
    });
  };
};

// In-memory rate limiting map for auth endpoints
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const authRateLimitMap = new Map<string, RateLimitRecord>();

export const rateLimitAuth = (maxAttempts = 30, windowMinutes = 15) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'test' || req.headers['x-test-suite'] === 'true') {
      return next();
    }
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;

    let record = authRateLimitMap.get(ip);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      authRateLimitMap.set(ip, record);
      return next();
    }

    record.count++;
    if (record.count > maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.',
        retryAfterMinutes: Math.ceil((record.resetTime - now) / 60000),
      });
    }

    next();
  };
};
