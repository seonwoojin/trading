const Binance = require("node-binance-api");
require("dotenv").config();
const { google } = require("googleapis");
const keys = require("./credentials.json");
const { default: BigNumber } = require("bignumber.js");
const client = new google.auth.JWT(
  keys.client_email,

  null,

  keys.private_key,

  ["https://www.googleapis.com/auth/spreadsheets"] // 사용자 시트 및 해당 속성에 대한 읽기/쓰기 액세스 허용
);
let binance = new Binance().options({
  APIKEY: process.env.APIKEY,
  APISECRET: process.env.APISECRET,
  useServerTime: true,
  reconnect: true,
  recvWindow: 90000,
  verbose: true,
  hedgeMode: true,
  family: 4,
});

let json1 = {
  errornum: 0,
  positionAmt: "",
  entryPrice: "",
  unRealizedProfit: "",
  markPrice: "",
};
let json2 = {
  errornum: 0,
  positionAmt: "",
  entryPrice: "",
  unRealizedProfit: "",
  markPrice: "",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function GetPrices(coinname) {
  try {
    let prices = await binance.futuresMarkPrice(coinname);
    return parseFloat(prices.markPrice);
  } catch (err) {
    return 100000;
  }
}

async function GetBalances() {
  try {
    let balance;
    let balances = await binance.futuresBalance(),
      nums = Object.keys(balances);
    for (let num of nums) {
      let obj = balances[num];
      if (obj.asset == "USDT") {
        balance = obj.balance;
      }
    }
    return parseFloat(balance);
  } catch (err) {
    console.log(err);
    return 10;
  }
}

async function cancelOrder(x) {
  try {
    let order = await binance.futuresCancelAll(x);
    console.log(order);
  } catch (err) {
    console.log(err);
  }
}

async function cancelOrderId(x, id) {
  try {
    let order = await binance.cancel(
      x,
      { orderId: id },
      (error, response, symbol) => {
        console.info(symbol + " cancel response:", response);
      }
    );
    console.log(order);
  } catch (err) {
    console.log(err);
  }
}

async function plusBalance(coinname) {
  try {
    json1.errornum = 0;
    let position_data = await binance.futuresPositionRisk(),
      markets = Object.keys(position_data);
    for (let market of markets) {
      let obj = position_data[market],
        size = Number(obj.positionAmt);
      if (size == 0 && obj.symbol != coinname) continue;
      if (obj.positionSide == "LONG" && obj.symbol == coinname) {
        json1.positionAmt = obj.positionAmt;
        json1.entryPrice = obj.entryPrice;
        json1.unRealizedProfit = obj.unRealizedProfit;
        json1.markPrice = obj.markPrice;
      }
    }
    return json1;
  } catch (err) {
    json1.errornum = 1;
    return json1;
  }
}

async function minusBalance(coinname) {
  try {
    json2.errornum = 0;
    let position_data = await binance.futuresPositionRisk(),
      markets = Object.keys(position_data);
    for (let market of markets) {
      let obj = position_data[market],
        size = Number(obj.positionAmt);
      if (size == 0 && obj.symbol != coinname) continue;
      if (obj.positionSide == "SHORT" && obj.symbol == coinname) {
        json2.positionAmt = obj.positionAmt;
        json2.entryPrice = obj.entryPrice;
        json2.unRealizedProfit = obj.unRealizedProfit;
        json2.markPrice = obj.markPrice;
      }
    }
    return json2;
  } catch (err) {
    json2.errornum = 1;
    return json2;
  }
}

async function getplusAmt(json1) {
  try {
    let Amt = parseFloat(json1.positionAmt);
    return Amt;
  } catch (err) {
    console.log(err);
  }
}

async function getminusAmt(json2) {
  try {
    let Amt = parseFloat(json2.positionAmt) * -1;
    return Amt;
  } catch (err) {
    console.log(err);
  }
}

async function Leverage(x, y) {
  try {
    await binance.futuresLeverage(y, x);
  } catch (err) {
    console.log(err);
  }
}

async function Long(coinName, bbfix, fix) {
  try {
    let stopPrice;
    let limitPrice;
    let successPrice;
    let entryPrice;
    let attempt = 0;
    let per = 0.03;
    await binance.useServerTime();
    await Leverage(20, coinName);
    await sleep(1000);
    coinPrices = await GetPrices(coinName);
    while (coinPrices == 100000) {
      await sleep(1000);
      coinPrices = await GetPrices(coinName);
    }
    const balance = Math.floor(await GetBalances()) * 0.95;
    const amt = ((balance / coinPrices) * 5).toFixed(bbfix);
    let posAmt = amt;
    let MarketBuy = await binance.futuresMarketBuy(coinName, amt, {
      positionSide: "LONG",
    });
    await sleep(1000);
    let position_data = await binance.futuresPositionRisk(),
      markets = Object.keys(position_data);
    for (let market of markets) {
      let obj = position_data[market],
        size = Number(obj.positionAmt);
      if (size == 0 && obj.symbol != coinName) continue;
      if (obj.positionSide == "LONG" && obj.symbol == coinName) {
        limitPrice = (obj.entryPrice * 1.015).toFixed(fix);
        stopPrice = (obj.entryPrice * 0.99).toFixed(fix);
        entryPrice = obj.entryPrice * 1;
      }
    }
    let MarketSell = await binance.futuresMarketSell(coinName, amt, {
      positionSide: "LONG",
      type: "STOP_MARKET",
      stopPrice: stopPrice,
    });
    let limitBuy = await binance.futuresMarketBuy(coinName, amt, {
      positionSide: "LONG",
      type: "STOP_MARKET",
      stopPrice: limitPrice,
    });
    while (true) {
      json1 = await plusBalance(coinName);
      while (json1.errornum == 1) {
        await sleep(1000);
        json1 = await plusBalance(coinName);
      }
      plusAmt = await getplusAmt(json1);
      let markPrice = parseFloat(json1.markPrice);
      if (markPrice >= entryPrice * 1.01 && attempt == 0) {
        let MarketSell = await binance.futuresMarketSell(coinName, plusAmt, {
          positionSide: "LONG",
          type: "STOP_MARKET",
          stopPrice: (entryPrice * 1.002).toFixed(fix),
        });
        attempt++;
      }
      if (plusAmt >= posAmt * 1.9 && attempt == 1) {
        await cancelOrder(coinName);
        let position_data = await binance.futuresPositionRisk(),
          markets = Object.keys(position_data);
        for (let market of markets) {
          let obj = position_data[market],
            size = Number(obj.positionAmt);
          if (size == 0 && obj.symbol != coinName) continue;
          if (obj.positionSide == "LONG" && obj.symbol == coinName) {
            limitPrice = (obj.entryPrice * 1.015).toFixed(fix);
            stopPrice = (obj.entryPrice * 1.002).toFixed(fix);
          }
        }
        let limitBuy = await binance.futuresMarketBuy(coinName, plusAmt, {
          positionSide: "LONG",
          type: "STOP_MARKET",
          stopPrice: limitPrice,
        });
        posAmt = plusAmt;
        let MarketSell = await binance.futuresMarketSell(coinName, plusAmt, {
          positionSide: "LONG",
          type: "STOP_MARKET",
          stopPrice: stopPrice,
        });
        attempt++;
      }
      if (plusAmt >= posAmt * 1.9 && attempt == 2) {
        await cancelOrder(coinName);
        let position_data = await binance.futuresPositionRisk(),
          markets = Object.keys(position_data);
        for (let market of markets) {
          let obj = position_data[market],
            size = Number(obj.positionAmt);
          if (size == 0 && obj.symbol != coinName) continue;
          if (obj.positionSide == "LONG" && obj.symbol == coinName) {
            limitPrice = (obj.entryPrice * 1.05).toFixed(fix);
            stopPrice = (obj.entryPrice * 1.002).toFixed(fix);
            successPrice = obj.entryPrice * (1 + per);
            entryPrice = obj.entryPrice * 1;
          }
        }
        let limitSell = await binance.futuresSell(
          coinName,
          plusAmt,
          limitPrice,
          {
            positionSide: "LONG",
          }
        );
        let MarketSell = await binance.futuresMarketSell(coinName, plusAmt, {
          positionSide: "LONG",
          type: "STOP_MARKET",
          stopPrice: stopPrice,
        });
        attempt++;
        while (true) {
          json1 = await plusBalance(coinName);
          while (json1.errornum == 1) {
            await sleep(1000);
            json1 = await plusBalance(coinName);
          }
          plusAmt = await getplusAmt(json1);
          let markPrice = parseFloat(json1.markPrice);
          if (markPrice >= successPrice) {
            let MarketSell = await binance.futuresMarketSell(
              coinName,
              plusAmt,
              {
                positionSide: "LONG",
                type: "STOP_MARKET",
                stopPrice: entryPrice * (1 + per - 0.01),
              }
            );
            successPrice = entryPrice * (1 + per + 0.005);
            per = per + 0.005;
          }
          if (plusAmt === 0) {
            await cancelOrder(coinName);
            return;
          }
          await sleep(100);
        }
      }
      if (plusAmt === 0) {
        await cancelOrder(coinName);
        inputEnd(true);
        return;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function Short(coinName, bbfix, fix) {
  try {
    let stopPrice;
    let limitPrice;
    let successPrice;
    let entryPrice;
    let attempt = 0;
    let per = 0.03;
    await binance.useServerTime();
    await Leverage(20, coinName);
    await sleep(1000);
    coinPrices = await GetPrices(coinName);
    while (coinPrices == 100000) {
      await sleep(1000);
      coinPrices = await GetPrices(coinName);
    }
    const balance = Math.floor(await GetBalances()) * 0.95;
    const amt = ((balance / coinPrices) * 5).toFixed(bbfix);
    let posAmt = amt;
    let MarketBuy = await binance.futuresMarketSell(coinName, amt, {
      positionSide: "SHORT",
    });
    await sleep(1000);
    let position_data = await binance.futuresPositionRisk(),
      markets = Object.keys(position_data);
    for (let market of markets) {
      let obj = position_data[market],
        size = Number(obj.positionAmt);
      if (size == 0 && obj.symbol != coinName) continue;
      if (obj.positionSide == "SHORT" && obj.symbol == coinName) {
        limitPrice = (obj.entryPrice * 0.985).toFixed(fix);
        stopPrice = (obj.entryPrice * 1.01).toFixed(fix);
        entryPrice = obj.entryPrice * 1;
      }
    }
    let MarketSell = await binance.futuresMarketBuy(coinName, amt, {
      positionSide: "SHORT",
      type: "STOP_MARKET",
      stopPrice: stopPrice,
    });
    let limitSell = await binance.futuresMarketSell(coinName, amt, {
      positionSide: "SHORT",
      type: "STOP_MARKET",
      stopPrice: limitPrice,
    });
    while (true) {
      json1 = await minusBalance(coinName);
      while (json1.errornum == 1) {
        await sleep(1000);
        json1 = await minusBalance(coinName);
      }
      plusAmt = await getminusAmt(json1);
      let markPrice = parseFloat(json1.markPrice);
      if (markPrice <= entryPrice * 0.99 && attempt == 0) {
        let MarketSell = await binance.futuresMarketBuy(coinName, plusAmt, {
          positionSide: "SHORT",
          type: "STOP_MARKET",
          stopPrice: (entryPrice * 0.998).toFixed(fix),
        });
        attempt++;
      }
      if (plusAmt >= posAmt * 1.9 && attempt == 1) {
        await cancelOrder(coinName);
        let position_data = await binance.futuresPositionRisk(),
          markets = Object.keys(position_data);
        for (let market of markets) {
          let obj = position_data[market],
            size = Number(obj.positionAmt);
          if (size == 0 && obj.symbol != coinName) continue;
          if (obj.positionSide == "SHORT" && obj.symbol == coinName) {
            limitPrice = (obj.entryPrice * 0.985).toFixed(fix);
            stopPrice = (obj.entryPrice * 0.998).toFixed(fix);
          }
        }
        let limitSell = await binance.futuresMarketSell(coinName, plusAmt, {
          positionSide: "SHORT",
          type: "STOP_MARKET",
          stopPrice: limitPrice,
        });
        posAmt = plusAmt;
        let MarketSell = await binance.futuresMarketBuy(coinName, plusAmt, {
          positionSide: "SHORT",
          type: "STOP_MARKET",
          stopPrice: stopPrice,
        });
        attempt++;
      }
      if (plusAmt >= posAmt * 1.9 && attempt == 2) {
        await cancelOrder(coinName);
        let position_data = await binance.futuresPositionRisk(),
          markets = Object.keys(position_data);
        for (let market of markets) {
          let obj = position_data[market],
            size = Number(obj.positionAmt);
          if (size == 0 && obj.symbol != coinName) continue;
          if (obj.positionSide == "SHORT" && obj.symbol == coinName) {
            limitPrice = (obj.entryPrice * 0.95).toFixed(fix);
            stopPrice = (obj.entryPrice * 0.998).toFixed(fix);
            successPrice = obj.entryPrice * (1 - per);
            entryPrice = obj.entryPrice * 1;
          }
        }
        let limitSell = await binance.futuresBuy(
          coinName,
          plusAmt,
          limitPrice,
          {
            positionSide: "SHORT",
          }
        );
        let MarketSell = await binance.futuresMarketBuy(coinName, plusAmt, {
          positionSide: "SHORT",
          type: "STOP_MARKET",
          stopPrice: stopPrice,
        });
        attempt++;
        while (true) {
          json1 = await minusBalance(coinName);
          while (json1.errornum == 1) {
            await sleep(1000);
            json1 = await minusBalance(coinName);
          }
          plusAmt = await getminusAmt(json1);
          let markPrice = parseFloat(json1.markPrice);
          if (markPrice <= successPrice) {
            let MarketSell = await binance.futuresMarketBuy(coinName, plusAmt, {
              positionSide: "SHORT",
              type: "STOP_MARKET",
              stopPrice: entryPrice * (1 - per + 0.01),
            });
            successPrice = entryPrice * (1 - per - 0.005);
            per = per + 0.005;
          }
          if (plusAmt === 0) {
            await cancelOrder(coinName);
            inputEnd(true);
            return;
          }
          await sleep(100);
        }
        return;
      }
      if (plusAmt === 0) {
        await cancelOrder(coinName);
        inputEnd(true);
        return;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function LongScalpe(coinName, bbfix, fix) {
  try {
    let stopPrice;
    let limitPrice;
    let entryPrice;
    let attempt = 0;
    await binance.useServerTime();
    await Leverage(5, coinName);
    await sleep(1000);
    coinPrices = await GetPrices(coinName);
    while (coinPrices == 100000) {
      await sleep(1000);
      coinPrices = await GetPrices(coinName);
    }
    const balance = Math.floor(await GetBalances()) * 0.95;
    const amt = ((balance / coinPrices) * 5).toFixed(bbfix);
    let MarketBuy = await binance.futuresMarketBuy(coinName, amt, {
      positionSide: "LONG",
    });
    console.log(MarketBuy);
    await sleep(1000);
    let position_data = await binance.futuresPositionRisk(),
      markets = Object.keys(position_data);
    for (let market of markets) {
      let obj = position_data[market],
        size = Number(obj.positionAmt);
      if (size == 0 && obj.symbol != coinName) continue;
      if (obj.positionSide == "LONG" && obj.symbol == coinName) {
        limitPrice = (obj.entryPrice * 1.03).toFixed(fix);
        stopPrice = (obj.entryPrice * 0.99).toFixed(fix);
        entryPrice = obj.entryPrice * 1;
      }
    }
    let MarketSell = await binance.futuresMarketSell(coinName, amt, {
      positionSide: "LONG",
      type: "STOP_MARKET",
      stopPrice: stopPrice,
    });
    let limitSell = await binance.futuresSell(coinName, amt, limitPrice, {
      positionSide: "LONG",
    });
    while (true) {
      json1 = await plusBalance(coinName);
      while (json1.errornum == 1) {
        await sleep(1000);
        json1 = await plusBalance(coinName);
      }
      plusAmt = await getplusAmt(json1);
      let markPrice = parseFloat(json1.markPrice);
      if (markPrice >= entryPrice * 1.01 && attempt == 0) {
        let position_data = await binance.futuresPositionRisk(),
          markets = Object.keys(position_data);
        for (let market of markets) {
          let obj = position_data[market],
            size = Number(obj.positionAmt);
          if (size == 0 && obj.symbol != coinName) continue;
          if (obj.positionSide == "LONG" && obj.symbol == coinName) {
            stopPrice = (obj.entryPrice * 1.002).toFixed(fix);
          }
        }
        let MarketSell = await binance.futuresMarketSell(coinName, plusAmt, {
          positionSide: "LONG",
          type: "STOP_MARKET",
          stopPrice: stopPrice,
        });
        attempt++;
      }
      if (markPrice >= entryPrice * 1.02 && attempt == 1) {
        let position_data = await binance.futuresPositionRisk(),
          markets = Object.keys(position_data);
        for (let market of markets) {
          let obj = position_data[market],
            size = Number(obj.positionAmt);
          if (size == 0 && obj.symbol != coinName) continue;
          if (obj.positionSide == "LONG" && obj.symbol == coinName) {
            stopPrice = (obj.entryPrice * 1.01).toFixed(fix);
          }
        }
        let MarketSell = await binance.futuresMarketSell(coinName, plusAmt, {
          positionSide: "LONG",
          type: "STOP_MARKET",
          stopPrice: stopPrice,
        });
        attempt++;
      }
      if (plusAmt === 0) {
        await cancelOrder(coinName);
        inputEnd(true);
        return;
      }
      await sleep(100);
    }
  } catch (error) {
    console.log(error);
  }
}

async function ShortScalpe(coinName, bbfix, fix) {
  try {
    let stopPrice;
    let limitPrice;
    let entryPrice;
    let attempt = 0;
    await binance.useServerTime();
    await Leverage(5, coinName);
    await sleep(1000);
    coinPrices = await GetPrices(coinName);
    while (coinPrices == 100000) {
      await sleep(1000);
      coinPrices = await GetPrices(coinName);
    }
    const balance = Math.floor(await GetBalances()) * 0.95;
    const amt = ((balance / coinPrices) * 5).toFixed(bbfix);
    console.log(amt);
    let posAmt = amt;
    let MarketBuy = await binance.futuresMarketSell(coinName, amt, {
      positionSide: "SHORT",
    });
    await sleep(1000);
    let position_data = await binance.futuresPositionRisk(),
      markets = Object.keys(position_data);
    for (let market of markets) {
      let obj = position_data[market],
        size = Number(obj.positionAmt);
      if (size == 0 && obj.symbol != coinName) continue;
      if (obj.positionSide == "SHORT" && obj.symbol == coinName) {
        limitPrice = (obj.entryPrice * 0.97).toFixed(fix);
        stopPrice = (obj.entryPrice * 1.01).toFixed(fix);
        entryPrice = obj.entryPrice * 1;
      }
    }
    let MarketSell = await binance.futuresMarketBuy(coinName, amt, {
      positionSide: "SHORT",
      type: "STOP_MARKET",
      stopPrice: stopPrice,
    });
    let limitSell = await binance.futuresBuy(coinName, amt, limitPrice, {
      positionSide: "SHORT",
    });
    while (true) {
      json1 = await minusBalance(coinName);
      while (json1.errornum == 1) {
        await sleep(1000);
        json1 = await minusBalance(coinName);
      }
      plusAmt = await getminusAmt(json1);
      let markPrice = parseFloat(json1.markPrice);
      if (markPrice <= entryPrice * 0.99 && attempt == 0) {
        let position_data = await binance.futuresPositionRisk(),
          markets = Object.keys(position_data);
        for (let market of markets) {
          let obj = position_data[market],
            size = Number(obj.positionAmt);
          if (size == 0 && obj.symbol != coinName) continue;
          if (obj.positionSide == "SHORT" && obj.symbol == coinName) {
            stopPrice = (obj.entryPrice * 0.998).toFixed(fix);
          }
        }
        let MarketSell = await binance.futuresMarketBuy(coinName, plusAmt, {
          positionSide: "SHORT",
          type: "STOP_MARKET",
          stopPrice: stopPrice,
        });
        attempt++;
      }
      if (markPrice <= entryPrice * 0.98 && attempt == 1) {
        let position_data = await binance.futuresPositionRisk(),
          markets = Object.keys(position_data);
        for (let market of markets) {
          let obj = position_data[market],
            size = Number(obj.positionAmt);
          if (size == 0 && obj.symbol != coinName) continue;
          if (obj.positionSide == "SHORT" && obj.symbol == coinName) {
            stopPrice = (obj.entryPrice * 0.99).toFixed(fix);
          }
        }
        let MarketSell = await binance.futuresMarketBuy(coinName, plusAmt, {
          positionSide: "SHORT",
          type: "STOP_MARKET",
          stopPrice: stopPrice,
        });
        attempt++;
      }
      if (plusAmt === 0) {
        await cancelOrder(coinName);
        inputEnd(true);
        return;
      }
      await sleep(100);
    }
  } catch (error) {
    console.log(error);
  }
}

async function bug(coinName, bbfix, fix) {
  try {
    await binance.useServerTime();
    await Leverage(10, coinName);
    await sleep(1000);
    coinPrices = await GetPrices(coinName);
    while (coinPrices == 100000) {
      await sleep(1000);
      coinPrices = await GetPrices(coinName);
    }
    const balance = Math.floor(await GetBalances()) * 0.95;
    const amt = ((balance / coinPrices) * 5).toFixed(bbfix);
    let MarketBuy = await binance.futuresMarketBuy(coinName, amt, {
      positionSide: "LONG",
    });
    let MarketSell = await binance.futuresMarketSell(coinName, amt, {
      positionSide: "SHORT",
    });
    await sleep(1000);
    let position_data = await binance.futuresPositionRisk(),
      markets = Object.keys(position_data);
    for (let market of markets) {
      let obj = position_data[market],
        size = Number(obj.positionAmt);
      if (size == 0 && obj.symbol != coinName) continue;
      if (obj.positionSide == "SHORT" && obj.symbol == coinName) {
        limitPrice = (obj.entryPrice * 0.99).toFixed(fix);
        stopPrice = (obj.entryPrice * 1.005).toFixed(fix);
        let MarketSell = await binance.futuresMarketBuy(coinName, amt, {
          positionSide: "SHORT",
          type: "STOP_MARKET",
          stopPrice: stopPrice,
        });
        let limitSell = await binance.futuresBuy(coinName, amt, limitPrice, {
          positionSide: "SHORT",
        });
      }
      if (obj.positionSide == "LONG" && obj.symbol == coinName) {
        limitPrice = (obj.entryPrice * 1.01).toFixed(fix);
        stopPrice = (obj.entryPrice * 0.995).toFixed(fix);
        let MarketSell = await binance.futuresMarketSell(coinName, amt, {
          positionSide: "LONG",
          type: "STOP_MARKET",
          stopPrice: stopPrice,
        });
        let limitSell = await binance.futuresSell(coinName, amt, limitPrice, {
          positionSide: "LONG",
        });
      }
    }
    while (true) {
      json1 = await plusBalance(coinName);
      while (json1.errornum == 1) {
        await sleep(1000);
        json1 = await plusBalance(coinName);
      }
      let plusAmt = await getplusAmt(json1);
      json2 = await minusBalance(coinName);
      while (json2.errornum == 1) {
        await sleep(1000);
        json2 = await minusBalance(coinName);
      }
      let minusAmt = await getminusAmt(json2);
      if (plusAmt === 0 && minusAmt === 0) {
        await cancelOrder(coinName);
        inputEnd(true);
        return;
      }
      await sleep(100);
    }
  } catch (error) {
    console.log(error);
  }
}

async function bugTwo(coinName, bbfix, fix) {
  try {
    let longStopPrice;
    let shortStopPrice;
    let longLimitPrice;
    let shortLimitPrice;
    let longStartPrice;
    let shortStartPrice;
    let successPrice;
    let longEntryPrice;
    let shortEntryPrice;
    let attempt = 0;
    let per = 0.02;
    let dir = "NONE";
    await binance.useServerTime();
    await Leverage(40, coinName);
    await sleep(1000);
    let change = false;
    let change2 = false;
    coinPrices = await GetPrices(coinName);
    while (coinPrices == 100000) {
      await sleep(1000);
      coinPrices = await GetPrices(coinName);
    }
    const balance = Math.floor(await GetBalances()) * 0.95;
    const hedgeAmt = ((balance / coinPrices) * 5).toFixed(bbfix);
    const amt = (((balance / coinPrices) * 5) / 2).toFixed(bbfix);
    const allAmt = (hedgeAmt * 1 + amt * 1).toFixed(bbfix);
    let MarketBuy = await binance.futuresMarketBuy(coinName, allAmt, {
      positionSide: "LONG",
    });
    let posAmt = amt;
    let MarketSell = await binance.futuresMarketSell(coinName, allAmt, {
      positionSide: "SHORT",
    });
    await sleep(1000);
    let position_data = await binance.futuresPositionRisk(),
      markets = Object.keys(position_data);
    for (let market of markets) {
      let obj = position_data[market],
        size = Number(obj.positionAmt);
      if (size == 0 && obj.symbol != coinName) continue;
      if (obj.positionSide == "SHORT" && obj.symbol == coinName) {
        shortLimitPrice = (obj.entryPrice * 0.98).toFixed(fix);
        shortStopPrice = (obj.entryPrice * 1.01).toFixed(fix);
        shortEntryPrice = obj.entryPrice * 1;
        shortStartPrice = obj.entryPrice * 1;
        let limitPrice = (obj.entryPrice * 0.99).toFixed(fix);
        let stopPrice = (obj.entryPrice * 1.02).toFixed(fix);
        let MarketSell = await binance.futuresMarketBuy(coinName, hedgeAmt, {
          positionSide: "SHORT",
          type: "STOP_MARKET",
          stopPrice: stopPrice,
        });
        let limitSell = await binance.futuresBuy(coinName, allAmt, limitPrice, {
          positionSide: "SHORT",
        });
        shortOrderId = new BigNumber(limitSell.orderId);
        let MarketSell2 = await binance.futuresMarketBuy(coinName, amt, {
          positionSide: "SHORT",
          type: "STOP_MARKET",
          stopPrice: shortStopPrice,
        });
      }
      if (obj.positionSide == "LONG" && obj.symbol == coinName) {
        longLimitPrice = (obj.entryPrice * 1.02).toFixed(fix);
        longStopPrice = (obj.entryPrice * 0.99).toFixed(fix);
        longEntryPrice = obj.entryPrice * 1;
        longStartPrice = obj.entryPrice * 1;
        let limitPrice = (obj.entryPrice * 1.01).toFixed(fix);
        let stopPrice = (obj.entryPrice * 0.98).toFixed(fix);
        let MarketSell = await binance.futuresMarketSell(coinName, hedgeAmt, {
          positionSide: "LONG",
          type: "STOP_MARKET",
          stopPrice: stopPrice,
        });
        let limitSell = await binance.futuresSell(
          coinName,
          allAmt,
          limitPrice,
          {
            positionSide: "LONG",
          }
        );
        let MarketSell2 = await binance.futuresMarketSell(coinName, amt, {
          positionSide: "LONG",
          type: "STOP_MARKET",
          stopPrice: longStopPrice,
        });
      }
    }
    while (true) {
      json1 = await plusBalance(coinName);
      while (json1.errornum == 1) {
        await sleep(1000);
        json1 = await plusBalance(coinName);
      }
      let plusAmt = await getplusAmt(json1);
      json2 = await minusBalance(coinName);
      while (json2.errornum == 1) {
        await sleep(1000);
        json2 = await minusBalance(coinName);
      }
      let minusAmt = await getminusAmt(json2);
      let markPrice = parseFloat(json1.markPrice);
      if (plusAmt === 0 && minusAmt === hedgeAmt * 1 && !change) {
        await cancelOrder(coinName);
        let limitBuy = await binance.futuresMarketBuy(coinName, allAmt, {
          positionSide: "LONG",
          type: "STOP_MARKET",
          stopPrice: (longEntryPrice * 1.02).toFixed(fix),
        });
        let limitSell = await binance.futuresBuy(
          coinName,
          minusAmt,
          (shortEntryPrice * 0.999).toFixed(fix),
          {
            positionSide: "SHORT",
          }
        );
        dir = "LONG";
        change = true;
      }
      if (plusAmt === hedgeAmt * 1 && minusAmt === 0 && !change) {
        await cancelOrder(coinName);
        let limitSell2 = await binance.futuresMarketSell(coinName, allAmt, {
          positionSide: "SHORT",
          type: "STOP_MARKET",
          stopPrice: (entryPrice * 0.98).toFixed(fix),
        });
        let limitSell = await binance.futuresSell(
          coinName,
          plusAmt,
          (longEntryPrice * 1.001).toFixed(fix),
          {
            positionSide: "LONG",
          }
        );
        longOrderId = new BigNumber(limitSell.orderId);
        dir = "SHORT";
        change = true;
      }
      if (plusAmt >= allAmt * 0.9 && change && dir === "LONG") {
        let position_data = await binance.futuresPositionRisk(),
          markets = Object.keys(position_data);
        for (let market of markets) {
          let obj = position_data[market],
            size = Number(obj.positionAmt);
          if (size == 0 && obj.symbol != coinName) continue;
          if (obj.positionSide == "LONG" && obj.symbol == coinName) {
            let limitPrice = (obj.entryPrice * 1.05).toFixed(fix);
            let stopPrice = (obj.entryPrice * 0.995).toFixed(fix);
            successPrice = obj.entryPrice * (1 + per);
            longEntryPrice = obj.entryPrice * 1;
            let limitSell = await binance.futuresSell(
              coinName,
              plusAmt,
              limitPrice,
              {
                positionSide: "LONG",
              }
            );
            let MarketSell = await binance.futuresMarketSell(
              coinName,
              plusAmt,
              {
                positionSide: "LONG",
                type: "STOP_MARKET",
                stopPrice: stopPrice,
              }
            );
          }
        }
        while (true) {
          json1 = await plusBalance(coinName);
          while (json1.errornum == 1) {
            await sleep(1000);
            json1 = await plusBalance(coinName);
          }
          plusAmt = await getplusAmt(json1);
          let markPrice = parseFloat(json1.markPrice);
          if (markPrice >= successPrice) {
            let MarketSell = await binance.futuresMarketSell(
              coinName,
              plusAmt,
              {
                positionSide: "LONG",
                type: "STOP_MARKET",
                stopPrice: longEntryPrice * (1 + per - 0.005),
              }
            );
            successPrice = longEntryPrice * (1 + per + 0.005);
            per = per + 0.005;
          }
          if (plusAmt === 0) {
            await cancelOrder(coinName);
            inputEnd(true);
            return;
          }
          await sleep(250);
        }
      }

      if (minusAmt >= allAmt * 0.9 && change && dir === "SHORT") {
        let position_data = await binance.futuresPositionRisk(),
          markets = Object.keys(position_data);
        for (let market of markets) {
          let obj = position_data[market],
            size = Number(obj.positionAmt);
          if (size == 0 && obj.symbol != coinName) continue;
          if (obj.positionSide == "SHORT" && obj.symbol == coinName) {
            let limitPrice = (obj.entryPrice * 0.95).toFixed(fix);
            let stopPrice = (obj.entryPrice * 0.105).toFixed(fix);
            successPrice = obj.entryPrice * (1 - per);
            shortEntryPrice = obj.entryPrice * 1;
            let limitSell = await binance.futuresBuy(
              coinName,
              minusAmt,
              limitPrice,
              {
                positionSide: "SHORT",
              }
            );
            let MarketSell = await binance.futuresMarketBuy(
              coinName,
              minusAmt,
              {
                positionSide: "SHORT",
                type: "STOP_MARKET",
                stopPrice: stopPrice,
              }
            );
          }
        }

        while (true) {
          json2 = await minusBalance(coinName);
          while (json2.errornum == 1) {
            await sleep(1000);
            json2 = await minusBalance(coinName);
          }
          minusAmt = await getminusAmt(json2);
          let markPrice = parseFloat(json2.markPrice);
          if (markPrice <= successPrice) {
            let MarketSell = await binance.futuresMarketBuy(
              coinName,
              minusAmt,
              {
                positionSide: "SHORT",
                type: "STOP_MARKET",
                stopPrice: entryPrice * (1 - per + 0.005),
              }
            );
            successPrice = entryPrice * (1 - per - 0.005);
            per = per + 0.005;
          }
          if (minusAmt === 0) {
            await cancelOrder(coinName);
            inputEnd(true);
            return;
          }
          await sleep(250);
        }
      }

      if (plusAmt === 0 && minusAmt === 0 && change) {
        await cancelOrder(coinName);
        inputEnd(true);
        return;
      }
      await sleep(250);
    }
  } catch (error) {
    console.log(error);
  }
}
async function getManager(client) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    const request = {
      spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",

      range: "manager!A2:D2",
    };

    const response = (await sheets.spreadsheets.values.get(request)).data;
    return response.values[0];
  } catch (error) {
    console.log(error);
    return ["100"];
  }
}

async function getManagerStop(client) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    const request = {
      spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",

      range: "manager!A4",
    };

    const response = (await sheets.spreadsheets.values.get(request)).data;
    console.log(response.values);
    return response.values[0][0];
  } catch (error) {
    console.log(error);
    return ["100"];
  }
}

async function inputManager(client, coinName, bbfix, fix) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    memberArray[0] = new Array(coinName, bbfix.toString(), fix.toString(), "0");
    let inp = "manager!A2";
    const request = {
      spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
      range: inp, // 범위를 지정해 주지 않으면 A1 행부터 데이터를 덮어 씌운다.
      valueInputOption: "USER_ENTERED",
      resource: { values: memberArray },
    };
    const response = await sheets.spreadsheets.values.update(request);
    return 1;
  } catch (error) {
    console.log(error);
    return 100;
  }
}

async function inputEnd(bool) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    memberArray[0] = new Array(bool ? "End" : "Progress");
    let inp = "manager!E2";
    const request = {
      spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
      range: inp, // 범위를 지정해 주지 않으면 A1 행부터 데이터를 덮어 씌운다.
      valueInputOption: "USER_ENTERED",
      resource: { values: memberArray },
    };
    const response = await sheets.spreadsheets.values.update(request);

    return 1;
  } catch (error) {
    console.log(error);
    return 100;
  }
}

async function main2() {
  while (true) {
    let array = await getManager(client);
    while (array[0] * 1 == 100) {
      await sleep(1000);
      array = await getManager(client);
    }
    const coin = array[0];
    const amountFix = array[1] * 1;
    const priceFix = array[2] * 1;
    const position = array[3] * 1;
    // if (position !== 0) {
    //   if (position !== 6) {
    //     inputEnd(false);
    //     let input = inputManager(client, coin, amountFix, priceFix);
    //     while (input === 100) {
    //       await sleep(1000);
    //       input = inputManager(client, coin, amountFix, priceFix);
    //     }
    //     if (position === 1) {
    //       await Long(coin, amountFix, priceFix);
    //     } else if (position === 2) {
    //       await Short(coin, amountFix, priceFix);
    //     } else if (position === 3) {
    //       await LongScalpe(coin, amountFix, priceFix);
    //     } else if (position === 4) {
    //       await ShortScalpe(coin, amountFix, priceFix);
    //     } else if (position === 5) {
    //       await bug(coin, amountFix, priceFix);
    //     }
    //   } else if (position === 6) {
    //     inputEnd(false);
    //     await bugTwo("BTCUSDT", 3, 1);
    //   }
    // }
    if (position !== 0) {
      setTimeout(async () => {
        inputEnd(false);
        let input = inputManager(client, coin, amountFix, priceFix);
        while (input === 100) {
          await sleep(1000);
          input = inputManager(client, coin, amountFix, priceFix);
        }
      }, 3000);
      if (position === 1) {
        await Long(coin, amountFix, priceFix);
      } else if (position === 2) {
        await Short(coin, amountFix, priceFix);
      } else if (position === 3) {
        await LongScalpe(coin, amountFix, priceFix);
      } else if (position === 4) {
        await ShortScalpe(coin, amountFix, priceFix);
      } else if (position === 5) {
        await bug(coin, amountFix, priceFix);
      } else if (position === 6) {
        await bugTwo("ETHUSDT", 3, 2);
      }
    }
    await sleep(2500);
  }
}

async function main() {
  while (true) {
    await bugTwo("ETHUSDT", 3, 2);
    const abc = await getManagerStop(client);
    if (abc * 1 === 1) return;
    await sleep(2500);
  }
}

main();
