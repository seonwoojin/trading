const Binance = require("node-binance-api");
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
  APIKEY: "cdnPPkgDmOA6M4qf3R4RFttRg4oHRSYdJvgyL0nQa2pTccWKN85OhCKKDklkzwAP",
  APISECRET: "1WH46dc1WfGfkz8ucPTevhQ19vt1uCL5K9PTXjPx2EFYyzPmC4Z6YHDvKDX4rDy1",
  useServerTime: true,
  reconnect: true,
  recvWindow: 90000,
  verbose: true,
  hedgeMode: true,
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
let reve;
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
let firstEmpty = 0;
let secondeEmpty = 0;
let positionDir = "NONE";

// async function final(longFail, shortFail, ch) {
//   let longSwitch = false;
//   let shortSwitch = false;
//   let switchS = false;
//   let longFailure;
//   let shortFailure;
//   let shoot = await GetRandom();
//   if ((longFail * 1 > 0 || shortFail * 1 > 0) && ch) {
//     longFailure = longFail * 1;
//     shortFailure = shortFail * 1;
//   }
//   if (positionDir == "NONE" && shoot == 1) {
//     longFailure = longFail * 1;
//     shortFailure = shortFail * 1;
//   } else if (positionDir == "NONE" && shoot == 2) {
//     longFailure = shortFail * 1;
//     shortFailure = longFail * 1;
//   } else if (positionDir == "LONG") {
//     if (longFail >= shortFail) {
//       longFailure = longFail * 1;
//       shortFailure = shortFail * 1;
//     } else {
//       longFailure = shortFail * 1;
//       shortFailure = longFail * 1;
//     }
//   } else if (positionDir == "SHORT") {
//     if (longFail >= shortFail) {
//       longFailure = shortFail * 1;
//       shortFailure = longFail * 1;
//     } else {
//       longFailure = longFail * 1;
//       shortFailure = shortFail * 1;
//     }
//   }
//   try {
//     let firstBalance = await GetBalances();
//     if (isNaN(firstBalance)) {
//       console.log("UTCK 켜세요");
//       return;
//     }
//     reve = 50;
//     await binance.useServerTime();
//     await Leverage(reve, coinName);
//     await sleep(1000);
//     coinPrices = await GetPrices(coinName);
//     while (coinPrices == 100000) {
//       await sleep(1000);
//       coinPrices = await GetPrices(coinName);
//     }
//     //amt = (secondreaBlalance / coinPrices / 13).toFixed(bbfix);
//     // const longAmt = (
//     //   (secondreaBlalance / coinPrices / reve) *
//     //   5 *
//     //   2 ** longFailure
//     // ).toFixed(bbfix);
//     // const shortAmt = (
//     //   (secondreaBlalance / coinPrices / reve) *
//     //   5 *
//     //   2 ** shortFailure
//     // ).toFixed(bbfix);
//     const longAmt = (
//       (secondreaBlalance / 8400 / coinPrices) *
//       reve *
//       2 ** longFailure
//     ).toFixed(bbfix);
//     const shortAmt = (
//       (secondreaBlalance / 8400 / coinPrices) *
//       reve *
//       2 ** shortFailure
//     ).toFixed(bbfix);
//     console.log(longAmt);
//     long = await FuturesLongBuy(longAmt, coinName);
//     while (long == 1000) {
//       await sleep(1000);
//       long = await FuturesLongBuy(longAmt, coinName);
//       if (long == 2000) {
//         break;
//       }
//     }
//     short = await FuturesShortSell(shortAmt, coinName);
//     while (short == 1000) {
//       await sleep(1000);
//       short = await FuturesShortSell(shortAmt, coinName);
//       if (short == 2000) {
//         break;
//       }
//     }
//     await sleep(3000);
//     json1 = await plusBalance(coinName);
//     while (json1.errornum == 1) {
//       await sleep(1000);
//       json1 = await plusBalance(coinName);
//     }
//     let longEntryPrice = parseFloat(json1.entryPrice);
//     let plusAmt = await getplusAmt(json1);
//     // let longStopPrice = (longEntryPrice * 0.995).toFixed(fix);
//     // let longLimitPrice = (longEntryPrice * 1.006).toFixed(fix);
//     // let longSadPrice = (longEntryPrice * 1.001).toFixed(fix);
//     // let longSadPrice2 = longEntryPrice * 1.0035;
//     let longStopPrice = (
//       longEntryPrice *
//       (0.991 - longFailure * 0.0005)
//     ).toFixed(fix);
//     let longLimitPrice = (
//       longEntryPrice *
//       (1.01 + longFailure * 0.0005)
//     ).toFixed(fix);
//     json2 = await minusBalance(coinName);
//     while (json2.errornum == 1) {
//       await sleep(1000);
//       json2 = await minusBalance(coinName);
//     }
//     let longBadPrice = longEntryPrice * (1.011 + longFailure * 0.0005);
//     let longMoreBadPrice = longEntryPrice * (0.99 - longFailure * 0.0005);
//     let shortEntryPrice = parseFloat(json2.entryPrice);
//     let minusAmt = await getminusAmt(json2);
//     let shortStopPrice = (
//       shortEntryPrice *
//       (1.009 + shortFailure * 0.0005)
//     ).toFixed(fix);
//     let shortLimitPrice = (
//       shortEntryPrice *
//       (0.99 - shortFailure * 0.0005)
//     ).toFixed(fix);
//     let shortBadPrice = shortEntryPrice * (0.989 - shortFailure * 0.0005);
//     let shortMoreBadPrice = shortEntryPrice * (1.01 + shortFailure * 0.0005);
//     let stopLongSell = await FuturesstopLongSell(
//       plusAmt,
//       coinName,
//       longStopPrice
//     );
//     while (stopLongSell == 1000) {
//       await cancleOrder(coinName);
//       await sleep(300000);
//       return;
//       await sleep(1000);
//       stopLongSell = stopLongSell = await FuturesstopLongSell(
//         plusAmt,
//         coinName,
//         longStopPrice
//       );
//       if (stopLongSell == 2000) {
//         break;
//       }
//     }
//     let stopShortBuy = await FuturesstopShortBuy(
//       minusAmt,
//       coinName,
//       shortStopPrice
//     );
//     while (stopShortBuy == 1000) {
//       await cancleOrder(coinName);
//       await sleep(300000);
//       return;
//       await sleep(1000);
//       stopShortBuy = await FuturesstopShortBuy(
//         minusAmt,
//         coinName,
//         shortStopPrice
//       );
//       if (stopShortBuy == 2000) {
//         break;
//       }
//     }
//     let limitLongSell = await FutureslimitLongSell(
//       plusAmt,
//       coinName,
//       longLimitPrice
//     );
//     while (limitLongSell == 1000) {
//       await cancleOrder(coinName);
//       await sleep(300000);
//       return;
//       await sleep(1000);
//       limitLongSell = await FutureslimitLongSell(
//         plusAmt,
//         coinName,
//         longLimitPrice
//       );
//       if (limitLongSell == 2000) {
//         break;
//       }
//     }
//     let limitShortBuy = await FutureslimitShortBuy(
//       shortAmt,
//       coinName,
//       shortLimitPrice
//     );
//     while (limitShortBuy == 1000) {
//       await cancleOrder(coinName);
//       await sleep(300000);
//       return;
//       await sleep(1000);
//       limitShortBuy = await FutureslimitShortBuy(
//         shortAmt,
//         coinName,
//         shortLimitPrice
//       );
//       if (limitShortBuy == 2000) {
//         break;
//       }
//     }
//     while (true) {
//       json1 = await plusBalance(coinName);
//       while (json1.errornum == 1) {
//         await sleep(1000);
//         json1 = await plusBalance(coinName);
//       }
//       json2 = await minusBalance(coinName);
//       while (json2.errornum == 1) {
//         await sleep(1000);
//         json2 = await minusBalance(coinName);
//       }
//       plusAmt = await getplusAmt(json1);
//       minusAmt = await getminusAmt(json2);
//       let markPrice = parseFloat(json1.markPrice);
//       if (markPrice >= longBadPrice && plusAmt != 0) {
//         long = await FuturesLongSell(plusAmt, coinName);
//         while (long == 1000) {
//           await sleep(1000);
//           long = await FuturesLongSell(plusAmt, coinName);
//           if (long == 2000) {
//             break;
//           }
//         }
//       }
//       if (markPrice <= longMoreBadPrice && plusAmt != 0) {
//         long = await FuturesLongSell(plusAmt, coinName);
//         while (long == 1000) {
//           await sleep(1000);
//           long = await FuturesLongSell(plusAmt, coinName);
//           if (long == 2000) {
//             break;
//           }
//         }
//       }
//       if (markPrice <= shortBadPrice && minusAmt != 0) {
//         short = await FuturesShortBuy(minusAmt, coinName);
//         while (short == 1000) {
//           await sleep(1000);
//           short = await FuturesShortBuy(minusAmt, coinName);
//           if (short == 2000) {
//             break;
//           }
//         }
//       }
//       if (markPrice >= shortMoreBadPrice && minusAmt != 0) {
//         short = await FuturesShortBuy(minusAmt, coinName);
//         while (short == 1000) {
//           await sleep(1000);
//           short = await FuturesShortBuy(minusAmt, coinName);
//           if (short == 2000) {
//             break;
//           }
//         }
//       }
//       if (plusAmt == 0 && longSwitch == false) {
//         if (longEntryPrice >= markPrice) {
//           longFailure++;
//           positionDir = "SHORT";
//         } else if (markPrice >= longEntryPrice) {
//           longFailure = 0;
//           longSuccess++;
//           positionDir = "LONG";
//         }
//         longSwitch = true;
//       }
//       if (minusAmt == 0 && shortSwitch == false) {
//         if (shortEntryPrice <= markPrice) {
//           shortFailure++;
//           positionDir = "LONG";
//         } else if (markPrice <= shortEntryPrice) {
//           shortFailure = 0;
//           shortSuccess++;
//           positionDir = "SHORT";
//         }
//         shortSwitch = true;
//       }
//       if (shortSwitch && longSwitch) {
//         await cancleOrder(coinName);
//         if (longFailure >= shortFailure) {
//           firstFailure = longFailure;
//           secondFailure = shortFailure;
//         } else if (shortFailure >= longFailure) {
//           firstFailure = shortFailure;
//           secondFailure = longFailure;
//         }

