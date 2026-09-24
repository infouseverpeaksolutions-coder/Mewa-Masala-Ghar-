import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

// Helper to get or create cart
async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (userId) {
    let cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }
    return cart;
  }
  if (sessionId) {
    let cart = await prisma.cart.findFirst({ where: { sessionId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { sessionId } });
    }
    return cart;
  }
  return null;
}

// Full cart include for responses
const cartInclude = {
  items: {
    include: {
      productVariant: {
        include: {
          product: {
            include: {
              store: { select: { id: true, name: true, slug: true } },
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
};

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.cookies?.mmg_session_id;

    if (!userId && !sessionId) {
      return res.json({ success: true, data: { items: [] } });
    }

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: cartInclude,
    });

    return res.json({ success: true, data: cart || { items: [] } });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    let sessionId = req.cookies?.mmg_session_id;
    const { variantId, quantity = 1 } = req.body;

    if (!variantId) {
      return res.status(400).json({ success: false, message: 'Variant ID is required.' });
    }

    // Validate variant exists and has stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: { select: { isActive: true } } },
    });

    if (!variant || !variant.isActive || !variant.product.isActive) {
      return res.status(400).json({ success: false, message: 'Product variant not available.' });
    }

    if (variant.stockQty < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${variant.stockQty} units available in stock.`,
      });
    }

    // Generate session ID for guests
    if (!userId && !sessionId) {
      const crypto = await import('crypto');
      sessionId = crypto.randomBytes(16).toString('hex');
      res.cookie('mmg_session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    }

    const cart = await getOrCreateCart(userId, sessionId);
    if (!cart) {
      return res.status(400).json({ success: false, message: 'Unable to create cart.' });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productVariantId: variantId },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > variant.stockQty) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${variant.stockQty} units available (${existingItem.quantity} already in cart).`,
        });
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productVariantId: variantId, quantity },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: cartInclude,
    });

    return res.json({ success: true, message: 'Item added to cart.', data: updatedCart });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartItemQty = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { productVariant: true, cart: true },
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    // Verify ownership
    const userId = (req as AuthenticatedRequest).user?.userId;
    const sessionId = req.cookies?.mmg_session_id;
    if (item.cart.userId && item.cart.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    if (!item.cart.userId && item.cart.sessionId !== sessionId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Stock check
    if (quantity > item.productVariant.stockQty) {
      return res.status(400).json({
        success: false,
        message: `Only ${item.productVariant.stockQty} units available.`,
      });
    }

    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: item.cartId },
      include: cartInclude,
    });

    return res.json({ success: true, message: 'Cart updated.', data: updatedCart });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeCartItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { itemId } = req.params;

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    // Verify ownership
    const userId = (req as AuthenticatedRequest).user?.userId;
    const sessionId = req.cookies?.mmg_session_id;
    if (item.cart.userId && item.cart.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    if (!item.cart.userId && item.cart.sessionId !== sessionId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: item.cartId },
      include: cartInclude,
    });

    return res.json({ success: true, message: 'Item removed from cart.', data: updatedCart });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.cookies?.mmg_session_id;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return res.json({ success: true, message: 'Cart cleared.', data: { items: [] } });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const mergeGuestCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.cookies?.mmg_session_id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!sessionId) {
      return res.json({ success: true, message: 'No guest cart to merge.', data: null });
    }

    const guestCart = await prisma.cart.findFirst({
      where: { sessionId },
      include: { items: { include: { productVariant: true } } },
    });

    if (!guestCart || guestCart.items.length === 0) {
      return res.json({ success: true, message: 'No guest cart items to merge.', data: null });
    }

    // Get or create user cart
    let userCart = await prisma.cart.findFirst({ where: { userId } });
    if (!userCart) {
      userCart = await prisma.cart.create({ data: { userId } });
    }

    // Merge items
    for (const guestItem of guestCart.items) {
      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: userCart.id, productVariantId: guestItem.productVariantId },
      });

      const maxQty = guestItem.productVariant.stockQty;

      if (existingItem) {
        const merged = Math.min(existingItem.quantity + guestItem.quantity, maxQty);
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: merged },
        });
      } else {
        const qty = Math.min(guestItem.quantity, maxQty);
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productVariantId: guestItem.productVariantId,
            quantity: qty,
          },
        });
      }
    }

    // Delete guest cart
    await prisma.cart.delete({ where: { id: guestCart.id } });

    // Clear session cookie
    res.clearCookie('mmg_session_id');

    const mergedCart = await prisma.cart.findUnique({
      where: { id: userCart.id },
      include: cartInclude,
    });

    return res.json({ success: true, message: 'Guest cart merged.', data: mergedCart });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
