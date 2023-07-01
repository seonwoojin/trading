const Binance = require("node-binance-api");
require("dotenv").config();
const { google } = require("googleapis");
const keys = require("./credentials.json");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
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

async function cancleOrder(x) {
  try {
    let order = await binance.futuresCancelAll(x);
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
    const balance = Math.floor(await GetBalances());
    const amt = ((balance / coinPrices) * 5).toFixed(bbfix);
    let posAmt = amt;
    let MarketBuy = await binance.futuresMarketBuy(coinName, amt, {
      positionSide: "LONG",
    });
    await sleep(500);
    let position_data = await binance.futuresPositionRisk(),
      markets = Object.keys(position_data);
    for (let market of markets) {
      let obj = position_data[market],
        size = Number(obj.positionAmt);
      if (size == 0 && obj.symbol != coinName) continue;
      if (obj.positionSide == "LONG" && obj.symbol == coinName) {
        limitPrice = (obj.entryPrice * 1.01).toFixed(fix);
        stopPrice = (obj.entryPrice * 0.99).toFixed(fix);
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
      if (plusAmt >= posAmt * 1.9 && attempt == 0) {
        await cancleOrder(coinName);
        let position_data = await binance.futuresPositionRisk(),
          markets = Object.keys(position_data);
        for (let market of markets) {
          let obj = position_data[market],
            size = Number(obj.positionAmt);
          if (size == 0 && obj.symbol != coinName) continue;
          if (obj.positionSide == "LONG" && obj.symbol == coinName) {
            limitPrice = (obj.entryPrice * 1.01).toFixed(fix);
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
      if (plusAmt >= posAmt * 1.9 && attempt == 1) {
        await cancleOrder(coinName);
        let position_data = await binance.futuresPositionRisk(),
          markets = Object.keys(position_data);
        for (let market of markets) {
          let obj = position_data[market],
            size = Number(obj.positionAmt);
          if (size == 0 && obj.symbol != coinName) continue;
          if (obj.positionSide == "LONG" && obj.symbol == coinName) {
            limitPrice = (obj.entryPrice * 1.04).toFixed(fix);
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
            await cancleOrder(coinName);
            let MarketSell = await binance.futuresMarketSell(
              coinName,
              plusAmt,
              {
                positionSide: "LONG",
                type: "STOP_MARKET",
                stopPrice: entryPrice * (1 + per - 0.005),
              }
            );
            successPrice = entryPrice * (1 + per + 0.005);
            per = per + 0.005;
          }
          if (plusAmt === 0) {
            await cancleOrder(coinName);
            return;
          }
          await sleep(1000);
        }
      }
      if (plusAmt === 0) {
        await cancleOrder(coinName);
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
    const balance = Math.floor(await GetBalances());
    const amt = ((balance / coinPrices) * 5).toFixed(bbfix);
    let posAmt = amt;
    let MarketBuy = await binance.futuresMarketSell(coinName, amt, {
      positionSide: "SHORT",
    });
    await sleep(500);
    let position_data = await binance.futuresPositionRisk(),
      markets = Object.keys(position_data);
    for (let market of markets) {
      let obj = position_data[market],
        size = Number(obj.positionAmt);
      if (size == 0 && obj.symbol != coinName) continue;
      if (obj.positionSide == "SHORT" && obj.symbol == coinName) {
        limitPrice = (obj.entryPrice * 0.99).toFixed(fix);
        stopPrice = (obj.entryPrice * 1.01).toFixed(fix);
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
      if (plusAmt >= posAmt * 1.9 && attempt == 0) {
        await cancleOrder(coinName);
        let position_data = await binance.futuresPositionRisk(),
          markets = Object.keys(position_data);
        for (let market of markets) {
          let obj = position_data[market],
            size = Number(obj.positionAmt);
          if (size == 0 && obj.symbol != coinName) continue;
          if (obj.positionSide == "SHORT" && obj.symbol == coinName) {
            limitPrice = (obj.entryPrice * 0.99).toFixed(fix);
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
      if (plusAmt >= posAmt * 1.9 && attempt == 1) {
        await cancleOrder(coinName);
        let position_data = await binance.futuresPositionRisk(),
          markets = Object.keys(position_data);
        for (let market of markets) {
          let obj = position_data[market],
            size = Number(obj.positionAmt);
          if (size == 0 && obj.symbol != coinName) continue;
          if (obj.positionSide == "SHORT" && obj.symbol == coinName) {
            limitPrice = (obj.entryPrice * 0.96).toFixed(fix);
            stopPrice = (obj.entryPrice * 0.998).toFixed(fix);
            successPrice = obj.entryPrice * (1 - per);
            entryPrice = obj.entryPrice * 1;
          }
        }
        let limitSell = await binance.futuresBuy(
          coinName,
          shortAmt,
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
            await cancleOrder(coinName);
            let MarketSell = await binance.futuresMarketBuy(coinName, plusAmt, {
              positionSide: "SHORT",
              type: "STOP_MARKET",
              stopPrice: entryPrice * (1 - per + 0.005),
            });
            successPrice = entryPrice * (1 - per - 0.005);
            per = per + 0.005;
          }
          if (plusAmt === 0) {
            await cancleOrder(coinName);
            return;
          }
          await sleep(1000);
        }
        return;
      }
      if (plusAmt === 0) {
        await cancleOrder(coinName);
        return;
      }
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

async function main() {
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
    if (position !== 0) {
      let input = inputManager(client, coin, amountFix, priceFix);
      while (input === 100) {
        await sleep(1000);
        input = inputManager(client, coin, amountFix, priceFix);
      }
      if (position === 1) {
        await Long(coin, amountFix, priceFix);
      } else if (position === 2) {
        await Short(coin, amountFix, priceFix);
      }
    }
    await sleep(1000);
  }
}

main();
