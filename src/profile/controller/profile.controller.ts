import { Context } from "../../types/oak.interface.ts";
import { helpers } from "https://deno.land/x/oak@v7.4.0/mod.ts";
import client from "../../../database/mysql.database.ts";
import { v4 } from "https://deno.land/std@0.95.0/uuid/mod.ts";

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
      let injectField = `SELECT * FROM user WHERE username = ? LIMIT 1`;
      if (ctx.user) {
        fields.push(ctx.user.id);
        injectField =
          `SELECT user.*, count(follows.id) AS count FROM user LEFT JOIN follows ON follows.followingId = user.id AND follows.followingId = ? WHERE username = ? GROUP BY user.id LIMIT 1`;
      }

      const { rows } = await client.execute(injectField, [
        ...fields,
        username,
      ]);

      if (!rows || !rows.length) {
        throw new Error("Profile not found.");
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

  follow = async (ctx: Context): Promise<void> => {
    try {
      const authUser = ctx.user;
      if (!authUser) {
        throw new Error("User not found.");
      }

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

      const { rows: user } = await client.execute(
        `SELECT user.*, count(follows.id) AS count FROM user LEFT JOIN follows ON follows.followingId = user.id AND follows.followingId = ? WHERE username = ? GROUP BY user.id LIMIT 1`,[authUser.id, username]
      );
      if (!user || !user.length) {
        throw new Error("User not found.");
      }

      if (user[0].count > 0) {
        throw new Error(`Cannot follow, you are already following ${username}.`);
      }

      const id = v4.generate();

      const { affectedRows } = await client.execute(
        `INSERT INTO (id, followerId, followingId) VALUES (?, ?, ?)`,
        [id, authUser.id, user[0].id],
      );
      if (!affectedRows || !(affectedRows > 0)) {
        throw new Error("Could not follow, please try again later.");
      }

      ctx.response.status = 200;
      ctx.response.headers.set("Content-Type", "application/json");
      ctx.response.body = JSON.stringify({
        profile: {
          ...user[0],
          following: true,
        },
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

  unFollow = async (ctx: Context): Promise<void> => {
    try {
      const authUser = ctx.user;
      if (!authUser) {
        throw new Error("User not found.");
      }

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

      const { rows: user } = await client.execute(
        `SELECT user.*, count(follows.id) AS count FROM user LEFT JOIN follows ON follows.followingId = user.id AND follows.followingId = ? WHERE username = ? GROUP BY user.id LIMIT 1`,[authUser.id, username]
      );
      if (!user || !user.length) {
        throw new Error("User not found.");
      }

      if (user[0].count === 0) {
        throw new Error(`Cannot unfollow, you are not following ${username}.`);
      }

      const { affectedRows } = await client.execute(
        `DELETE FROM follows WHERE followingId = ? AND followerId = ?`,
        [authUser.id, user[0].id],
      );
      if (!affectedRows || !(affectedRows > 0)) {
        throw new Error("Could not unfollow, please try again later.");
      }

      ctx.response.status = 200;
      ctx.response.headers.set("Content-Type", "application/json");
      ctx.response.body = JSON.stringify({
        profile: {
          ...user[0],
          following: false,
        },
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
