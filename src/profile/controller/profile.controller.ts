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

      const { rows: profile } = await client.execute(
        `SELECT * FROM user username = ? INNER JOIN follows ON follows.followerId = user.id LIMIT 1`,
        [username],
      );
      if (!profile || !profile.length) {
        throw new Error("peofile not found.");
      }

      ctx.response.status = 200;
      ctx.response.headers.set("Content-Type", "application/json");
      ctx.response.body = JSON.stringify({
        profile: profile[0],
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

export default new ProfileController();
