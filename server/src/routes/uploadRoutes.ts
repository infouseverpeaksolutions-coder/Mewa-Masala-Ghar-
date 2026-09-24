import { Router, Request, Response } from 'express';
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
