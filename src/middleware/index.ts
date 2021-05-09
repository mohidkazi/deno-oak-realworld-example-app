import { Context } from 'https://deno.land/x/oak/mod.ts';

class Middleware {
  validateToken = async (ctx: Context, next: () => Promise<void>): Promise<void> => {
    console.log(ctx); // WIP
    await next();
  }
}

export default new Middleware();