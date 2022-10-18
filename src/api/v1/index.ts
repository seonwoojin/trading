import Router from "koa-router";
import futures from "./futures";

const v1 = new Router();

v1.use("/futures", futures.routes());

export default v1;
