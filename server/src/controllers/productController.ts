import { Request, Response } from 'express';
import prisma from '../config/db';

export const getStores = async (req: Request, res: Response) => {
  try {
    const stores = await prisma.store.findMany({
      where: { isActive: true },
      include: {
        categories: {
          orderBy: { displayOrder: 'asc' },
          where: { parentId: null },
          include: {
            children: {
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });
    return res.json({ success: true, data: stores });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { store } = req.query;
    const where: any = {};
    if (store) {
      where.store = { slug: String(store) };
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        store: { select: { id: true, slug: true, name: true } },
        _count: { select: { products: { where: { isActive: true } } } },
      },
      orderBy: { displayOrder: 'asc' },
    });

    // Build hierarchy tree
    const categoryMap = new Map<string, any>();
    categories.forEach((cat) => {
      categoryMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        displayOrder: cat.displayOrder,
        parentId: cat.parentId,
        store: cat.store,
        productCount: cat._count.products,
        children: [],
      });
    });

    const rootCategories: any[] = [];
    categories.forEach((cat) => {
      const node = categoryMap.get(cat.id);
      if (cat.parentId && categoryMap.has(cat.parentId)) {
        categoryMap.get(cat.parentId).children.push(node);
      } else {
        rootCategories.push(node);
      }
    });

    return res.json({
      success: true,
      data: rootCategories,
      all: Array.from(categoryMap.values()),
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      store,
      category,
      search,
      featured,
      bestSeller,
      dietary,
      minPrice,
      maxPrice,
      weight,
      inStock,
      rating,
      minRating,
      sort,
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const take = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * take;

    const where: any = {
      isActive: true,
    };

    if (store) {
      where.store = { slug: String(store) };
    }

    if (category) {
      const catSlug = String(category);
      const matchedCategory = await prisma.category.findUnique({
        where: { slug: catSlug },
        include: { children: { select: { id: true } } },
      });

      if (matchedCategory) {
        const catIds = [matchedCategory.id, ...matchedCategory.children.map((c) => c.id)];
        where.categoryId = { in: catIds };
      } else {
        where.category = { slug: catSlug };
      }
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (bestSeller === 'true') {
      where.isBestSeller = true;
    }

    const minR = parseFloat((minRating || rating) as string);
    if (!isNaN(minR)) {
      where.rating = { gte: minR };
    }

    if (search) {
      const searchTerm = String(search).trim();
      where.OR = [
        { name: { contains: searchTerm } },
        { description: { contains: searchTerm } },
        { ingredients: { contains: searchTerm } },
        { shortDescription: { contains: searchTerm } },
      ];
    }

    // Filter variants criteria
    const variantWhere: any = { isActive: true };
    let hasVariantFilter = false;

    if (minPrice || maxPrice) {
      variantWhere.price = {};
      if (minPrice) variantWhere.price.gte = parseFloat(minPrice as string);
      if (maxPrice) variantWhere.price.lte = parseFloat(maxPrice as string);
      hasVariantFilter = true;
    }

    if (weight) {
      const weightVal = parseInt(weight as string, 10);
      if (!isNaN(weightVal)) {
        variantWhere.weightGrams = weightVal;
        hasVariantFilter = true;
      }
    }

    if (inStock === 'true') {
      variantWhere.stockQty = { gt: 0 };
      hasVariantFilter = true;
    }

    if (hasVariantFilter) {
      where.variants = {
        some: variantWhere,
      };
    }

    // Determine DB ordering
    let orderBy: any = { createdAt: 'desc' };
    const sortVal = String(sort || '').toLowerCase();
    if (sortVal === 'rating' || sortVal === 'popular') {
      orderBy = [{ rating: 'desc' }, { reviewCount: 'desc' }];
    } else if (sortVal === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          store: { select: { id: true, slug: true, name: true, themeKey: true } },
          category: { select: { id: true, slug: true, name: true } },
          images: { orderBy: { displayOrder: 'asc' } },
          variants: {
            where: { isActive: true },
            orderBy: { price: 'asc' },
            select: {
              id: true,
              name: true,
              sku: true,
              weightGrams: true,
              packQty: true,
              mrp: true,
              price: true,
              gstPercent: true,
              stockQty: true,
              isDefault: true,
              isActive: true,
            },
          },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    // Sorting by variant price in-memory for exact precision
    let sortedProducts = [...products];
    if (sortVal === 'price_asc' || sortVal === 'price-asc' || sortVal === 'price_low') {
      sortedProducts.sort((a, b) => {
        const minA = a.variants.length > 0 ? Math.min(...a.variants.map((v) => v.price)) : 0;
        const minB = b.variants.length > 0 ? Math.min(...b.variants.map((v) => v.price)) : 0;
        return minA - minB;
      });
    } else if (sortVal === 'price_desc' || sortVal === 'price-desc' || sortVal === 'price_high') {
      sortedProducts.sort((a, b) => {
        const minA = a.variants.length > 0 ? Math.min(...a.variants.map((v) => v.price)) : 0;
        const minB = b.variants.length > 0 ? Math.min(...b.variants.map((v) => v.price)) : 0;
        return minB - minA;
      });
    }

    return res.json({
      success: true,
      data: {
        products: sortedProducts,
        pagination: {
          page: pageNum,
          limit: take,
          total: totalCount,
          totalPages: Math.ceil(totalCount / take),
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        store: true,
        category: {
          include: {
            parent: true,
          },
        },
        images: { orderBy: { displayOrder: 'asc' } },
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
          select: {
            id: true,
            name: true,
            sku: true,
            weightGrams: true,
            packQty: true,
            mrp: true,
            price: true,
            gstPercent: true,
            stockQty: true,
            isDefault: true,
            isActive: true,
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Reviews summary calculation
    const allReviews = await prisma.review.findMany({
      where: { productId: product.id },
      select: { rating: true },
    });

    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    allReviews.forEach((r) => {
      sum += r.rating;
      if (ratingBreakdown[r.rating as 1 | 2 | 3 | 4 | 5] !== undefined) {
        ratingBreakdown[r.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    });

    const reviewSummary = {
      averageRating: allReviews.length > 0 ? Number((sum / allReviews.length).toFixed(1)) : product.rating,
      totalReviews: allReviews.length,
      breakdown: ratingBreakdown,
    };

    // Fetch up to 4 related products from same category or store
    const relatedProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        storeId: product.storeId,
        id: { not: product.id },
      },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: { where: { isActive: true }, orderBy: { price: 'asc' }, take: 1 },
      },
      take: 4,
    });

    return res.json({
      success: true,
      data: {
        product: {
          ...product,
          reviewSummary,
        },
        relatedProducts,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBundles = async (req: Request, res: Response) => {
  try {
    const bundles = await prisma.bundle.findMany({
      where: { isActive: true },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    images: { where: { isPrimary: true }, take: 1 },
                    store: { select: { slug: true, name: true } },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Compute savings on each bundle
    const formattedBundles = bundles.map((b) => {
      const totalMrp = b.mrp || b.items.reduce((acc, item) => acc + item.productVariant.mrp * item.quantity, 0);
      const savings = Math.max(0, totalMrp - b.price);
      const discountPercent = totalMrp > 0 ? Math.round((savings / totalMrp) * 100) : 0;

      return {
        ...b,
        savings,
        discountPercent,
      };
    });

    return res.json({ success: true, data: formattedBundles });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const q = String(req.query.q || req.query.query || '').trim();
    if (!q) {
      return res.json({
        success: true,
        data: { products: [], categories: [], stores: [] },
      });
    }

    const [products, categories, stores] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
          variants: { where: { isActive: true }, select: { price: true }, orderBy: { price: 'asc' }, take: 1 },
        },
        take: 5,
      }),
      prisma.category.findMany({
        where: {
          name: { contains: q },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          store: { select: { slug: true, name: true } },
        },
        take: 3,
      }),
      prisma.store.findMany({
        where: {
          isActive: true,
          name: { contains: q },
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        take: 3,
      }),
    ]);

    const formattedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.variants[0]?.price || 0,
      image: p.images[0]?.url || null,
    }));

    return res.json({
      success: true,
      data: {
        products: formattedProducts,
        categories,
        stores,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBestsellers = async (req: Request, res: Response) => {
  try {
    const { store } = req.query;
    const where: any = {
      isActive: true,
      isBestSeller: true,
    };

    if (store) {
      where.store = { slug: String(store) };
    }

    const bestsellers = await prisma.product.findMany({
      where,
      include: {
        store: { select: { id: true, slug: true, name: true, themeKey: true } },
        category: { select: { id: true, slug: true, name: true } },
        images: { orderBy: { displayOrder: 'asc' } },
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
          select: {
            id: true,
            sku: true,
            weightGrams: true,
            packQty: true,
            mrp: true,
            price: true,
            gstPercent: true,
            stockQty: true,
            isDefault: true,
          },
        },
      },
      orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      take: 12,
    });

    return res.json({ success: true, data: bestsellers });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

