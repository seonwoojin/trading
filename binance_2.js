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
    return 10;
  }
}

async function FuturesLongBuy(amt, coinName) {
  try {
    let MarketBuy = await binance.futuresMarketBuy(coinName, amt, {
      positionSide: "LONG",
    });
    if (MarketBuy.code != null) {
      if (MarketBuy.code != -4164) {
        console.log(MarketBuy.msg);
        return 1000;
      }
    }
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function FuturesShortSell(amt, coinName) {
  try {
    let MarketSell = await binance.futuresMarketSell(coinName, amt, {
      positionSide: "SHORT",
    });
    if (MarketSell.code != null) {
      if (MarketSell.code != -4164) {
        console.log(MarketSell.msg);
        return 1000;
      }
    }
    return 2000;
  } catch (err) {
    return 1000;
  }
}

async function enterPosition(amt, coinName, positionDir) {
  try {
    let limitPrice;
    let stopPrice;
    if (positionDir === "LONG") {
      let MarketBuy1 = await binance.futuresMarketBuy(coinName, amt, {
        positionSide: "LONG",
      });
      if (MarketBuy1.code != null) {
        if (MarketBuy1.code != -4164) {
          console.log(MarketBuy1.msg);
          return 1000;
        }
      }
    } else if (positionDir === "SHORT") {
      let MarketSell1 = await binance.futuresMarketSell(coinName, amt, {
        positionSide: "SHORT",
      });
      if (MarketSell1.code != null) {
        if (MarketSell1.code != -4164) {
          console.log(MarketSell1.msg);
          return 1000;
        }
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
        if (positionDir === "LONG") {
          limitPrice = (obj.entryPrice * 1.02).toFixed(fix);
          stopPrice = (obj.entryPrice * 0.985).toFixed(fix);
          let MarketSell = await binance.futuresMarketSell(coinName, amt, {
            positionSide: "LONG",
            type: "STOP_MARKET",
            stopPrice: stopPrice,
          });
          if (MarketSell.code != null) {
            if (MarketSell.code != -4164) {
              console.log(MarketSell.msg);
              return 1000;
            }
          }
          let limitSell = await binance.futuresSell(coinName, amt, limitPrice, {
            positionSide: "LONG",
          });
          if (limitSell.code != null) {
            if (limitSell.code != -4164) {
              console.log(limitSell.msg);
              return 1000;
            }
          }
        }
      }
      if (obj.positionSide == "SHORT" && obj.symbol == coinName) {
        if (positionDir === "SHORT") {
          limitPrice = (obj.entryPrice * 0.98).toFixed(fix);
          stopPrice = (obj.entryPrice * 1.015).toFixed(fix);
          let MarketBuy = await binance.futuresMarketBuy(coinName, amt, {
            positionSide: "SHORT",
            type: "STOP_MARKET",
            stopPrice: stopPrice,
          });
          if (MarketBuy.code != null) {
            if (MarketBuy.code != -4164) {
              console.log(MarketBuy.msg);
              return 1000;
            }
          }
          let limitBuy = await binance.futuresBuy(coinName, amt, limitPrice, {
            positionSide: "SHORT",
          });
          if (limitBuy.code != null) {
            if (limitBuy.code != -4164) {
              console.log(limitBuy.msg);
              return 1000;
            }
          }
        }
      }
    }
    return 2000;
  } catch (err) {
    console.log(err);
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

function GetRandom() {
  try {
    let num = Math.random();

    if (num > 0.5) {
      return "LONG";
    } else {
      return "SHORT";
    }
  } catch {
    return 3;
  }
}

let allFailure = 0;
let allSuccess = 0;
let positionDir = GetRandom();

async function final(failure) {
  let amt;
  let endSwitch = false;
  let enterFailure = failure * 1;
  let positionJson;
  try {
    // let firstBalance = await GetBalances();
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
    const enterAmt = (
      (1160 / 9000 / coinPrices) *
      leve *
      3 *
      2 ** enterFailure
    ).toFixed(bbfix);
    console.log(positionDir);
    let enter = await enterPosition(enterAmt, coinName, positionDir);
    if (enter === 1000) {
      await cancleOrder(coinName);
      await sleep(60000);
      return;
    }
    await sleep(1000);
    if (positionDir === "LONG") {
      positionJson = await plusBalance(coinName);
      while (positionJson.errornum == 1) {
        await sleep(1000);
        positionJson = await plusBalance(coinName);
      }
      await sleep(1000);
      amt = getplusAmt(positionJson);
    } else if (positionDir === "SHORT") {
      positionJson = await minusBalance(coinName);
      while (positionJson.errornum == 1) {
        await sleep(1000);
        positionJson = await minusBalance(coinName);
      }
      await sleep(1000);
      amt = getminusAmt(positionJson);
    }
    let entryPrice = positionJson.entryPrice;
    let limitPrice =
      positionDir === "LONG" ? entryPrice * 1.025 : entryPrice * 0.975;
    let stopPrice =
      positionDir === "LONG" ? entryPrice * 0.98 : entryPrice * 1.02;
    while (true) {
      coinPrices = await GetPrices(coinName);
      while (coinPrices == 100000) {
        await sleep(1000);
        coinPrices = await GetPrices(coinName);
      }
      if (positionDir === "LONG") {
        positionJson = await plusBalance(coinName);
        while (positionJson.errornum == 1) {
          await sleep(1000);
          positionJson = await plusBalance(coinName);
        }
        await sleep(1000);
        let plusAmt = await getplusAmt(positionJson);
        console.log(plusAmt, "minus");
        let markPrice = parseFloat(positionJson.markPrice);
        if (markPrice >= limitPrice && plusAmt != 0) {
          long = await FuturesLongSell(plusAmt, coinName);
          while (long == 1000) {
            await sleep(1000);
            long = await FuturesLongSell(plusAmt, coinName);
            if (long == 2000) {
              break;
            }
          }
        }
        if (markPrice <= stopPrice && plusAmt != 0) {
          long = await FuturesLongSell(plusAmt, coinName);
          while (long == 1000) {
            await sleep(1000);
            long = await FuturesLongSell(plusAmt, coinName);
            if (long == 2000) {
              break;
            }
          }
        }
        if (plusAmt == 0 && endSwitch == false) {
          if (entryPrice * 1 >= markPrice) {
            allFailure++;
            positionDir = "SHORT";
          } else if (markPrice >= entryPrice * 1) {
            allFailure = 0;
            allSuccess++;
            positionDir = "LONG";
          }
          endSwitch = true;
        }
      } else if (positionDir === "SHORT") {
        positionJson = await minusBalance(coinName);
        while (positionJson.errornum == 1) {
          await sleep(1000);
          positionJson = await minusBalance(coinName);
        }
        await sleep(1000);
        let minusAmt = await getminusAmt(positionJson);
        console.log(minusAmt, "minus");
        let markPrice = parseFloat(positionJson.markPrice);
        if (markPrice <= limitPrice && minusAmt != 0) {
          short = await FuturesShortBuy(minusAmt, coinName);
          while (short == 1000) {
            await sleep(1000);
            short = await FuturesShortBuy(minusAmt, coinName);
            if (short == 2000) {
              break;
            }
          }
        }
        if (markPrice >= stopPrice && minusAmt != 0) {
          short = await FuturesShortBuy(minusAmt, coinName);
          while (short == 1000) {
            await sleep(1000);
            short = await FuturesShortBuy(minusAmt, coinName);
            if (short == 2000) {
              break;
            }
          }
        }
        if (minusAmt == 0 && endSwitch == false) {
          if (entryPrice * 1 <= markPrice) {
            allFailure++;
            positionDir = "LONG";
          } else if (markPrice <= entryPrice * 1) {
            allFailure = 0;
            allSuccess++;
            positionDir = "SHORT";
          }
          endSwitch = true;
        }
      }
      if (endSwitch) {
        await cancleOrder(coinName);
        console.log("실패 :", allFailure);
        console.log("성공 :", allSuccess);
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

let fails = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

async function home(coin) {
  try {
    allFailure = 0;
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
      if (start) {
        let manager = await getManager2(client, num + 3);
        while (manager == 100) {
          await sleep(5000);
          manager = await getManager2(client, num + 3);
        }
        allFailure = parseInt(manager[0]);
        allSuccess = parseInt(manager[1]);
        start = false;
      }
      console.log(allFailure, allSuccess);
      const input = await inputManager(
        client,
        coinName,
        num,
        allFailure,
        allSuccess,
        fails
      );
      while (input == 100) {
        await sleep(5000);
        input = await inputManager(
          client,
          coinName,
          num,
          allFailure,
          allSuccess,
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
      if (allFailure >= 7) {
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
        if (allFailure == 0) {
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
      }
      await final(allFailure);
      if (allFailure >= 9) {
        return;
      }
    }
  } catch (error) {
    console.log(error);
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

      range: `manager!B${num}:C${num}`,

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

async function inputManager(client, coinName, num, FFM, success, fails) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    memberArray[0] = new Array(
      coinName,
      FFM.toString(),
      success.toString(),
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

module.exports.home = home;
module.exports.inputBalance = inputBalance;
