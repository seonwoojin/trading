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
let leve;
let bb;
let bb2;
let ris;
let longOrdernum;
let failTry;
let maxFailtry = 0;
let shortOrdernum;
let cont = 0;
let cont2;
let amt;
let badProfit = 0;
let min = 0;
let success = 0;
let success2 = 0;
let plussuccess = 0;
let minussuccess = 0;
let profit1 = 0.7; // 안보임
let profit2 = profit1; // 잘 되는 쪽
let profit3 = profit1;
let profit4 = profit1;
let profit5 = 0.7; // 잘 안되는 쪽
let fail = 0;
let fee2 = 0;
let select;
let longmin;
let shortmin;
let plusfee;
let minusfee;
let direction;
let change = 0;
let realfee;
let good = 0;
let fix;
let bbfix;
let long;
let short;
let tail;
let flag;
let totalProfit = 0;
let successFail = 0;

async function inputMoney(client, balance) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    memberArray[0] = new Array(balance.toString());
    let inp = "manager!D2";
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

async function inputDate(client, time) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    memberArray[0] = new Array(time);
    let inp = "manager!F2";
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getError() {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
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

async function FuturesLongBuy(x, y) {
  try {
    let MarketBuy = await binance.futuresMarketBuy(y, x, {
      positionSide: "LONG",
    });
    if (MarketBuy.code != null) {
      if (MarketBuy.code != -4164) {
        console.log(MarketBuy.msg);
        console.log(x, y);
        return 1000;
      }
    }
    console.log(MarketBuy);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function enterPosition(
  longAmt,
  shortAmt,
  coinName,
  positionDir,
  longFailure,
  shortFailure
) {
  try {
    let longStopPrice;
    let longLimitPrice;
    let shortStopPrice;
    let shortLimitPrice;
    let MarketBuy1 = await binance.futuresMarketBuy(coinName, longAmt, {
      positionSide: "LONG",
    });
    if (MarketBuy1.code != null) {
      if (MarketBuy1.code != -4164) {
        console.log(MarketBuy1.msg);
        return 1000;
      }
    }
    let MarketSell1 = await binance.futuresMarketSell(coinName, shortAmt, {
      positionSide: "SHORT",
    });
    if (MarketSell1.code != null) {
      if (MarketSell1.code != -4164) {
        console.log(MarketSell1.msg);
        return 1000;
      }
    }
    await sleep(500);
    let position_data = await binance.futuresPositionRisk(),
      markets = Object.keys(position_data);
    for (let market of markets) {
      let obj = position_data[market],
        size = Number(obj.positionAmt);
      if (size == 0 && obj.symbol != coinName) continue;
      if (obj.positionSide == "LONG" && obj.symbol == coinName) {
        if (positionDir === "LONG" && longFailure + shortFailure > 0) {
          longLimitPrice = (obj.entryPrice * 1.02).toFixed(fix);
          longStopPrice = (obj.entryPrice * 0.985).toFixed(fix);
          shortLimitPrice = (obj.entryPrice * 0.985).toFixed(fix);
          shortStopPrice = (obj.entryPrice * 1.02).toFixed(fix);
        } else if (positionDir === "NONE" || longFailure + shortFailure == 0) {
          longLimitPrice = (obj.entryPrice * 1.02).toFixed(fix);
          longStopPrice = (obj.entryPrice * 0.985).toFixed(fix);
        }
      }
      if (obj.positionSide == "SHORT" && obj.symbol == coinName) {
        if (positionDir === "SHORT" && longFailure + shortFailure > 0) {
          shortLimitPrice = (obj.entryPrice * 0.98).toFixed(fix);
          shortStopPrice = (obj.entryPrice * 1.015).toFixed(fix);
          longLimitPrice = (obj.entryPrice * 1.015).toFixed(fix);
          longStopPrice = (obj.entryPrice * 0.98).toFixed(fix);
        } else if (positionDir === "NONE" || longFailure + shortFailure == 0) {
          shortLimitPrice = (obj.entryPrice * 0.98).toFixed(fix);
          shortStopPrice = (obj.entryPrice * 1.015).toFixed(fix);
        }
      }
    }
    let MarketSell = await binance.futuresMarketSell(coinName, longAmt, {
      positionSide: "LONG",
      type: "STOP_MARKET",
      stopPrice: longStopPrice,
    });
    if (MarketSell.code != null) {
      if (MarketSell.code != -4164) {
        console.log(MarketSell.msg);
        return 1000;
      }
    }
    let limitSell = await binance.futuresSell(
      coinName,
      longAmt,
      longLimitPrice,
      {
        positionSide: "LONG",
      }
    );
    if (limitSell.code != null) {
      if (limitSell.code != -4164) {
        console.log(limitSell.msg);
        return 1000;
      }
    }
    let MarketBuy = await binance.futuresMarketBuy(coinName, shortAmt, {
      positionSide: "SHORT",
      type: "STOP_MARKET",
      stopPrice: shortStopPrice,
    });
    if (MarketBuy.code != null) {
      if (MarketBuy.code != -4164) {
        console.log(MarketBuy.msg);
        return 1000;
      }
    }
    let limitBuy = await binance.futuresBuy(
      coinName,
      shortAmt,
      shortLimitPrice,
      {
        positionSide: "SHORT",
      }
    );
    if (limitBuy.code != null) {
      if (limitBuy.code != -4164) {
        console.log(limitBuy.msg);
        return 1000;
      }
    }
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FuturesstopLongBuy(x, y, z) {
  try {
    let MarketBuy = await binance.futuresMarketBuy(y, x, {
      positionSide: "LONG",
      type: "STOP_MARKET",
      stopPrice: z,
    });
    if (MarketBuy.code != null) {
      if (MarketBuy.code != -4164) {
        console.log(MarketBuy.msg);
        console.log(x, y, z);
        return 1000;
      }
    }
    console.log(MarketBuy);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FutureslimitLongBuy(x, y, z) {
  try {
    let MarketBuy = await binance.futuresBuy(y, x, z, { positionSide: "LONG" });
    if (MarketBuy.code != null) {
      if (MarketBuy.code != -4164) {
        console.log(MarketBuy.msg);
        console.log(x, y, z);
        return 1000;
      }
    }
    console.log(MarketBuy);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FuturestakelimitLongBuy(x, y, z) {
  try {
    let MarketBuy = await binance.futuresBuy(y, x, z, {
      positionSide: "LONG",
      type: "TAKE_PROFIT",
      stopPrice: z,
    });
    if (MarketBuy.code != null) {
      if (MarketBuy.code != -4164) {
        console.log(MarketBuy.msg);
        console.log(x, y, z);
        return 1000;
      }
    }
    console.log(MarketBuy);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FuturesstoplimitLongBuy(x, y, z) {
  try {
    let MarketBuy = await binance.futuresBuy(y, x, z, {
      positionSide: "LONG",
      type: "STOP",
      stopPrice: z,
    });
    if (MarketBuy.code != null) {
      if (MarketBuy.code != -4164) {
        console.log(MarketBuy.msg);
        console.log(x, y, z);
        return 1000;
      }
    }
    console.log(MarketBuy);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FuturesShortBuy(x, y) {
  try {
    let MarketBuy = await binance.futuresMarketBuy(y, x, {
      positionSide: "SHORT",
    });
    if (MarketBuy.code != null) {
      if (MarketBuy.code != -4164) {
        console.log(MarketBuy.msg);
        console.log(x, y);
        return 1000;
      }
    }
    console.log(MarketBuy);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FuturesstopShortBuy(x, y, z) {
  try {
    let MarketBuy = await binance.futuresMarketBuy(y, x, {
      positionSide: "SHORT",
      type: "STOP_MARKET",
      stopPrice: z,
    });
    if (MarketBuy.code != null) {
      if (MarketBuy.code != -4164) {
        console.log(MarketBuy.msg);
        console.log(x, y, z);
        return 1000;
      }
    }
    console.log(MarketBuy);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FutureslimitShortBuy(x, y, z) {
  try {
    let MarketBuy = await binance.futuresBuy(y, x, z, {
      positionSide: "SHORT",
    });
    if (MarketBuy.code != null) {
      if (MarketBuy.code != -4164) {
        console.log(MarketBuy.msg);
        console.log(x, y, z);
        return 1000;
      }
    }
    console.log(MarketBuy);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FuturesstoplimitShortBuy(x, y, z) {
  try {
    let MarketBuy = await binance.futuresBuy(y, x, z, {
      positionSide: "SHORT",
      type: "STOP",
      stopPrice: z,
    });
    if (MarketBuy.code != null) {
      if (MarketBuy.code != -4164) {
        console.log(MarketBuy.msg);
        console.log(x, y, z);
        return 1000;
      }
    }
    console.log(MarketBuy);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FuturestakelimitShortBuy(x, y, z) {
  try {
    let MarketBuy = await binance.futuresBuy(y, x, z, {
      positionSide: "SHORT",
      type: "TAKE_PROFIT",
      stopPrice: z,
    });
    if (MarketBuy.code != null) {
      if (MarketBuy.code != -4164) {
        console.log(MarketBuy.msg);
        console.log(x, y, z);
        return 1000;
      }
    }
    console.log(MarketBuy);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FuturesShortSell(x, y) {
  try {
    let MarketSell = await binance.futuresMarketSell(y, x, {
      positionSide: "SHORT",
    });
    if (MarketSell.code != null) {
      if (MarketSell.code != -4164) {
        console.log(MarketSell.msg);
        console.log(x, y);
        return 1000;
      }
    }
    console.log(MarketSell);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FuturesstopShortSell(x, y, z) {
  try {
    let MarketSell = await binance.futuresMarketSell(y, x, {
      positionSide: "SHORT",
      type: "STOP_MARKET",
      stopPrice: z,
    });
    if (MarketSell.code != null) {
      if (MarketSell.code != -4164) {
        console.log(MarketSell.msg);
        console.log(x, y, z);
        return 1000;
      }
    }
    console.log(MarketSell);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FutureslimitShortSell(x, y, z) {
  try {
    let MarketSell = await binance.futuresSell(y, x, z, {
      positionSide: "SHORT",
    });
    if (MarketSell.code != null) {
      if (MarketSell.code != -4164) {
        console.log(MarketSell.msg);
        console.log(x, y, z);
        return 1000;
      }
    }
    console.log(MarketSell);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FuturesstoplimitShortSell(x, y, z) {
  try {
    let MarketSell = await binance.futuresSell(y, x, z, {
      positionSide: "SHORT",
      type: "STOP",
      stopPrice: z,
    });
    if (MarketSell.code != null) {
      if (MarketSell.code != -4164) {
        console.log(MarketSell.msg);
        console.log(x, y, z);
        return 1000;
      }
    }
    console.log(MarketSell);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FuturestakelimitShortSell(x, y, z) {
  try {
    let MarketSell = await binance.futuresSell(y, x, z, {
      positionSide: "SHORT",
      type: "TAKE_PROFIT",
      stopPrice: z,
    });
    if (MarketSell.code != null) {
      if (MarketSell.code != -4164) {
        console.log(MarketSell.msg);
        console.log(x, y, z);
        return 1000;
      }
    }
    console.log(MarketSell);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FuturesLongSell(x, y) {
  try {
    let MarketSell = await binance.futuresMarketSell(y, x, {
      positionSide: "LONG",
    });
    if (MarketSell.code != null) {
      if (MarketSell.code != -4164) {
        console.log(MarketSell.msg);
        console.log(x, y);
        return 1000;
      }
    }
    console.log(MarketSell);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FuturesstopLongSell(x, y, z) {
  try {
    let MarketSell = await binance.futuresMarketSell(y, x, {
      positionSide: "LONG",
      type: "STOP_MARKET",
      stopPrice: z,
    });
    if (MarketSell.code != null) {
      if (MarketSell.code != -4164) {
        console.log(MarketSell.msg);
        console.log(x, y, z);
        return 1000;
      }
    }
    console.log(MarketSell);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FutureslimitLongSell(x, y, z) {
  try {
    let MarketSell = await binance.futuresSell(y, x, z, {
      positionSide: "LONG",
    });
    if (MarketSell.code != null) {
      if (MarketSell.code != -4164) {
        console.log(MarketSell.msg);
        console.log(x, y, z);
        return 1000;
      }
    }
    console.log(MarketSell);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FuturesstoplimitLongSell(x, y, z) {
  try {
    let MarketSell = await binance.futuresSell(y, x, z, {
      positionSide: "LONG",
      type: "STOP",
      stopPrice: z,
    });
    if (MarketSell.code != null) {
      if (MarketSell.code != -4164) {
        console.log(MarketSell.msg);
        console.log(x, y, z);
        return 1000;
      }
    }
    console.log(MarketSell);
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FuturestakelimitLongSell(x, y, z) {
  try {
    let MarketSell = await binance.futuresSell(y, x, z, {
      positionSide: "LONG",
      type: "TAKE_PROFIT",
      stopPrice: z,
    });
    if (MarketSell.code != null) {
      if (MarketSell.code != -4164) {
        console.log(MarketSell.msg);
        console.log(x, y, z);
        return 1000;
      }
    }
    console.log(MarketSell);
    return 2000;
  } catch (err) {
    return 1000;
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

async function getMinute(now) {
  try {
    let minutes = now.getMinutes();
    return minutes;
  } catch (error) {
    return 1;
  }
}

async function getSecond(now) {
  try {
    let seconds = now.getSeconds();
    return seconds;
  } catch (error) {
    return 30;
  }
}

async function getCandle(coinname, minute) {
  try {
    let candle = await binance.futuresCandles(coinname, minute);
    return candle;
  } catch (error) {
    return 100;
  }
}

async function GetRandom() {
  try {
    let num = Math.random();

    if (num > 0.5) {
      return 1;
    } else {
      return 2;
    }
  } catch {
    return 3;
  }
}

let firstFailure = 0;
let secondFailure = 0;
let longSuccess = 0;
let shortSuccess = 0;
let positionDir = "NONE";

async function final(longFail, shortFail, ch) {
  let longSwitch = false;
  let shortSwitch = false;
  let longFailure;
  let shortFailure;
  let plusAmt;
  let minusAmt;
  let thisPositionDir = positionDir;
  console.log(thisPositionDir);
  if ((longFail * 1 > 0 || shortFail * 1 > 0) && ch) {
    longFailure = longFail * 1;
    shortFailure = shortFail * 1;
  }
  if (positionDir == "NONE") {
    longFailure = shortFail * 1;
    shortFailure = longFail * 1;
  } else if (positionDir == "LONG") {
    if (longFail >= shortFail) {
      longFailure = longFail * 1;
      shortFailure = shortFail * 1;
    } else {
      longFailure = shortFail * 1;
      shortFailure = longFail * 1;
    }
  } else if (positionDir == "SHORT") {
    if (longFail >= shortFail) {
      longFailure = shortFail * 1;
      shortFailure = longFail * 1;
    } else {
      longFailure = longFail * 1;
      shortFailure = shortFail * 1;
    }
  }
  try {
    //let firstBalance = await GetBalances();
    // if (isNaN(firstBalance)) {
    //   console.log("UTCK 켜세요");
    //   return;
    // }
    leve = 20;
    await binance.useServerTime();
    await Leverage(leve, coinName);
    await sleep(1000);
    coinPrices = await GetPrices(coinName);
    while (coinPrices == 100000) {
      await sleep(1000);
      coinPrices = await GetPrices(coinName);
    }
    //amt = (secondreaBlalance / coinPrices / 13).toFixed(bbfix);
    // const longAmt = (
    //   (secondreaBlalance / coinPrices / leve) *
    //   5 *
    //   2 ** longFailure
    // ).toFixed(bbfix);
    // const shortAmt = (
    //   (secondreaBlalance / coinPrices / leve) *
    //   5 *
    //   2 ** shortFailure
    // ).toFixed(bbfix);
    const longAmt = (
      (1160 / 9000 / coinPrices) *
      leve *
      2 *
      2 ** longFailure
    ).toFixed(bbfix);
    const shortAmt = (
      (1160 / 9000 / coinPrices) *
      leve *
      2 *
      2 ** shortFailure
    ).toFixed(bbfix);
    let enter = await enterPosition(
      longAmt,
      shortAmt,
      coinName,
      positionDir,
      longFailure,
      shortFailure
    );
    if (enter === 1000) {
      await cancleOrder(coinName);
      await sleep(60000);
      return;
    }
    await sleep(1000);
    json1 = await plusBalance(coinName);
    while (json1.errornum == 1) {
      await sleep(1000);
      json1 = await plusBalance(coinName);
    }
    json2 = await minusBalance(coinName);
    while (json2.errornum == 1) {
      await sleep(1000);
      json2 = await minusBalance(coinName);
    }
    let longEntryPrice = json1.entryPrice;
    let shortEntryPrice = json2.entryPrice;
    let longLimitPrice = longEntryPrice * 1.03;
    let shortLimitPrice = shortEntryPrice * 0.97;
    let longBadPrice = longEntryPrice * 1.031;
    let longMoreBadPrice = longEntryPrice * 0.984;
    let shortBadPrice = shortEntryPrice * 0.969;
    let shortMoreBadPrice = shortEntryPrice * 1.016;
    if (positionDir === "LONG" || positionDir === "NONE") {
      longLimitPrice = longEntryPrice * 1.02;
      longBadPrice = longEntryPrice * 1.025;
      longMoreBadPrice = longEntryPrice * 0.98;
    } else if (positionDir === "SHORT") {
      longLimitPrice = longEntryPrice * 1.015;
      longBadPrice = longEntryPrice * 1.02;
      longMoreBadPrice = longEntryPrice * 0.975;
    }
    if (positionDir === "SHORT" || positionDir === "NONE") {
      shortLimitPrice = shortEntryPrice * 0.98;
      shortBadPrice = shortEntryPrice * 0.975;
      shortMoreBadPrice = shortEntryPrice * 1.02;
    } else if (positionDir === "LONG") {
      shortLimitPrice = shortEntryPrice * 0.985;
      shortBadPrice = shortEntryPrice * 0.98;
      shortMoreBadPrice = shortEntryPrice * 1.025;
    }
    while (true) {
      json1 = await plusBalance(coinName);
      while (json1.errornum == 1) {
        await sleep(1000);
        json1 = await plusBalance(coinName);
      }
      json2 = await minusBalance(coinName);
      while (json2.errornum == 1) {
        await sleep(1000);
        json2 = await minusBalance(coinName);
      }
      plusAmt = await getplusAmt(json1);
      minusAmt = await getminusAmt(json2);
      let markPrice = parseFloat(json1.markPrice);
      if (markPrice >= longBadPrice && plusAmt != 0) {
        long = await FuturesLongSell(plusAmt, coinName);
        while (long == 1000) {
          await sleep(1000);
          long = await FuturesLongSell(plusAmt, coinName);
          if (long == 2000) {
            break;
          }
        }
      }
      if (markPrice <= longMoreBadPrice && plusAmt != 0) {
        long = await FuturesLongSell(plusAmt, coinName);
        while (long == 1000) {
          await sleep(1000);
          long = await FuturesLongSell(plusAmt, coinName);
          if (long == 2000) {
            break;
          }
        }
      }
      if (markPrice <= shortBadPrice && minusAmt != 0) {
        short = await FuturesShortBuy(minusAmt, coinName);
        while (short == 1000) {
          await sleep(1000);
          short = await FuturesShortBuy(minusAmt, coinName);
          if (short == 2000) {
            break;
          }
        }
      }
      if (markPrice >= shortMoreBadPrice && minusAmt != 0) {
        short = await FuturesShortBuy(minusAmt, coinName);
        while (short == 1000) {
          await sleep(1000);
          short = await FuturesShortBuy(minusAmt, coinName);
          if (short == 2000) {
            break;
          }
        }
      }
      if (plusAmt == 0 && longSwitch == false) {
        if (longEntryPrice * 1 >= markPrice) {
          longFailure++;
          positionDir = "SHORT";
        } else if (markPrice >= longEntryPrice * 1) {
          longFailure = 0;
          longSuccess++;
          positionDir = "LONG";
        }
        longSwitch = true;
      }
      if (minusAmt == 0 && shortSwitch == false) {
        if (shortEntryPrice * 1 <= markPrice) {
          shortFailure++;
          positionDir = "LONG";
        } else if (markPrice <= shortEntryPrice * 1) {
          shortFailure = 0;
          shortSuccess++;
          positionDir = "SHORT";
        }
        shortSwitch = true;
      }
      if (shortSwitch && longSwitch) {
        await cancleOrder(coinName);
        if (longFailure > 0 && thisPositionDir === "LONG") {
          fails[longFailure - 1] += 1;
        }
        if (shortFailure > 0 && thisPositionDir === "SHORT") {
          fails[shortFailure - 1] += 1;
        }
        if (longFailure + shortFailure === 1) {
          firstFailure = 0;
          secondFailure = 0;
          positionDir = "NONE";
        } else if (thisPositionDir === "LONG" && longFailure === 0) {
          positionDir = "NONE";
          firstFailure = 0;
          secondFailure = 0;
        } else if (thisPositionDir === "SHORT" && shortFailure === 0) {
          positionDir = "NONE";
          firstFailure = 0;
          secondFailure = 0;
        } else if (thisPositionDir === "LONG" && longFailure !== 0) {
          positionDir = "SHORT";
          firstFailure = longFailure;
          secondFailure = 0;
        } else if (thisPositionDir === "SHORT" && shortFailure !== 0) {
          positionDir = "LONG";
          firstFailure = shortFailure;
          secondFailure = 0;
        } else if (
          thisPositionDir === "NONE" &&
          longFailure + shortFailure > 1
        ) {
          firstFailure = longFailure;
          secondFailure = shortFailure;
        }
        console.log("1번 실패 :", firstFailure);
        console.log("1번 성공 :", longSuccess);
        console.log("2번 실패 :", secondFailure);
        console.log("2번 성공 :", shortSuccess);
        return;
      }
      // console.log(
      //   "롱 :",
      //   markPrice - longEntryPrice,
      //   "숏 :",
      //   shortEntryPrice - markPrice
      // );
      await sleep(1000);
    }
  } catch (error) {
    console.log(error);
  }
}

let secondreaBlalance;
let coinName;

let fails = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

async function home(coin) {
  try {
    let FFM = 0;
    let SFM = 0;
    let select = coin * 1;
    let num;
    let start = true;
    secondreaBlalance = await GetBalances();
    if (isNaN(secondreaBlalance)) {
      console.log("Nan");
      return;
    }
    switch (select) {
      case 1:
        coinName = "ETHUSDT";
        num = 1;
        fix = 2;
        bbfix = 3;
        break;
      case 2:
        coinName = "XRPUSDT";
        num = 2;
        fix = 4;
        bbfix = 1;
        break;
      case 3:
        coinName = "DOGEUSDT";
        num = 3;
        fix = 5;
        bbfix = 0;
        break;
      case 4:
        coinName = "ADAUSDT";
        num = 4;
        fix = 4;
        bbfix = 0;
        break;
      case 5:
        coinName = "EOSUSDT";
        num = 5;
        fix = 3;
        bbfix = 1;
        break;
      case 6:
        coinName = "BCHUSDT";
        num = 6;
        fix = 2;
        bbfix = 3;
        break;
      case 7:
        coinName = "BNBUSDT";
        num = 7;
        fix = 2;
        bbfix = 2;
        break;
      case 8:
        coinName = "ETCUSDT";
        num = 8;
        fix = 3;
        bbfix = 2;
        break;
      case 9:
        coinName = "LINKUSDT";
        num = 9;
        fix = 3;
        bbfix = 2;
        break;
      case 10:
        coinName = "DOTUSDT";
        num = 10;
        fix = 3;
        bbfix = 1;
        break;
      case 11:
        coinName = "TRXUSDT";
        num = 11;
        fix = 5;
        bbfix = 0;
        break;
    }
    while (true) {
      await sleep(1000);
      if (start) {
        let manager = await getManager2(client, num + 3);
        while (manager == 100) {
          await sleep(5000);
          manager = await getManager2(client, num + 3);
        }
        FFM = parseInt(manager[0]);
        longSuccess = parseInt(manager[1]);
        shortSuccess = parseInt(manager[2]);
        start = false;
      }
      const sorted = [FFM, SFM].sort();
      FFM = sorted[1];
      SFM = sorted[0];
      console.log(FFM, SFM);
      const input = await inputManager(
        client,
        coinName,
        num,
        FFM,
        Math.floor(FFM / 2),
        longSuccess,
        shortSuccess,
        fails
      );
      while (input == 100) {
        await sleep(5000);
        input = await inputManager(
          client,
          coinName,
          num,
          FFM,
          Math.floor(FFM / 2),
          longSuccess,
          shortSuccess,
          fails
        );
      }
      // let secondreaBlalance2 = await GetBalances();
      // if (secondreaBlalance2 > secondreaBlalance) {
      //   secondreaBlalance = secondreaBlalance2;
      // }
      let stopAll = await getManagerStop(client);
      while (stopAll == 100) {
        await sleep(5000);
        stopAll = await getManagerStop(client);
      }
      if (FFM >= 7) {
        let stop = await getManager(client);
        while (stop == 100) {
          await sleep(5000);
          stop = await getManager(client);
        }
        if (stop != num && stop != 0) {
          await sleep(60000);
          continue;
        } else if (stop == 0) {
          let input = await inputManagerFail(client, num);
          while (input == 100) {
            await sleep(5000);
            input = await inputManagerFail(client, num);
          }
        }
      }
      if (stopAll == 1) {
        // if (FFM >= 4) {
        //   let stop = await getManager(client);
        //   while (stop == 100) {
        //     await sleep(1000);
        //     stop = await getManager(client);
        //   }
        //   if (stop != num && stop != 0) {
        //     console.log("대기중");
        //     await sleep(60000);
        //     continue;
        //   } else if (stop == 0) {
        //     let input = await inputManagerFail(client, num);
        //     while (input == 100) {
        //       await sleep(1000);
        //       input = await inputManagerFail(client, num);
        //     }
        //   }
        // }
        // if (SFM != 0 && FFM != 1) {
        //   await final(FFM, SFM, false);
        //   FFM = firstFailure;
        //   SFM = secondFailure;
        // } else if (SFM == 0 && FFM != 1) {
        //   await final(FFM, 0, false);
        //   FFM = firstFailure;
        //   SFM = secondFailure;
        // } else
        if (FFM == 0) {
          await cancleOrder(coinName);
          let stop = await getManager(client);
          while (stop == 100) {
            await sleep(5000);
            stop = await getManager(client);
          }
          if (stop == num) {
            let input = await inputManagerFail(client, 0);
            while (input == 100) {
              await sleep(5000);
              input = await inputManagerFail(client, 0);
            }
          }
          return;
        }
      } else {
        await final(FFM, Math.floor(FFM / 2), false);
        FFM = firstFailure;
        SFM = secondFailure;
        let stop = await getManager(client);
        while (stop == 100) {
          await sleep(5000);
          stop = await getManager(client);
        }
        if (stop == num && FFM < 5) {
          let input = await inputManagerFail(client, 0);
          while (input == 100) {
            await sleep(5000);
            input = await inputManagerFail(client, 0);
          }
        }
      }
      if (FFM >= 12) {
        return;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// async function home(coin) {
//   let FFM = 0;
//   let SFM = 0;
//   let select = coin * 1;
//   let num;
//   let start = true;
//   switch (select) {
//     case 1:
//       coinName = "ETHUSDT";
//       num = 1;
//       fix = 2;
//       bbfix = 3;
//       break;
//     case 2:
//       coinName = "XRPUSDT";
//       num = 2;
//       fix = 4;
//       bbfix = 1;
//       break;
//     case 3:
//       coinName = "DOGEUSDT";
//       num = 3;
//       fix = 5;
//       bbfix = 0;
//       break;
//     case 4:
//       coinName = "ADAUSDT";
//       num = 4;
//       fix = 4;
//       bbfix = 0;
//       break;
//     case 5:
//       coinName = "EOSUSDT";
//       num = 5;
//       fix = 3;
//       bbfix = 1;
//       break;
//     case 6:
//       coinName = "BCHUSDT";
//       num = 6;
//       fix = 2;
//       bbfix = 3;
//       break;
//     case 7:
//       coinName = "LTCUSDT";
//       num = 7;
//       fix = 2;
//       bbfix = 3;
//       break;
//     case 8:
//       coinName = "ETCUSDT";
//       num = 8;
//       fix = 3;
//       bbfix = 2;
//       break;
//     case 9:
//       coinName = "LINKUSDT";
//       num = 9;
//       fix = 3;
//       bbfix = 2;
//       break;
//     case 10:
//       coinName = "DOTUSDT";
//       num = 10;
//       fix = 3;
//       bbfix = 1;
//       break;
//   }
//   while (true) {
//     await sleep(1000);
//     let manager = await getManager2(client, num + 3);
//     while (manager == 100) {
//       await sleep(1000);
//       manager = await getManager2(client, num + 3);
//     }
//     if (start) {
//       const sorted = [parseInt(manager[0]), parseInt(manager[1])].sort();
//       FFM = sorted[1];
//       SFM = sorted[0];
//       longSuccess = parseInt(manager[2]);
//       shortSuccess = parseInt(manager[3]);
//       inputManagerFFM(client, num);
//       start = false;
//     }
//     const sorted = [FFM, SFM].sort();
//     FFM = sorted[1];
//     SFM = sorted[0];
//     console.log(FFM, SFM);
//     await inputManager(
//       client,
//       coinName,
//       num,
//       FFM,
//       SFM,
//       longSuccess,
//       shortSuccess,
//       fails
//     );
//     await final(FFM, SFM, false);
//     FFM = firstFailure;
//     SFM = secondFailure;
//   }
// }

async function inputManagerFail(client, num) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    memberArray[0] = new Array(num.toString());
    const request = {
      spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
      range: "manager!A2", // 범위를 지정해 주지 않으면 A1 행부터 데이터를 덮어 씌운다.
      valueInputOption: "USER_ENTERED",
      resource: { values: memberArray },
    };
    const response = await sheets.spreadsheets.values.update(request);
    return 1;
  } catch (error) {
    return 100;
  }
}

async function inputManagerFFM(client, num) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    memberArray[0] = new Array("0");
    const request = {
      spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
      range: `manager!F${num + 3}`, // 범위를 지정해 주지 않으면 A1 행부터 데이터를 덮어 씌운다.
      valueInputOption: "USER_ENTERED",
      resource: { values: memberArray },
    };
    const response = await sheets.spreadsheets.values.update(request);
    return 1;
  } catch (error) {
    return 100;
  }
}

async function getManager(client) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    const request = {
      spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",

      range: "manager!A2:A2",

      // , range : "twice"    // 범위를 지정하지 않으면 해당 Sheet의 모든 Shell 값을 가져온다.
    };

    const response = (await sheets.spreadsheets.values.get(request)).data;
    return parseFloat(response.values[0][0]);
  } catch (error) {
    return 100;
  }
}

async function getManager2(client, num) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    const request = {
      spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",

      range: `manager!B${num}:F${num}`,

      // , range : "twice"    // 범위를 지정하지 않으면 해당 Sheet의 모든 Shell 값을 가져온다.
    };

    const response = (await sheets.spreadsheets.values.get(request)).data;
    return response.values[0];
  } catch (error) {
    console.log(error);
    return 100;
  }
}

async function getManagerStop(client) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    const request = {
      spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",

      range: "manager!B2:B2",

      // , range : "twice"    // 범위를 지정하지 않으면 해당 Sheet의 모든 Shell 값을 가져온다.
    };

    const response = (await sheets.spreadsheets.values.get(request)).data;
    return parseFloat(response.values[0][0]);
  } catch (error) {
    return 100;
  }
}

async function inputManager(
  client,
  coinName,
  num,
  FFM,
  SFM,
  longSuccess,
  shortSuccess,
  fails
) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    memberArray[0] = new Array(
      coinName,
      FFM.toString(),
      SFM.toString(),
      longSuccess.toString(),
      shortSuccess.toString(),
      ...fails
    );
    let inp = "manager!A" + (num + 3).toString();
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

async function scan() {
  let N;
  console.log("코인 ?");
  var r10 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  r10.on("line", function (coin) {
    r10.close();
    console.log("롱 실패 : ?");
    var r0 = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    r0.on("line", function (longFail) {
      r0.close();
      console.log("숏 실패 : ?");
      var r5 = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      r5.on("line", function (shortFail) {
        r5.close();
        if (longFail > 0 || shortFail > 0) {
          final(longFail, shortFail, true);
        } else if (coin == 0) {
          inputBalance();
        } else {
          home(coin);
        }
      });
    });
  });

  return N;
}

async function inputBalance() {
  let mainBalacne = await GetBalances();
  let secondBalance;
  await inputMoney(client, mainBalacne);
  while (true) {
    const now = new Date();
    now.setHours(now.getHours() + 9);
    const time = now.toLocaleString();
    secondBalance = await GetBalances();
    if (secondBalance > mainBalacne) {
      mainBalacne = secondBalance;
      await inputMoney(client, mainBalacne);
    }
    await inputDate(client, time);
    await sleep(10000);
  }
}

async function Long() {
  try {
    let stopPrice;
    let limitPrice;
    let attempt;
    let fix = 2;
    const coinName = "ETHUSDT";
    await binance.useServerTime();
    await Leverage(5, coinName);
    await sleep(1000);
    coinPrices = await GetPrices(coinName);
    while (coinPrices == 100000) {
      await sleep(1000);
      coinPrices = await GetPrices(coinName);
    }
    const balance = Math.floor(await GetBalances());
    const amt = ((balance / coinPrices) * 5).toFixed(3);
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
    while (true) {
      json1 = await minusBalance(coinName);
      while (json1.errornum == 1) {
        await sleep(1000);
        json1 = await minusBalance(coinName);
      }
      plusAmt = await getminusAmt(json1);
      let markPrice = parseFloat(json1.markPrice);
      if (markPrice <= limitPrice && attempt !== 3) {
        await Leverage(5 * (attempt + 2), coinName);
        await sleep(1000);
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
            limitPrice =
              attempt === 2
                ? (obj.entryPrice * 0.96).toFixed(fix)
                : (obj.entryPrice * 0.99).toFixed(fix);
            stopPrice = (obj.entryPrice * 0.998).toFixed(fix);
          }
        }
        if (attempt === 2) {
          let limitSell = await binance.futuresBuy(
            coinName,
            shortAmt,
            limitPrice,
            {
              positionSide: "SHORT",
            }
          );
        }
        let MarketSell = await binance.futuresMarketBuy(coinName, plusAmt, {
          positionSide: "SHORT",
          type: "STOP_MARKET",
          stopPrice: stopPrice,
        });
        attempt++;
      }
      if (plusAmt === 0) {
        return;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

Long();
