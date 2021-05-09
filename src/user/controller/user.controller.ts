import { Context } from "../../types/oak.interface.ts";
import client from "../../../database/mysql.database.ts";
import { ld as _ } from "https://x.nest.land/deno-lodash@1.0.0/mod.ts";

class UserController {
  show = async (ctx: Context): Promise<void> => {
    try {
      const authUser = ctx.user;
      /*
        once jwt middleware is invoked before this,
        we will always have an instance of authUser object,
        but since we have declared it as `?` optional
        we have to do this check to avoid `undefined` type error.
      */
      if (!authUser) {
        throw new Error("User not found.");
      }
      /*
        since we have already fetched authUser details in the jwt validation middleware
        and attached that object to ctx.authUser, either we can directly return that object
        or again fetch authUser detail from database and return the user */
      // ctx.response.body = { authUser };
      const { rows: user } = await client.execute(
        `SELECT * FROM users WHERE email = ? LIMIT 1`,
        [authUser.email],
      );
      if (!user || !user.length) {
        throw new Error("User not found.");
      }

      ctx.response.status = 200;
      ctx.response.headers.set("Content-Type", "application/json");
      ctx.response.body = JSON.stringify({
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

  update = async (ctx: Context): Promise<void> => {
    try {
      const authUser = ctx.user;
      if (!authUser) {
        throw new Error("User not found.");
      }

      const body = ctx.request.body({ type: "json" });
      const { user: payload } = await body.value;
      if (
        !payload.username && !payload.email && !payload.bio && !payload.image
      ) {
        throw new Error("Atleast 1 injectorField is required.");
      }

      // fields contain array of key and value e.g ['id', 1, 'email', 'xyz']
      const fields = [];
      for (const key of Object.keys(payload)) {
        if (key && payload[key]) {
          fields.push(...[key, payload[key]]);
        }
      }

      // injectorField will contain string like ` ?? = ?, ?? = ?`
      const injectorField = Array(fields.length / 2).fill(" ?? = ?").join(",");

      const { affectedRows: update } = await client.execute(
        `UPDATE users SET ${injectorField} WHERE email = ?`,
        [...fields, authUser.email],
      );
      if (!update || !(update > 0)) {
        throw new Error("Could not update details.");
      }

      const { rows: user } = await client.execute(
        `SELECT * FROM users WHERE email = ? LIMIT 1`,
        [authUser.email],
      );
      if (!user || !user.length) {
        throw new Error("User not found.");
      }

      ctx.response.status = 200;
      ctx.response.headers.set("Content-Type", "application/json");
      ctx.response.body = JSON.stringify({
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
}

export default new UserController();