//         console.log("1번 실패 :", firstFailure);
//         console.log("1번 성공 :", longSuccess);
//         console.log("2번 실패 :", secondFailure);
//         console.log("2번 성공 :", shortSuccess);
//         console.log(firstEmpty, secondeEmpty);
//         return;
//       }
//       // console.log(
//       //   "롱 :",
//       //   markPrice - longEntryPrice,
//       //   "숏 :",
//       //   shortEntryPrice - markPrice
//       // );
//       await sleep(1000);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

async function final(longFail, shortFail, ch) {
  let longSwitch = false;
  let shortSwitch = false;
  let longFailure;
  let shortFailure;
  let shoot = await GetRandom();
  if ((longFail * 1 > 0 || shortFail * 1 > 0) && ch) {
    longFailure = longFail * 1;
    shortFailure = shortFail * 1;
  }
  if (positionDir == "NONE" && shoot == 1) {
    longFailure = longFail * 1;
    shortFailure = shortFail * 1;
  } else if (positionDir == "NONE" && shoot == 2) {
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
    await sleep(1000);
    coinPrices = await GetPrices(coinName);
    while (coinPrices == 100000) {
      await sleep(1000);
      coinPrices = await GetPrices(coinName);
    }
    let longStopPrice = (coinPrices * (0.991 - longFailure * 0.0005)).toFixed(
      fix
    );
    let longLimitPrice = (coinPrices * (1.01 + longFailure * 0.0005)).toFixed(
      fix
    );
    let shortStopPrice = (coinPrices * (1.009 + shortFailure * 0.0005)).toFixed(
      fix
    );
    let shortLimitPrice = (coinPrices * (0.99 - shortFailure * 0.0005)).toFixed(
      fix
    );
    while (true) {
      coinPrices = await GetPrices(coinName);
      while (coinPrices == 100000) {
        await sleep(1000);
        coinPrices = await GetPrices(coinName);
      }
      if (longSwitch == false) {
        if (coinPrices <= longStopPrice) {
          longFailure++;
          positionDir = "SHORT";
          longSwitch = true;
        } else if (coinPrices >= longLimitPrice) {
          longFailure = 0;
          longSuccess++;
          positionDir = "LONG";
          longSwitch = true;
        }
      }
      if (shortSwitch == false) {
        if (coinPrices >= shortStopPrice) {
          shortFailure++;
          positionDir = "LONG";
          shortSwitch = true;
        } else if (coinPrices <= shortLimitPrice) {
          shortFailure = 0;
          shortSuccess++;
          positionDir = "SHORT";
          shortSwitch = true;
        }
      }
      if (shortSwitch && longSwitch) {
        if (longFailure > 0) {
          fails[longFailure - 1] += 1;
        }
        if (shortFailure > 0) {
          fails[shortFailure - 1] += 1;
        }
        if (longFailure >= shortFailure) {
          firstFailure = longFailure;
          secondFailure = shortFailure;
        } else if (shortFailure >= longFailure) {
          firstFailure = shortFailure;
          secondFailure = longFailure;
        }
        console.log("1번 실패 :", firstFailure);
        console.log("1번 성공 :", longSuccess);
        console.log("2번 실패 :", secondFailure);
        console.log("2번 성공 :", shortSuccess);
        return;
      }
      await sleep(1000);
    }
  } catch (error) {
    console.log(error);
  }
}

