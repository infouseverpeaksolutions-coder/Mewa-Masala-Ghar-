import { Router } from 'express';
import { getSettings } from '../controllers/settingController';

const router = Router();

// Public endpoint for storefront and customer pages
router.get('/', getSettings);

export default router;
