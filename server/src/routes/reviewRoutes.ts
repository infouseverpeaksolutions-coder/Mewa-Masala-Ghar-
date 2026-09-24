import { Router } from 'express';
import { getProductReviews, submitReview } from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';
import { rateLimitAuth } from '../middleware/auth';

const router = Router();

router.get('/:productId', getProductReviews);
router.post('/', authenticate, rateLimitAuth(5, 15), submitReview);

export default router;
