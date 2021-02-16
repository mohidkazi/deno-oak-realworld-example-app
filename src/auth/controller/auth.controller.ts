import { Context } from "https://deno.land/x/oak/mod.ts";
import client from "../../../database/mysql.database.ts";
class AuthController {
  constructor() {}

  public async getAuth(ctx: Context): Promise<void> {
    const articles = await client
      .query(`SELECT 
                  a.*,
                  u.*
                FROM test.article as a
                INNER JOIN test.user as u
                  ON u.id=a.authorId;`);
    try {
      ctx.response.body = {
        articles: articles,
        articlesCount: articles.length,
      };
    } catch (error) {
      // ctx.response.status = 400;
      // ctx.response.body = 'Something went wrong';
    }
  }
}

export default new AuthController();
