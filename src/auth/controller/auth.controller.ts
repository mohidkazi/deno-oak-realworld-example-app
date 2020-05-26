import {
  Context,
} from "https://deno.land/x/oak/mod.ts";


class AuthController {
  constructor() {}

  public async getAuth(ctx: Context): Promise<void> {
    try {
      // ctx.response.status = 401;
      ctx.response.body = "nothing happened";
    } catch (error) {
      // ctx.response.status = 403;
      // ctx.response.body = 'something unexpected happened here'
    }
  }
}

export default new AuthController();
