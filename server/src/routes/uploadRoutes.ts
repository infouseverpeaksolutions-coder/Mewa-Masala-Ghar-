import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { upload } from '../config/upload';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.post(
  '/',
  authenticate,
  requireAdmin,
  upload.single('image'),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Ensure file exists in both server/uploads and process.cwd()/uploads
    try {
      const dirsToMirror = [
        path.resolve(process.cwd(), 'uploads'),
        path.resolve(process.cwd(), 'server/uploads'),
      ];
      for (const d of dirsToMirror) {
        if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
        const targetPath = path.join(d, req.file.filename);
        if (targetPath !== req.file.path) {
          fs.copyFileSync(req.file.path, targetPath);
        }
      }
    } catch (_) {}

    // Local file fallback path
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({
      success: true,
      message: 'Image uploaded successfully.',
      data: {
        url: fileUrl,
        filename: req.file.filename,
      },
    });
  }
);

export default router;
