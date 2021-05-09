import { Router } from 'https://deno.land/x/oak/mod.ts';
import AuthController from './auth/controller/auth.controller.ts';

const router = new Router();

router.get('/ping', async ({ response }) => { response.body = 'pong'; });
router.post('/api/users', AuthController.register);
router.post('/api/login', AuthController.login);

export default router;
