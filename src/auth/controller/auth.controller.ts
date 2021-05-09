import { Context } from "../../types/oak.interface.ts";
import env from "../../../config.ts";
import client from "../../../database/mysql.database.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { v4 } from "https://deno.land/std@0.95.0/uuid/mod.ts";
import { create } from "https://deno.land/x/djwt@v2.2/mod.ts";
import { ld as _ } from "https://x.nest.land/deno-lodash@1.0.0/mod.ts";

class AuthController {
  register = async (ctx: Context): Promise<void> => {
    try {
      const body = ctx.request.body({ type: "json" });
      const { user } = await body.value;
      const errors: Partial<
        { username: string[]; email: string[]; password: string[] }
      > = {};
      if (!user.username) {
        errors.username = ["Please provide username."];
      }
      if (!user.email) {
        errors.email = ["Please provide email."];
      } else if (this.isEmail(user.email)) {
        errors.email = ["Incorrect email format."];
      }
      if (!user.password) {
        errors.password = ["Please provide password."];
      } else if (user.password.length < 8 || user.password.length > 16) {
        errors.password = [
          "Password length should be between 8 and 16 characters long.",
        ];
      }

      if (errors) {
        ctx.response.status = 422;
        ctx.response.body = { errors };
        return;
      }

      const hash = await bcrypt.hash(user.password);
      const id = v4.generate();
      const { affectedRows } = await client.execute(
        `INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)`,
        [id, user.username, user.email, hash],
      );
      if (!affectedRows || !(affectedRows > 0)) {
        throw new Error("Could not register, please try again later.");
      }

      ctx.response.status = 200;
      ctx.response.headers.set("Content-Type", "application/json");
      ctx.response.body = JSON.stringify({
        user: {
          id,
          username: user.username,
          email: user.email,
        },
      });
      return;
    } catch (error) {
      console.log(error);
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Something went wrong.",
        error: error.message || error,
      };
    }
  };

  login = async (ctx: Context): Promise<void> => {
    try {
      const body = ctx.request.body({ type: "json" });
      const { user: { email, password } } = await body.value;
      const errors: Partial<{ email: string[]; password: string[] }> = {};

      if (!email) {
        errors.email = ["Please provide email."];
      } else if (this.isEmail(email)) {
        errors.email = ["Incorrect email format."];
      }
      if (!password) {
        errors.password = ["Please provide password."];
      } else if (password.length < 8 || password.length > 16) {
        errors.password = [
          "Password length should be between 8 and 16 characters long.",
        ];
      }

      const { rows: user } = await client.execute(
        `SELECT * FROM user WHERE email = ? LIMIT 1`,
        [email],
      );
      if (!user || !user.length) {
        throw new Error("User not found.");
      }

      if (!this.isPasswordMatch(password, user[0].hash)) {
        errors.password = ["Password does not match."];
      }

      if (errors) {
        ctx.response.status = 422;
        ctx.response.body = { errors };
        return;
      }

      const token = await create({ alg: "HS512", typ: "JWT" }, {
        email: user[0].email,
        username: user[0].username,
      }, env.JWT_SECRET);

      delete user[0].password;

      ctx.response.status = 200;
      ctx.response.headers.set("Content-Type", "application/json");
      ctx.response.body = JSON.stringify({
        token,
        user: { ..._.omit(user, "password") },
      });
    } catch (error) {
      console.log(error);
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Something went wrong.",
        error: error.message || error,
      };
    }
  };

  isEmail = (email: string): boolean => {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  };

  isPasswordMatch = async (
    password: string,
    hash: string,
  ): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
  };
}

export default new AuthController();
