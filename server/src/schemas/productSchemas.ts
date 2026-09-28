import { z } from 'zod';

export const getProductsQuerySchema = z.object({
  query: z.object({
    store: z.string().optional(),
    brand: z.string().optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    featured: z.string().optional(),
    bestSeller: z.string().optional(),
    dietary: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    weight: z.string().optional(),
    inStock: z.string().optional(),
    rating: z.string().optional(),
    minRating: z.string().optional(),
    sort: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});


export const createProductSchema = z.object({
  body: z.object({
    storeId: z.string().optional(),
    brandId: z.string().optional(),
    categoryId: z.string().min(1, 'Category is required'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    shortDescription: z.string().optional(),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    ingredients: z.string().optional(),
    nutritionFacts: z.record(z.any()).optional(),
    benefits: z.array(z.string()).optional(),
    howToUse: z.string().optional(),
    safetyNotice: z.string().optional(),
    fssaiNumber: z.string().optional(),
    hsnCode: z.string().default('0801'),
    gstRate: z.number().default(12.0),
    isCombo: z.boolean().default(false),
    comboCount: z.number().optional(),
    dietaryTags: z.array(z.string()).optional(),
    isFeatured: z.boolean().default(false),
    isBestSeller: z.boolean().default(false),
    images: z.array(z.string()).optional(),
    variants: z.array(
      z.object({
        name: z.string(),
        weightGrams: z.number().optional(),
        mrp: z.number(),
        price: z.number(),
        stock: z.number().default(50),
        sku: z.string(),
        isDefault: z.boolean().default(false),
      })
    ).min(1, 'At least one product variant is required'),
  }),
});
