import { Router, Request, Response } from 'express';
import prisma from '../config/db';
import { submitContactForm } from '../controllers/contactController';
import { subscribe as newsletterSubscribe } from '../controllers/newsletterController';

const router = Router();

// Public Banners
router.get('/banners', async (req: Request, res: Response) => {
  try {
    const { storeId } = req.query;
    const where: any = { isActive: true };
    if (storeId) where.storeId = String(storeId);

    const banners = await prisma.banner.findMany({
      where,
      include: { store: { select: { id: true, name: true, slug: true } } },
      orderBy: { displayOrder: 'asc' },
    });

    return res.json({ success: true, data: banners });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Public Pages by Slug
router.get('/pages/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const page = await prisma.page.findUnique({
      where: { slug },
    });

    if (!page || !page.isPublished) {
      return res.status(404).json({ success: false, message: 'Page not found.' });
    }

    return res.json({ success: true, data: page });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Home Page Aggregation Endpoint
router.get('/home', async (req: Request, res: Response) => {
  try {
    const [
      heroBanners,
      stores,
      featuredProducts,
      bestsellers,
      reviews,
      settings,
    ] = await Promise.all([
      // Hero banners (active, ordered)
      prisma.banner.findMany({
        where: { isActive: true },
        include: { store: { select: { id: true, name: true, slug: true } } },
        orderBy: { displayOrder: 'asc' },
        take: 5,
      }),

      // Active stores
      prisma.store.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      }),

      // Featured products per store (max 6 each)
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: {
          store: { select: { id: true, name: true, slug: true } },
          category: { select: { id: true, name: true, slug: true } },
          variants: {
            where: { isActive: true },
            orderBy: { price: 'asc' },
          },
          images: {
            orderBy: { displayOrder: 'asc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 18,
      }),

      // Bestsellers (max 12)
      prisma.product.findMany({
        where: { isActive: true, isBestSeller: true },
        include: {
          store: { select: { id: true, name: true, slug: true } },
          category: { select: { id: true, name: true, slug: true } },
          variants: {
            where: { isActive: true },
            orderBy: { price: 'asc' },
          },
          images: {
            orderBy: { displayOrder: 'asc' },
            take: 1,
          },
        },
        take: 12,
      }),

      // Latest approved reviews (max 8)
      prisma.review.findMany({
        where: { isApproved: true },
        include: {
          product: {
            select: {
              name: true,
              slug: true,
              store: { select: { name: true, slug: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),

      // Settings
      prisma.setting.findMany(),
    ]);

    // Group featured products by store
    const featuredByStore: Record<string, any[]> = {};
    featuredProducts.forEach((p) => {
      const storeSlug = p.store?.slug || 'general';
      if (!featuredByStore[storeSlug]) featuredByStore[storeSlug] = [];
      if (featuredByStore[storeSlug].length < 6) {
        featuredByStore[storeSlug].push(p);
      }
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => { settingsMap[s.key] = s.value; });

    return res.json({
      success: true,
      data: {
        heroBanners,
        stores,
        featuredByStore,
        bestsellers,
        reviews,
        settings: settingsMap,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Contact Form
router.post('/contact', submitContactForm);

// Newsletter Subscribe
router.post('/newsletter/subscribe', newsletterSubscribe);

export default router;
