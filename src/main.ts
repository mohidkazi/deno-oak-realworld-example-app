import env from "../config.ts";
import { Application } from "https://deno.land/x/oak/mod.ts";
import router from "./main.router.ts";

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log("server running on port ", env.PORT);

(
    async () => await app.listen({ port: Number(env.PORT) })
)();
