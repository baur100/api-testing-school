/** source/routes/routes.ts */
import express from 'express';
import controller from '../controllers/posts';

const router = express.Router();
router.post('/dev/auth_server/generate_token', controller.generateToken);
router.post('/qa/auth_server/generate_token', controller.generateToken);
router.get('/dev/auth_server/validate_token', controller.validateToken);
router.get('/qa/auth_server/validate_token', controller.validateToken);
export default router;
