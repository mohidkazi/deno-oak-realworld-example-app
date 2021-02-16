import { Router } from "https://deno.land/x/oak/mod.ts";
import AuthController from "./auth/controller/auth.controller.ts";

const router = new Router();

router.get("/api/:id", AuthController.getAuth);

export default router;
