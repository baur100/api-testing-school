/** source/routes/routes.ts */
import express from 'express';
import controller from '../controllers/posts';

const router = express.Router();

router.post('/dev/auth_server/generate_token', controller.generateToken);
router.post('/qa/auth_server/generate_token', controller.generateToken);

router.get('/dev/auth_server/validate_token', controller.validateToken);
router.get('/qa/auth_server/validate_token', controller.validateToken);

router.post('/dev/product');
router.get('/dev/product/all');
router.get('/dev/product/:id');
router.put('/dev/product/:id');
router.delete('/dev/product/:id');

router.post('/qa/product');
router.get('/qa/product/all');
router.get('/qa/product/:id');
router.put('/qa/product/:id');
router.delete('/qa/product/:id');

router.post('/dev/cart');
router.get('/dev/cart');
router.put('/dev/cart');
router.delete('/dev/cart');

router.post('/qa/cart');
router.get('/qa/cart');
router.put('/qa/cart');
router.delete('/qa/cart');

export default router;