let secondreaBlalance;
let coinName;

// async function home(coin) {
//   let FFM = 0;
//   let SFM = 0;
//   let select = coin * 1;
//   let num;
//   let start = true;
//   secondreaBlalance = await GetBalances();
//   if (isNaN(secondreaBlalance)) {
//     return;
//   }
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
//       coinName = "TRXUSDT";
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
//     if (manager[4] == "1" && FFM <= 1 && SFM <= 1) {
//       const sorted = [parseInt(manager[0]), parseInt(manager[1])].sort();
//       FFM = sorted[1];
//       SFM = sorted[0];
//       longSuccess = parseInt(manager[2]);
//       shortSuccess = parseInt(manager[3]);
//       inputManagerFFM(client, num);
//     } else {
//       const sorted = [FFM, SFM].sort();
//       FFM = sorted[1];
//       SFM = sorted[0];
//     }
//     console.log(FFM, SFM);
//     await inputManager(
//       client,
//       coinName,
//       num,
//       FFM,
//       SFM,
//       longSuccess,
//       shortSuccess
//     );
//     let secondreaBlalance2 = await GetBalances();
//     if (secondreaBlalance2 > secondreaBlalance) {
//       secondreaBlalance = secondreaBlalance2;
//     }
//     let stopAll = await getManagerStop(client);
//     while (stopAll == 100) {
//       await sleep(1000);
//       stopAll = await getManagerStop(client);
//     }
//     if (FFM >= 8) {
//       let stop = await getManager(client);
//       while (stop == 100) {
//         await sleep(1000);
//         stop = await getManager(client);
//       }
//       if (stop != num && stop != 0) {
//         await sleep(60000);
//         continue;
//       } else if (stop == 0) {
//         let input = await inputManagerFail(client, num);
//         while (input == 100) {
//           await sleep(1000);
//           input = await inputManagerFail(client, num);
//         }
//       }
//     }
//     if (stopAll == 1) {
//       // if (FFM >= 4) {
//       //   let stop = await getManager(client);
//       //   while (stop == 100) {
//       //     await sleep(1000);
//       //     stop = await getManager(client);
//       //   }
//       //   if (stop != num && stop != 0) {
//       //     console.log("대기중");
//       //     await sleep(60000);
//       //     continue;
//       //   } else if (stop == 0) {
//       //     let input = await inputManagerFail(client, num);
//       //     while (input == 100) {
//       //       await sleep(1000);
//       //       input = await inputManagerFail(client, num);
//       //     }
//       //   }
//       // }
//       if (SFM != 0 && FFM != 1) {
//         await final(FFM, SFM, false);
//         FFM = firstFailure;
//         SFM = secondFailure;
//       } else if (SFM == 0 && FFM != 1) {
//         await final(FFM, 0, false);
//         FFM = firstFailure;
//         SFM = secondFailure;
//       } else if (FFM == 1) {
//         await cancleOrder(coinName);
//         let stop = await getManager(client);
//         while (stop == 100) {
//           await sleep(1000);
//           stop = await getManager(client);
//         }
//         if (stop == num) {
//           let input = await inputManagerFail(client, 0);
//           while (input == 100) {
//             await sleep(1000);
//             input = await inputManagerFail(client, 0);
//           }
//         }
//         return;
//       }
//     } else {
//       await final(FFM, SFM, false);
//       FFM = firstFailure;
//       SFM = secondFailure;
//       let stop = await getManager(client);
//       while (stop == 100) {
//         await sleep(1000);
//         stop = await getManager(client);
//       }
//       if (stop == num && FFM < 5) {
//         let input = await inputManagerFail(client, 0);
//         while (input == 100) {
//           await sleep(1000);
//           input = await inputManagerFail(client, 0);
//         }
//       }
//     }
//     if (FFM >= 13) {
//       return;
//     }
//   }
// }

