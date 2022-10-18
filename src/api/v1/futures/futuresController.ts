import { Context } from "koa";
import binance from "../../../Binance";
import { response } from "../../../constants/response";

export interface IPosition {
  longPositionAmt: string;
  longEnteryPrice: string;
  longMarkPrice: string;
  shortPositionAmt: string;
  shortEnteryPrice: string;
  shortMarkPrice: string;
}

export const getCoinPrices = async (ctx: Context) => {
  try {
    const { coin } = ctx.query;
    const prices = await binance.futuresMarkPrice(coin);
    ctx.status = response.HTTP_OK;
    return parseFloat(prices.markPrice);
  } catch (err) {
    console.log(err);
    ctx.status = response.HTTP_BAD_REQUEST;
    return 100;
  }
};

export const getBalances = async (ctx: Context) => {
  try {
    let balance;
    const balances = await binance.futuresBalance(),
      nums = Object.keys(balances);
    for (let num of nums) {
      let obj = balances[num];
      if (obj.asset == "USDT") {
        balance = obj.balance;
      }
    }
    ctx.status = response.HTTP_OK;
    return parseFloat(balance);
  } catch (err) {
    console.log(err);
    ctx.status = response.HTTP_BAD_REQUEST;
    return 100;
  }
};

export const futuresLongBuy = async (ctx: Context) => {
  try {
    const { coin, amt } = ctx.query;
    const MarketBuy = await binance.futuresMarketBuy(coin, amt, {
      positionSide: "LONG",
    });
    if (MarketBuy.code != null) {
      if (MarketBuy.code != -4164) {
        console.log(MarketBuy.msg);
        ctx.status = response.HTTP_BAD_REQUEST;
        return 100;
      }
    }
    console.log(MarketBuy);
    ctx.status = response.HTTP_OK;
    return 200;
  } catch (err) {
    console.log(err);
    ctx.status = response.HTTP_BAD_REQUEST;
    return 100;
  }
};

export const futuresLimitLongSell = async (ctx: Context) => {
  try {
    const { coin, amt, stopPrice } = ctx.query;
    const MarketSell = await binance.futuresSell(coin, amt, stopPrice, {
      positionSide: "LONG",
    });
    if (MarketSell.code != null) {
      if (MarketSell.code != -4164) {
        console.log(MarketSell.msg);
        ctx.status = response.HTTP_BAD_REQUEST;
        return 100;
      }
    }
    console.log(MarketSell);
    ctx.status = response.HTTP_OK;
    return 200;
  } catch (err) {
    console.log(err);
    return 100;
    ctx.status = response.HTTP_BAD_REQUEST;
  }
};

export const futuresStopLongSell = async (ctx: Context) => {
  try {
    const { coin, amt, stopPrice } = ctx.query;
    const MarketSell = await binance.futuresSell(coin, amt, {
      positionSide: "LONG",
      type: "STOP_MARKET",
      stopPrice: stopPrice,
    });
    if (MarketSell.code != null) {
      if (MarketSell.code != -4164) {
        console.log(MarketSell.msg);
        ctx.status = response.HTTP_BAD_REQUEST;
        return 100;
      }
    }
    console.log(MarketSell);
    ctx.status = response.HTTP_OK;
    return 200;
  } catch (err) {
    console.log(err);
    return 100;
    ctx.status = response.HTTP_BAD_REQUEST;
  }
};

export const futuresShortSell = async (ctx: Context) => {
  try {
    const { coin, amt } = ctx.query;
    const MarketSell = await binance.futuresMarketSell(coin, amt, {
      positionSide: "SHORT",
    });
    if (MarketSell.code != null) {
      if (MarketSell.code != -4164) {
        console.log(MarketSell.msg);
        ctx.status = response.HTTP_BAD_REQUEST;
        return 100;
      }
    }
    console.log(MarketSell);
    ctx.status = response.HTTP_OK;
    return 200;
  } catch (err) {
    console.log(err);
    ctx.status = response.HTTP_BAD_REQUEST;
    return 100;
  }
};

export const futuresLimitShortBuy = async (ctx: Context) => {
  try {
    const { coin, amt, stopPrice } = ctx.query;
    const MarketBuy = await binance.futuresBuy(coin, amt, stopPrice, {
      positionSide: "SHORT",
    });
    if (MarketBuy.code != null) {
      if (MarketBuy.code != -4164) {
        console.log(MarketBuy.msg);
        ctx.status = response.HTTP_BAD_REQUEST;
        return 100;
      }
    }
    console.log(MarketBuy);
    ctx.status = response.HTTP_OK;
    return 200;
  } catch (err) {
    console.log(err);
    ctx.status = response.HTTP_BAD_REQUEST;
    return 100;
  }
};

export const futuresStopShortBuy = async (ctx: Context) => {
  try {
    const { coin, amt, stopPrice } = ctx.query;
    const MarketBuy = await binance.futuresBuy(coin, amt, {
      positionSide: "SHORT",
      type: "STOP_MARKET",
      stopPrice: stopPrice,
    });
    if (MarketBuy.code != null) {
      if (MarketBuy.code != -4164) {
        console.log(MarketBuy.msg);
        ctx.status = response.HTTP_BAD_REQUEST;
        return 100;
      }
    }
    console.log(MarketBuy);
    ctx.status = response.HTTP_OK;
    return 200;
  } catch (err) {
    ctx.status = response.HTTP_BAD_REQUEST;
    console.log(err);
    return 100;
  }
};

export const cancelOrder = async (ctx: Context) => {
  try {
    const { coin } = ctx.query;
    const order = await binance.futuresCancelAll(coin);
    console.log(order);
    ctx.status = response.HTTP_OK;
    return;
  } catch (err) {
    ctx.status = response.HTTP_BAD_REQUEST;
    console.log(err);
  }
};

export const getPosition = async (ctx: Context) => {
  try {
    const { coin } = ctx.query;
    const data: IPosition = {
      longPositionAmt: "0",
      longEnteryPrice: "0",
      longMarkPrice: "0",
      shortPositionAmt: "0",
      shortEnteryPrice: "0",
      shortMarkPrice: "0",
    };
    const position_data = await binance.futuresPositionRisk(),
      markets = Object.keys(position_data);
    for (let market of markets) {
      let obj = position_data[market],
        size = Number(obj.positionAmt);
      if (size == 0 && obj.symbol != coin) continue;
      if (obj.positionSide == "LONG" && obj.symbol == coin) {
        data.longPositionAmt = obj.positionAmt;
        data.longEnteryPrice = obj.entryPrice;
        data.longMarkPrice = obj.markPrice;
      }
      if (obj.positionSide == "SHORT" && obj.symbol == coin) {
        data.shortPositionAmt = obj.positionAmt;
        data.shortEnteryPrice = obj.entryPrice;
        data.shortMarkPrice = obj.markPrice;
      }
    }
    ctx.body = data;
    ctx.status = response.HTTP_OK;
  } catch (err) {
    ctx.status = response.HTTP_BAD_REQUEST;
    console.log(err);
  }
};
