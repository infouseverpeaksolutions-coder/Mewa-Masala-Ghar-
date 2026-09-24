import { Router } from 'express';
import {
  getStores,
  getCategories,
  getProducts,
  getProductBySlug,
  getBundles,
  getSearchSuggestions,
  getBestsellers,
} from '../controllers/productController';
import { validate } from '../middleware/validate';
import { getProductsQuerySchema } from '../schemas/productSchemas';

const router = Router();

router.get('/stores', getStores);
router.get('/categories', getCategories);
router.get('/categories/tree', getCategories);
router.get('/bundles', getBundles);
router.get('/search/suggestions', getSearchSuggestions);
router.get('/bestsellers', getBestsellers);
router.get('/', validate(getProductsQuerySchema), getProducts);
router.get('/:slug', getProductBySlug);

export default router;