let fails = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

async function home(coin) {
  let FFM = 0;
  let SFM = 0;
  let select = coin * 1;
  let num;
  let start = true;
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
      coinName = "LTCUSDT";
      num = 7;
      fix = 2;
      bbfix = 3;
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
  }
  while (true) {
    await sleep(1000);
    let manager = await getManager2(client, num + 3);
    while (manager == 100) {
      await sleep(1000);
      manager = await getManager2(client, num + 3);
    }
    if (start) {
      const sorted = [parseInt(manager[0]), parseInt(manager[1])].sort();
      FFM = sorted[1];
      SFM = sorted[0];
      longSuccess = parseInt(manager[2]);
      shortSuccess = parseInt(manager[3]);
      inputManagerFFM(client, num);
      start = false;
    }
    const sorted = [FFM, SFM].sort();
    FFM = sorted[1];
    SFM = sorted[0];
    console.log(FFM, SFM);
    await inputManager(
      client,
      coinName,
      num,
      FFM,
      SFM,
      longSuccess,
      shortSuccess,
      fails
    );
    await final(FFM, SFM, false);
    FFM = firstFailure;
    SFM = secondFailure;
  }
}

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
    console.log(...fails);
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
  const now = new Date();
  const time = now.toLocaleString();
  console.log(time);
  let mainBalacne = await GetBalances();
  let secondBalance;
  await inputMoney(client, mainBalacne);
  while (true) {
    secondBalance = await GetBalances();
    if (secondBalance > mainBalacne) {
      const now = new Date();
      const time = now.toLocaleString();
      console.log(time);
      mainBalacne = secondBalance;
      console.log(mainBalacne);
      await inputMoney(client, mainBalacne);
    }
    await sleep(10000);
  }
}

module.exports.home = home;
module.exports.inputBalance = inputBalance;
