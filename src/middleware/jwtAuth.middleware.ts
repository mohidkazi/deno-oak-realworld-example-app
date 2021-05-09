import { Context } from "../types/oak.interface.ts";
import { verify } from "https://deno.land/x/djwt@v2.2/mod.ts";
import { ld as _ } from "https://x.nest.land/deno-lodash@1.0.0/mod.ts";
import env from "../../config.ts";
import client from "../../database/mysql.database.ts";

class JwtAuthMiddleware {
  validateToken = async (
    ctx: Context,
    next: () => Promise<unknown>,
  ): Promise<void> => {
    try {
      const token = ctx.request.headers.get("Authorization");
      if (!token) {
        throw new Error(
          "You are not Authorized to access this route, please provide token in the header.",
        );
      }

      const payload = await verify(token, env.JWT_SECRET, "HS512");
      const { rows: user } = await client.execute(
        `SELECT * FROM users WHERE email = ? AND username = ? LIMIT 1`,
        [payload.email, payload.username],
      );
      if (!user || !user.length) {
        throw new Error("User not found.");
      }

      ctx.user = _.omit(user[0], "password");
    } catch (error) {
      console.log(error);
      ctx.response.status = 401;
      ctx.response.body = {
        message: "Unauthorized access.",
        error: error.message || error,
      };
    }
    await next();
  };
}

export default new JwtAuthMiddleware();
