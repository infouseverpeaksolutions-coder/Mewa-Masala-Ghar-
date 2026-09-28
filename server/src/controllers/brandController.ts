import { Request, Response } from 'express';
import prisma from '../config/db';

export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      include: {
        categories: {
          where: { parentId: null },
          orderBy: { displayOrder: 'asc' },
          include: {
            _count: {
              select: { products: { where: { isActive: true } } },
            },
          },
        },
        _count: {
          select: {
            products: { where: { isActive: true } },
            categories: true,
          },
        },
      },
    });

    return res.json({ success: true, data: brands });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBrandBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const brand = await prisma.brand.findUnique({
      where: { slug },
      include: {
        categories: {
          orderBy: { displayOrder: 'asc' },
          include: {
            children: {
              orderBy: { displayOrder: 'asc' },
            },
            _count: {
              select: { products: { where: { isActive: true } } },
            },
          },
        },
        banners: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
        _count: {
          select: {
            products: { where: { isActive: true } },
          },
        },
      },
    });

    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    return res.json({ success: true, data: brand });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
