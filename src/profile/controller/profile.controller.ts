import { Context } from "../../types/oak.interface.ts";
import { helpers } from "https://deno.land/x/oak@v7.4.0/mod.ts";
import client from "../../../database/mysql.database.ts";

class ProfileController {
  show = async (ctx: Context): Promise<void> => {
    try {
      /*
      get username from url params
    */
      const { username } = helpers.getQuery(ctx, { mergeParams: true });
      if (!username) {
        ctx.response.status = 422;
        ctx.response.body = {
          errors: {
            username: ["Please provide username."],
          },
        };
        return;
      }

      const fields = [];
      let injectField = "SELECT * FROM user WHERE username = ? LIMIT 1";
      if (ctx.user) {
        fields.push(ctx.user.id);
        injectField =
          "SELECT user.*, count(follows.id) AS count FROM user LEFT JOIN follows ON follows.followerId = user.id AND id = ? WHERE username = ? GROUP BY user.id LIMIT 1";
      }

      const { rows } = await client.execute(injectField, [
        ...fields,
        username,
      ]);

      if (!rows || !rows.length) {
        throw new Error("peofile not found.");
      }

      const profile = {
        ...rows[0],
        following: rows[0]?.count ? true : false,
      };

      ctx.response.status = 200;
      ctx.response.headers.set("Content-Type", "application/json");
      ctx.response.body = JSON.stringify({ profile });
    } catch (error) {
      console.log(error);
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Something went wrong.",
        error: error.message || error,
      };
    }
  };

  follow = async (ctx: Context): Promise<void> => {};
  unFollow = async (ctx: Context): Promise<void> => {};
}

export default new ProfileController();
