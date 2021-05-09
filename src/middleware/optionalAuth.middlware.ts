import { Context } from "../types/oak.interface.ts";
import JwtAuthMiddleware from "./jwtAuth.middleware.ts";

class OptionalAuthMiddleware {
  check = async (
    ctx: Context,
    next: () => Promise<unknown>,
  ): Promise<void> => {
    const token = ctx.request.headers.get("Authorization");
    if (token) {
      await JwtAuthMiddleware.validateToken(ctx, next);
    } else {
      ctx.user = undefined;
      await next();
      return;
    }
  };
}

export default new OptionalAuthMiddleware();
