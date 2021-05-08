import { Context } from "https://deno.land/x/oak/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { v4 } from "https://deno.land/std@0.95.0/uuid/mod.ts";
import client from "../../../database/mysql.database.ts";
class AuthController {
  public async register(ctx: Context): Promise<void> {
    try {
      const body = ctx.request.body({ type: 'json' });
      const {username, email, password } = await body.value;
      const errors: Partial<{username: string[]; email: string[]; password: string[] }> = {};
      if (!username) {
        errors.username = ['Please provide username.'];
      }
      if (!email) {
        errors.email = ['Please provide email.'];
      // } else if (this.validateEmail(email)) {
      //   errors.email = ['Incorrect email format.'];
      }
      if (!password) {
        errors.password = ['Please provide password.'];
      } else if (password.length < 8 || password.length > 16) {
        errors.password = ['Password length should be between 8 and 16 characters long.'];
      }

      if (errors) {
        ctx.response.status = 422;
        ctx.response.body = { errors };
        return;
      }
      const hashPassword = await bcrypt.hash("test");
      const id = v4.generate();
      const articles = await client.query(`INSERT INTO user (id, username, email, password) VALUES (??, ??, ??, ??)`,[id, username, email, password]);
      ctx.response.body = {
        articles: 'articles',
        articlesCount: 'articles.length',
      };
      return;
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: 'Something went wrong',
        error: error.message || error,
      };
    }
  }

  public validateEmail(email: string): boolean {
    const regex = new RegExp('^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$');
    return regex.test(String(email).toLowerCase());
  }
}

export default new AuthController();
