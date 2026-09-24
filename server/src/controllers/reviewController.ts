import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId, isApproved: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { productId, isApproved: true } }),
    ]);

    // Rating breakdown
    const allApproved = await prisma.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true },
    });

    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;
    allApproved.forEach((r) => {
      ratingBreakdown[r.rating as keyof typeof ratingBreakdown]++;
      totalRating += r.rating;
    });
    const averageRating = allApproved.length > 0 ? Number((totalRating / allApproved.length).toFixed(1)) : 0;

    return res.json({
      success: true,
      data: {
        reviews,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        summary: {
          averageRating,
          totalReviews: allApproved.length,
          breakdown: ratingBreakdown,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Please log in to submit a review.' });
    }

    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Product ID, rating, and comment are required.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
    }

    // Check product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Get user name
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        userName: user?.name || 'Anonymous',
        rating: parseInt(String(rating), 10),
        title: title || null,
        comment,
        isApproved: false, // Pending moderation
        isVerified: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully. It will appear after approval.',
      data: review,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
