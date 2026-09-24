import { Request, Response } from 'express';
import prisma from '../config/db';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settingsList = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = {};
    settingsList.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return res.json({
      success: true,
      data: settingsMap,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settings = req.body; // { key: value, ... }

    const updates = Object.entries(settings).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await prisma.$transaction(updates);

    const updatedList = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = {};
    updatedList.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return res.json({
      success: true,
      message: 'Settings updated successfully.',
      data: settingsMap,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
