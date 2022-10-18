import { Context } from "koa";
import Router from "koa-router";
import v1 from "./v1";

const api = new Router();

api.get("/", (ctx: Context) => {
  ctx.body = "Hello";
});

api.use("/v1", v1.routes());

export default api;
