import { Router } from 'express';
import { checkPincode } from '../controllers/pincodeController';

const router = Router();

router.get('/serviceability', checkPincode);
router.get('/check', checkPincode);
router.post('/check', checkPincode);

export default router;

