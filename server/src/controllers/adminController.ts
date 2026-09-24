import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

// ----------------------------------------------------
// Dashboard & Analytics
// ----------------------------------------------------
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      orders,
      recentOrders,
      lowStockVariants,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.findMany({
        where: { paymentStatus: 'PAID' },
        select: { totalAmount: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: { items: true },
      }),
      prisma.productVariant.findMany({
        where: { stockQty: { lte: 10 }, isActive: true },
        include: { product: { select: { name: true, store: { select: { name: true } } } } },
        take: 8,
      }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    const stores = await prisma.store.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });

    return res.json({
      success: true,
      data: {
        metrics: {
          totalRevenue: Number(totalRevenue.toFixed(2)),
          totalOrders,
          totalCustomers,
          totalProducts,
        },
        recentOrders,
        lowStockVariants,
        stores,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// Orders Management
// ----------------------------------------------------
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { status, search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const take = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * take;

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: String(search) } },
        { customerName: { contains: String(search) } },
        { customerPhone: { contains: String(search) } },
        { customerEmail: { contains: String(search) } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
        skip,
        take,
      }),
      prisma.order.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: pageNum,
          limit: take,
          total,
          totalPages: Math.ceil(total / take),
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, trackingNumber, courierName } = req.body;

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(trackingNumber !== undefined && { trackingNumber }),
        ...(courierName !== undefined && { courierName }),
      },
    });

    return res.json({
      success: true,
      message: 'Order updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// Stores CRUD
// ----------------------------------------------------
export const getAdminStores = async (req: Request, res: Response) => {
  try {
    const stores = await prisma.store.findMany({
      include: {
        _count: { select: { products: true, categories: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return res.json({ success: true, data: stores });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createAdminStore = async (req: Request, res: Response) => {
  try {
    const { name, slug, tagline, description, themeKey, primaryColor, accentColor, bgColor, fssaiNumber } = req.body;
    const store = await prisma.store.create({
      data: {
        name,
        slug: slug.toLowerCase().trim(),
        tagline,
        description,
        themeKey: themeKey || `theme-${slug.toLowerCase()}`,
        primaryColor: primaryColor || '#2F5D3A',
        accentColor: accentColor || '#D9A441',
        bgColor: bgColor || '#FAF6EC',
        fssaiNumber,
      },
    });
    return res.status(201).json({ success: true, message: 'Store created successfully.', data: store });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminStore = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const store = await prisma.store.update({
      where: { id },
      data,
    });
    return res.json({ success: true, message: 'Store updated successfully.', data: store });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdminStore = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.store.delete({ where: { id } });
    return res.json({ success: true, message: 'Store deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// Categories CRUD
// ----------------------------------------------------
export const getAdminCategories = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.query;
    const where: any = {};
    if (storeId) where.storeId = String(storeId);

    const categories = await prisma.category.findMany({
      where,
      include: {
        store: { select: { id: true, name: true, slug: true } },
        parent: { select: { id: true, name: true, slug: true } },
        children: { orderBy: { displayOrder: 'asc' } },
        _count: { select: { products: true } },
      },
      orderBy: { displayOrder: 'asc' },
    });
    return res.json({ success: true, data: categories });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createAdminCategory = async (req: Request, res: Response) => {
  try {
    const { storeId, parentId, name, slug, description, image, displayOrder } = req.body;
    let finalSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check collision
    const existing = await prisma.category.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const category = await prisma.category.create({
      data: {
        storeId,
        parentId: parentId || null,
        name: name.trim(),
        slug: finalSlug,
        description,
        image,
        displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
      },
      include: {
        store: true,
        parent: true,
      },
    });
    return res.status(201).json({ success: true, message: 'Category created successfully.', data: category });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { storeId, parentId, name, slug, description, image, displayOrder } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(storeId && { storeId }),
        ...(parentId !== undefined && { parentId: parentId || null }),
        ...(name && { name: name.trim() }),
        ...(slug && { slug: slug.toLowerCase().trim() }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder, 10) }),
      },
      include: { store: true, parent: true },
    });
    return res.json({ success: true, message: 'Category updated successfully.', data: category });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdminCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    return res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// Products CRUD & Variants Management
// ----------------------------------------------------
async function generateUniqueProductSlug(baseName: string, existingId?: string): Promise<string> {
  const baseSlug = baseName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  let currentSlug = baseSlug;
  let counter = 1;

  while (true) {
    const found = await prisma.product.findUnique({
      where: { slug: currentSlug },
      select: { id: true },
    });

    if (!found || (existingId && found.id === existingId)) {
      return currentSlug;
    }

    currentSlug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export const getAdminProducts = async (req: Request, res: Response) => {
  try {
    const { store, category, search, active, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const take = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * take;

    const where: any = {};
    if (store) where.store = { slug: String(store) };
    if (category) where.category = { slug: String(category) };
    if (active !== undefined && active !== '') where.isActive = active === 'true';

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { name: { contains: q } },
        { slug: { contains: q } },
        { hsnCode: { contains: q } },
        { variants: { some: { sku: { contains: q } } } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          store: { select: { id: true, name: true, slug: true } },
          category: { select: { id: true, name: true, slug: true } },
          variants: { orderBy: { price: 'asc' } },
          images: { orderBy: { displayOrder: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: take,
          total,
          totalPages: Math.ceil(total / take),
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        store: true,
        category: true,
        variants: { orderBy: { price: 'asc' } },
        images: { orderBy: { displayOrder: 'asc' } },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({ success: true, data: product });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      storeId,
      categoryId,
      name,
      slug: customSlug,
      shortDescription,
      description,
      ingredients,
      nutritionFacts,
      benefits,
      howToUse,
      safetyNotice,
      fssaiNumber,
      hsnCode,
      gstRate,
      isCombo,
      comboCount,
      dietaryTags,
      isFeatured,
      isBestSeller,
      isActive = true,
      storageInfo,
      shelfLife,
      metaTitle,
      metaDescription,
      images = [],
      variants = [],
    } = req.body;

    const finalSlug = await generateUniqueProductSlug(customSlug || name);

    const product = await prisma.product.create({
      data: {
        storeId,
        categoryId,
        name: name.trim(),
        slug: finalSlug,
        shortDescription,
        description,
        ingredients,
        nutritionFacts,
        benefits,
        howToUse,
        safetyNotice,
        fssaiNumber,
        hsnCode: hsnCode || '0801',
        gstRate: gstRate ? parseFloat(gstRate) : 12.0,
        isCombo: Boolean(isCombo),
        comboCount: comboCount ? parseInt(comboCount, 10) : 1,
        dietaryTags,
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
        isActive: Boolean(isActive),
        storageInfo,
        shelfLife,
        metaTitle,
        metaDescription,
        images: {
          create: images.map((img: any, index: number) => {
            const url = typeof img === 'string' ? img : img.url;
            return {
              url,
              altText: img.altText || `${name} image`,
              isPrimary: img.isPrimary !== undefined ? img.isPrimary : index === 0,
              displayOrder: img.displayOrder !== undefined ? img.displayOrder : index,
            };
          }),
        },
        variants: {
          create: variants.map((v: any, index: number) => ({
            name: v.name || `${name} - ${v.weightGrams || ''}g`,
            weightGrams: v.weightGrams ? parseInt(v.weightGrams, 10) : null,
            mrp: parseFloat(v.mrp),
            price: parseFloat(v.price),
            stockQty: v.stockQty !== undefined ? parseInt(v.stockQty, 10) : (v.stock ? parseInt(v.stock, 10) : 50),
            packQty: v.packQty ? parseInt(v.packQty, 10) : 1,
            gstPercent: v.gstPercent ? parseFloat(v.gstPercent) : 12.0,
            sku: v.sku ? v.sku.trim() : `MMG-${Date.now().toString().slice(-6)}-${index + 1}`,
            isDefault: v.isDefault !== undefined ? v.isDefault : index === 0,
            isActive: v.isActive !== undefined ? v.isActive : true,
          })),
        },
      },
      include: {
        images: true,
        variants: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    let slug = data.slug;
    if (data.name && !slug) {
      // Keep existing slug or generate if requested
      const current = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
      slug = current?.slug;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(data.storeId && { storeId: data.storeId }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.name && { name: data.name.trim() }),
        ...(slug && { slug }),
        ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
        ...(data.description && { description: data.description }),
        ...(data.ingredients !== undefined && { ingredients: data.ingredients }),
        ...(data.nutritionFacts !== undefined && { nutritionFacts: data.nutritionFacts }),
        ...(data.benefits !== undefined && { benefits: data.benefits }),
        ...(data.howToUse !== undefined && { howToUse: data.howToUse }),
        ...(data.safetyNotice !== undefined && { safetyNotice: data.safetyNotice }),
        ...(data.fssaiNumber !== undefined && { fssaiNumber: data.fssaiNumber }),
        ...(data.hsnCode !== undefined && { hsnCode: data.hsnCode }),
        ...(data.gstRate !== undefined && { gstRate: parseFloat(data.gstRate) }),
        ...(data.isCombo !== undefined && { isCombo: Boolean(data.isCombo) }),
        ...(data.comboCount !== undefined && { comboCount: parseInt(data.comboCount, 10) }),
        ...(data.dietaryTags !== undefined && { dietaryTags: data.dietaryTags }),
        ...(data.isFeatured !== undefined && { isFeatured: Boolean(data.isFeatured) }),
        ...(data.isBestSeller !== undefined && { isBestSeller: Boolean(data.isBestSeller) }),
        ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
        ...(data.storageInfo !== undefined && { storageInfo: data.storageInfo }),
        ...(data.shelfLife !== undefined && { shelfLife: data.shelfLife }),
        ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
        ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription }),
      },
      include: {
        images: true,
        variants: true,
      },
    });

    return res.json({
      success: true,
      message: 'Product updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// Variants Management & Activity Logged Stock Adjustments
// ----------------------------------------------------
export const addProductVariant = async (req: Request, res: Response) => {
  try {
    const { id: productId } = req.params;
    const { name, weightGrams, mrp, price, stockQty, packQty, gstPercent, sku, isDefault, isActive } = req.body;

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        name: name || 'Standard Pack',
        weightGrams: weightGrams ? parseInt(weightGrams, 10) : null,
        mrp: parseFloat(mrp),
        price: parseFloat(price),
        stockQty: stockQty !== undefined ? parseInt(stockQty, 10) : 50,
        packQty: packQty ? parseInt(packQty, 10) : 1,
        gstPercent: gstPercent ? parseFloat(gstPercent) : 12.0,
        sku: sku ? sku.trim() : `MMG-${Date.now().toString().slice(-6)}`,
        isDefault: Boolean(isDefault),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return res.status(201).json({ success: true, message: 'Variant added successfully.', data: variant });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVariant = async (req: Request, res: Response) => {
  try {
    const { variantId } = req.params;
    const data = req.body;

    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.weightGrams !== undefined && { weightGrams: data.weightGrams ? parseInt(data.weightGrams, 10) : null }),
        ...(data.mrp !== undefined && { mrp: parseFloat(data.mrp) }),
        ...(data.price !== undefined && { price: parseFloat(data.price) }),
        ...(data.packQty !== undefined && { packQty: parseInt(data.packQty, 10) }),
        ...(data.gstPercent !== undefined && { gstPercent: parseFloat(data.gstPercent) }),
        ...(data.sku && { sku: data.sku.trim() }),
        ...(data.isDefault !== undefined && { isDefault: Boolean(data.isDefault) }),
        ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
      },
    });

    return res.json({ success: true, message: 'Variant updated successfully.', data: variant });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteVariant = async (req: Request, res: Response) => {
  try {
    const { variantId } = req.params;
    await prisma.productVariant.delete({ where: { id: variantId } });
    return res.json({ success: true, message: 'Variant deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVariantStock = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { variantId } = req.params;
    const { stock, stockQty, price, mrp, reason } = req.body;

    const currentVariant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: { select: { name: true } } },
    });

    if (!currentVariant) {
      return res.status(404).json({ success: false, message: 'Variant not found.' });
    }

    const previousStock = currentVariant.stockQty;
    const rawStock = stock !== undefined ? stock : stockQty;
    const newStock = rawStock !== undefined ? parseInt(rawStock, 10) : previousStock;

    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        ...(rawStock !== undefined && { stockQty: newStock }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(mrp !== undefined && { mrp: parseFloat(mrp) }),
      },
    });

    // Log adjustment in activity_logs
    if (rawStock !== undefined && newStock !== previousStock) {
      await prisma.activityLog.create({
        data: {
          userId: req.user?.userId || null,
          action: 'STOCK_ADJUSTMENT',
          entityType: 'ProductVariant',
          entityId: variantId,
          metadata: {
            sku: currentVariant.sku,
            productName: currentVariant.product.name,
            previousStock,
            newStock,
            difference: newStock - previousStock,
            reason: reason || 'Manual stock update via Admin Portal',
          },
          ipAddress: req.ip || req.socket.remoteAddress,
        },
      });
    }

    return res.json({
      success: true,
      message: 'Inventory updated successfully and logged.',
      data: {
        ...variant,
        stock: variant.stockQty,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getInventory = async (req: Request, res: Response) => {
  try {
    const { filter, search, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const take = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * take;

    const where: any = { isActive: true };

    if (filter === 'low_stock') {
      where.stockQty = { lte: 10, gt: 0 };
    } else if (filter === 'out_of_stock') {
      where.stockQty = { lte: 0 };
    }

    if (search) {
      where.OR = [
        { sku: { contains: String(search) } },
        { product: { name: { contains: String(search) } } },
      ];
    }

    const [variants, total] = await Promise.all([
      prisma.productVariant.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              store: { select: { name: true, slug: true } },
              category: { select: { name: true, slug: true } },
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
        orderBy: { stockQty: 'asc' },
        skip,
        take,
      }),
      prisma.productVariant.count({ where }),
    ]);

    const formatted = variants.map((v) => ({
      ...v,
      status: v.stockQty <= 0 ? 'out_of_stock' : v.stockQty <= 10 ? 'low_stock' : 'in_stock',
    }));

    return res.json({
      success: true,
      data: {
        items: formatted,
        pagination: {
          page: pageNum,
          limit: take,
          total,
          totalPages: Math.ceil(total / take),
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// Product Images Management
// ----------------------------------------------------
export const addProductImage = async (req: Request, res: Response) => {
  try {
    const { id: productId } = req.params;
    let imageUrl = req.body.url;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image file or url is required.' });
    }

    // Count existing images
    const existingCount = await prisma.productImage.count({ where: { productId } });

    const newImage = await prisma.productImage.create({
      data: {
        productId,
        url: imageUrl,
        altText: req.body.altText || 'Product image',
        isPrimary: existingCount === 0 || Boolean(req.body.isPrimary),
        displayOrder: existingCount,
      },
    });

    return res.status(201).json({ success: true, message: 'Image added successfully.', data: newImage });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const reorderProductImages = async (req: Request, res: Response) => {
  try {
    const { imageIds } = req.body; // Array of image IDs in desired order
    if (!Array.isArray(imageIds)) {
      return res.status(400).json({ success: false, message: 'imageIds array is required.' });
    }

    await Promise.all(
      imageIds.map((id, index) =>
        prisma.productImage.update({
          where: { id },
          data: { displayOrder: index, isPrimary: index === 0 },
        })
      )
    );

    return res.json({ success: true, message: 'Images reordered successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProductImage = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;
    await prisma.productImage.delete({ where: { id: imageId } });
    return res.json({ success: true, message: 'Image deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const setPrimaryProductImage = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;
    const img = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!img) return res.status(404).json({ success: false, message: 'Image not found.' });

    await prisma.productImage.updateMany({
      where: { productId: img.productId },
      data: { isPrimary: false },
    });

    const updated = await prisma.productImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });

    return res.json({ success: true, message: 'Primary image updated.', data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// Combos / Bundles Management
// ----------------------------------------------------
export const getAdminBundles = async (req: Request, res: Response) => {
  try {
    const bundles = await prisma.bundle.findMany({
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                  select: { name: true, store: { select: { name: true, slug: true } } },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: bundles });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createAdminBundle = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, price, mrp, items = [] } = req.body;
    const finalSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-4);

    const bundle = await prisma.bundle.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        description,
        price: parseFloat(price),
        mrp: parseFloat(mrp),
        items: {
          create: items.map((it: any) => ({
            productVariantId: it.productVariantId,
            quantity: parseInt(it.quantity || 1, 10),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return res.status(201).json({ success: true, message: 'Bundle created successfully.', data: bundle });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminBundle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, mrp, isActive, items } = req.body;

    if (items && Array.isArray(items)) {
      await prisma.bundleItem.deleteMany({ where: { bundleId: id } });
      await prisma.bundleItem.createMany({
        data: items.map((it: any) => ({
          bundleId: id,
          productVariantId: it.productVariantId,
          quantity: parseInt(it.quantity || 1, 10),
        })),
      });
    }

    const updated = await prisma.bundle.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(mrp !== undefined && { mrp: parseFloat(mrp) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
      include: { items: true },
    });

    return res.json({ success: true, message: 'Bundle updated successfully.', data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdminBundle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.bundle.delete({ where: { id } });
    return res.json({ success: true, message: 'Bundle deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// CSV Bulk Import & Export
// ----------------------------------------------------
export const exportProductsCSV = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        store: { select: { slug: true, name: true } },
        category: { select: { slug: true, name: true } },
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Store',
      'Category',
      'Product Name',
      'Slug',
      'Short Description',
      'Description',
      'Ingredients',
      'Dietary Tags',
      'Featured',
      'BestSeller',
      'Active',
      'Storage Info',
      'Shelf Life',
      'Meta Title',
      'Meta Description',
      'SKU',
      'Variant Name',
      'Weight(g)',
      'Pack Qty',
      'MRP',
      'Selling Price',
      'GST%',
      'Stock',
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '';
      const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows: string[] = [headers.join(',')];

    for (const p of products) {
      if (p.variants.length === 0) {
        rows.push(
          [
            escapeCsv(p.store.slug),
            escapeCsv(p.category.slug),
            escapeCsv(p.name),
            escapeCsv(p.slug),
            escapeCsv(p.shortDescription),
            escapeCsv(p.description),
            escapeCsv(p.ingredients),
            escapeCsv(p.dietaryTags),
            p.isFeatured ? 'TRUE' : 'FALSE',
            p.isBestSeller ? 'TRUE' : 'FALSE',
            p.isActive ? 'TRUE' : 'FALSE',
            escapeCsv(p.storageInfo),
            escapeCsv(p.shelfLife),
            escapeCsv(p.metaTitle),
            escapeCsv(p.metaDescription),
            '',
            '',
            '',
            '1',
            '0',
            '0',
            p.gstRate,
            '0',
          ].join(',')
        );
      } else {
        for (const v of p.variants) {
          rows.push(
            [
              escapeCsv(p.store.slug),
              escapeCsv(p.category.slug),
              escapeCsv(p.name),
              escapeCsv(p.slug),
              escapeCsv(p.shortDescription),
              escapeCsv(p.description),
              escapeCsv(p.ingredients),
              escapeCsv(p.dietaryTags),
              p.isFeatured ? 'TRUE' : 'FALSE',
              p.isBestSeller ? 'TRUE' : 'FALSE',
              p.isActive ? 'TRUE' : 'FALSE',
              escapeCsv(p.storageInfo),
              escapeCsv(p.shelfLife),
              escapeCsv(p.metaTitle),
              escapeCsv(p.metaDescription),
              escapeCsv(v.sku),
              escapeCsv(v.name),
              v.weightGrams || '',
              v.packQty || 1,
              v.mrp,
              v.price,
              v.gstPercent,
              v.stockQty,
            ].join(',')
          );
        }
      }
    }

    const csvContent = rows.join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="mewa_masala_products_catalog.csv"');
    return res.send(csvContent);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const importProductsCSV = async (req: Request, res: Response) => {
  try {
    let csvData = '';
    if (req.file) {
      csvData = req.file.buffer ? req.file.buffer.toString('utf-8') : '';
      if (!csvData && (req.file as any).path) {
        const fs = await import('fs');
        csvData = fs.readFileSync((req.file as any).path, 'utf-8');
      }
    } else if (req.body.csv) {
      csvData = String(req.body.csv);
    }

    if (!csvData) {
      return res.status(400).json({ success: false, message: 'Please upload a CSV file or provide csv content.' });
    }

    // Parse CSV lines carefully
    const lines = csvData
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      return res.status(400).json({ success: false, message: 'CSV file must have a header row and at least 1 data row.' });
    }

    // Split CSV row handling quotes
    const parseCsvLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let insideQuote = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (insideQuote && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            insideQuote = !insideQuote;
          }
        } else if (char === ',' && !insideQuote) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const rows = lines.slice(1);

    const report = {
      totalRows: rows.length,
      imported: 0,
      failed: 0,
      errors: [] as { row: number; field: string; reason: string }[],
    };

    // Cache stores and categories
    const allStores = await prisma.store.findMany();
    const allCategories = await prisma.category.findMany();

    for (let index = 0; index < rows.length; index++) {
      const rowNumber = index + 2; // Line 1 is header
      const cols = parseCsvLine(rows[index]);

      if (cols.length < 5) {
        report.failed++;
        report.errors.push({ row: rowNumber, field: 'row', reason: 'Row has too few columns.' });
        continue;
      }

      const getCol = (keyFragment: string) => {
        const idx = header.findIndex((h) => h.includes(keyFragment));
        return idx !== -1 ? cols[idx] : '';
      };

      const storeSlug = getCol('store') || 'foods';
      const categorySlug = getCol('category');
      const productName = getCol('productname') || getCol('name');
      const sku = getCol('sku');
      const variantName = getCol('variantname');
      const weightGrams = parseInt(getCol('weight') || '0', 10) || null;
      const mrp = parseFloat(getCol('mrp') || '0');
      const price = parseFloat(getCol('price') || '0');
      const stock = parseInt(getCol('stock') || '50', 10);
      const gstPercent = parseFloat(getCol('gst') || '12');

      if (!productName) {
        report.failed++;
        report.errors.push({ row: rowNumber, field: 'Product Name', reason: 'Product name is required.' });
        continue;
      }

      if (isNaN(price) || price <= 0) {
        report.failed++;
        report.errors.push({ row: rowNumber, field: 'Selling Price', reason: 'Price must be a positive number.' });
        continue;
      }

      const targetStore = allStores.find((s) => s.slug === storeSlug || s.id === storeSlug) || allStores[0];
      let targetCat = allCategories.find((c) => c.slug === categorySlug || c.id === categorySlug);
      if (!targetCat && targetStore) {
        targetCat = allCategories.find((c) => c.storeId === targetStore.id) || allCategories[0];
      }

      if (!targetStore || !targetCat) {
        report.failed++;
        report.errors.push({ row: rowNumber, field: 'Store/Category', reason: 'Store or Category could not be resolved.' });
        continue;
      }

      try {
        // Upsert product by slug or name
        const slug = getCol('slug') || (await generateUniqueProductSlug(productName));
        let product = await prisma.product.findFirst({
          where: { OR: [{ slug }, { name: productName }] },
        });

        if (!product) {
          product = await prisma.product.create({
            data: {
              storeId: targetStore.id,
              categoryId: targetCat.id,
              name: productName,
              slug,
              description: getCol('description') || `${productName} from Mewa Masala Ghar`,
              shortDescription: getCol('shortdescription'),
              ingredients: getCol('ingredients'),
              storageInfo: getCol('storageinfo'),
              shelfLife: getCol('shelflife'),
              metaTitle: getCol('metatitle'),
              metaDescription: getCol('metadescription'),
              isFeatured: getCol('featured').toLowerCase() === 'true',
              isBestSeller: getCol('bestseller').toLowerCase() === 'true',
              isActive: getCol('active').toLowerCase() !== 'false',
            },
          });
        }

        // Upsert variant by SKU
        const finalSku = sku || `MMG-${Date.now().toString().slice(-6)}-${rowNumber}`;
        const existingVariant = await prisma.productVariant.findUnique({
          where: { sku: finalSku },
        });

        if (existingVariant) {
          await prisma.productVariant.update({
            where: { id: existingVariant.id },
            data: {
              mrp: mrp || price,
              price,
              stockQty: stock,
              gstPercent,
              weightGrams,
              name: variantName || existingVariant.name,
            },
          });
        } else {
          await prisma.productVariant.create({
            data: {
              productId: product.id,
              sku: finalSku,
              name: variantName || `${productName} Standard`,
              mrp: mrp || price,
              price,
              stockQty: stock,
              gstPercent,
              weightGrams,
              packQty: 1,
              isDefault: true,
            },
          });
        }

        report.imported++;
      } catch (err: any) {
        report.failed++;
        report.errors.push({ row: rowNumber, field: 'system', reason: err.message });
      }
    }

    return res.json({
      success: true,
      message: `Import finished: ${report.imported} rows imported successfully, ${report.failed} failed.`,
      data: report,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// Banners CRUD
// ----------------------------------------------------
export const getAdminBanners = async (req: Request, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({
      include: { store: { select: { name: true, slug: true } } },
      orderBy: { displayOrder: 'asc' },
    });
    return res.json({ success: true, data: banners });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createAdminBanner = async (req: Request, res: Response) => {
  try {
    const { storeId, title, subtitle, ctaText, imageUrl, linkUrl, displayOrder, isActive } = req.body;
    const banner = await prisma.banner.create({
      data: {
        storeId: storeId || null,
        title,
        subtitle,
        ctaText: ctaText || 'Shop Now',
        imageUrl,
        linkUrl,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });
    return res.status(201).json({ success: true, message: 'Banner created successfully.', data: banner });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { storeId, title, subtitle, ctaText, imageUrl, linkUrl, displayOrder, isActive } = req.body;
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...(storeId !== undefined && { storeId: storeId || null }),
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(ctaText !== undefined && { ctaText }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(linkUrl !== undefined && { linkUrl }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder, 10) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });
    return res.json({ success: true, message: 'Banner updated successfully.', data: banner });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdminBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.banner.delete({ where: { id } });
    return res.json({ success: true, message: 'Banner deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// Customers & Activity Logs
// ----------------------------------------------------
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, data: customers });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getActivityLogs = async (req: Request, res: Response) => {
  try {
    const logs = await prisma.activityLog.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return res.json({ success: true, data: logs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

