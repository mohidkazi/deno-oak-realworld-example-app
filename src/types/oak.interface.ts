import { Context as OakContext } from "https://deno.land/x/oak@v7.4.0/mod.ts";
import { UserType } from "../user/types/user.types.ts";

// deno does not support module augmentation
/*declare module "https://deno.land/x/oak@v7.4.0/mod.ts" {
  interface Context {
    user?: UserType;
  }
}
*/

export class Context extends OakContext {
  user?: UserType;
}
