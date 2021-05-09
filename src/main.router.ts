import { Router } from "https://deno.land/x/oak@v7.4.0/mod.ts";
import AuthController from "./auth/controller/auth.controller.ts";
import JwtAuthMiddleware from "./middleware/jwtAuth.middleware.ts";
import UserController from "./user/controller/user.controller.ts";

const router = new Router();

router.get("/ping", ({ response }) => {
  response.body = "pong";
});

router.post("/api/users", AuthController.register);
router.post("/api/users/login", AuthController.login);

router.get("/user", JwtAuthMiddleware.validateToken, UserController.show);
router.post("/user", JwtAuthMiddleware.validateToken, UserController.update);

export default router;
