import "dotenv/config";
import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import serve from "koa-static";
import send from "koa-send";
import api from "./api";

const app = new Koa();
const router = new Router();

const PORT = process.env.PORT || 8000;

const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

const corsOptions = {
  origin: "*",
  Credential: true,
};

console.log(process.env.NODE_ENV);
console.log(process.cwd());
router.use("/api", api.routes());

app.proxy = true;
app.use(bodyParser());
app.use(serve(process.cwd()));
app.use(cors(corsOptions));
app.use(router.routes()).use(router.allowedMethods());

app.use(async (ctx) => {
  await send(ctx, "index.html", { root: process.cwd() });
});

app.listen(PORT, handleListening);
