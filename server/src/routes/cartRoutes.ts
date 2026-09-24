import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItemQty,
  removeCartItem,
  clearCart,
  mergeGuestCart,
} from '../controllers/cartController';
import { optionalAuth, authenticate } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getCart);
router.post('/items', optionalAuth, addToCart);
router.put('/items/:itemId', optionalAuth, updateCartItemQty);
router.delete('/items/:itemId', optionalAuth, removeCartItem);
router.delete('/', optionalAuth, clearCart);
router.post('/merge', authenticate, mergeGuestCart);

export default router;
