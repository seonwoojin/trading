import Router from "koa-router";
import {
  getCoinPrices,
  getBalances,
  futuresLimitLongSell,
  futuresLimitShortBuy,
  futuresLongBuy,
  futuresShortSell,
  futuresStopLongSell,
  futuresStopShortBuy,
  cancelOrder,
  getPosition,
} from "./futuresController";

const futures = new Router();

futures.get("/prices", getCoinPrices);
futures.get("/balances", getBalances);
futures.get("/long/sell/limit", futuresLimitLongSell);
futures.get("/short/buy/limit", futuresLimitShortBuy);
futures.get("/long/buy", futuresLongBuy);
futures.get("/short/sell", futuresShortSell);
futures.get("/long/sell/stop", futuresStopLongSell);
futures.get("/short/sell/stop", futuresStopShortBuy);
futures.get("/cancel", cancelOrder);
futures.get("/position", getPosition);

export default futures;
