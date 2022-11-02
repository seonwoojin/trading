const Binance = require("node-binance-api");
const { google } = require("googleapis");
const keys = require("./credentials.json");
const readline = require("readline");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const client = new google.auth.JWT(
  keys.client_email,

  null,

  keys.private_key,

  ["https://www.googleapis.com/auth/spreadsheets"] // 사용자 시트 및 해당 속성에 대한 읽기/쓰기 액세스 허용
);
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var XLSX = require("xlsx");
var transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "wlstjsdn12@gmail.com",
      pass: "dkfejtjsdn12!",
    },
  })
);

var mailOptions = {
  from: "wlstjsdn12@gmail.com",
  to: "wlstjsdn12@gmail.com",
  subject: "오류남",
  text: "멈춤",
};
let isFail = false;
let binance = new Binance().options({
  APIKEY: "cdnPPkgDmOA6M4qf3R4RFttRg4oHRSYdJvgyL0nQa2pTccWKN85OhCKKDklkzwAP",
  APISECRET: "1WH46dc1WfGfkz8ucPTevhQ19vt1uCL5K9PTXjPx2EFYyzPmC4Z6YHDvKDX4rDy1",
  useServerTime: true,
  reconnect: true,
  recvWindow: 90000,
  verbose: true,
  hedgeMode: true,
});

var coin = [
  //{"name" : "BTCUSDT", "RSIname" : "BTC/USDT", "fix" : 2, "bbfix" : 3},
  //{"name" : "ETHUSDT", "RSIname" : "ETH/USDT", "fix" : 2, "bbfix" : 3},
  //{"name" : "BNBUSDT", "RSIname" : "BNB/USDT", "fix" : 2, "bbfix" : 2},
  { name: "ADAUSDT", RSIname: "ADA/USDT", fix: 4, bbfix: 0 },
  //{"name" : "XRPUSDT", "RSIname" : "XRP/USDT", "fix" : 4, "bbfix" : 1},
  // {"name" : "SOLUSDT", "RSIname" : "SOL/USDT", "fix" : 3, "bbfix" : 0},
  // {"name" : "DOTUSDT", "RSIname" : "DOT/USDT", "fix" : 3, "bbfix" : 1},
  // {"name" : "LUNAUSDT", "RSIname" : "LUNA/USDT", "fix" : 3, "bbfix" : 0}
];
let order_flag;
let coinPrices;
let myusefulBalances;
var json1 = {
  errornum: 0,
  positionAmt: "",
  entryPrice: "",
  unRealizedProfit: "",
  markPrice: "",
};
var json2 = {
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

async function get(client) {
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
    console.log(error);
    return 100;
  }
}

async function getLongShort(client, pos) {
  try {
    let inp = "manager!F" + (pos + 3).toString() + ":F" + (pos + 3).toString();
    const sheets = google.sheets({ version: "v4", auth: client });
    const request = {
      spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",

      range: inp,

      // , range : "twice"    // 범위를 지정하지 않으면 해당 Sheet의 모든 Shell 값을 가져온다.
    };

    const response = (await sheets.spreadsheets.values.get(request)).data;
    return parseFloat(response.values[0][0]);
  } catch (error) {
    console.log(error);
    return 100;
  }
}

async function get2(client) {
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
    console.log(error);
    return 100;
  }
}

async function input(client, num) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    memberArray[0] = new Array(num.toString());
    const request = {
      spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
      range: "manager!G2", // 범위를 지정해 주지 않으면 A1 행부터 데이터를 덮어 씌운다.
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

async function inputEnd(client) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    let num = 0;
    memberArray[0] = new Array(num.toString());
    const request = {
      spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
      range: "manager!G2", // 범위를 지정해 주지 않으면 A1 행부터 데이터를 덮어 씌운다.
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

async function inputLongShort(client, pos, off) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    let zero = 1;
    if (off == 0) {
      zero = 0;
    }
    memberArray[0] = new Array(zero.toString());
    let inp = "manager!F" + (pos + 3).toString() + ":F" + (pos + 3).toString();
    const request = {
      spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
      range: inp,
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

async function inputFail2(
  client,
  coinname,
  failure,
  pos,
  success,
  SuccessTry,
  totalProfit,
  flagSum
) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    memberArray[0] = new Array(
      coinname,
      failure.toString(),
      success.toString(),
      maxFailtry.toString(),
      SuccessTry.toString(),
      totalProfit.toString(),
      flagSum.toString()
    );
    let inp = "manager!A" + (pos + 3).toString();
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

async function inputFail12(
  client,
  coinname,
  failure,
  pos,
  success,
  totalProfit,
  margin
) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    memberArray[0] = new Array(
      coinname,
      failure.toString(),
      success.toString(),
      maxFailtry.toString(),
      totalProfit.toString(),
      margin.toString()
    );
    let inp = "manager!A" + (pos + 3).toString();
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

async function inputFail3(
  client,
  coinname,
  failure,
  pos,
  success,
  totalProfit,
  flagSum
) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    memberArray[0] = new Array(
      coinname,
      failure.toString(),
      success.toString(),
      maxFailtry.toString(),
      totalProfit.toString(),
      flagSum.toString()
    );
    let inp = "manager!A" + (pos + 3).toString();
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

async function inputPercent(client, pos, percent) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    memberArray[0] = new Array(percent.toString());
    let inp = "manager!H" + (pos + 3).toString() + ":H" + (pos + 3).toString();
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

async function inputFail(client, coinname, failure, pos, success, SuccessTry) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    memberArray[0] = new Array(
      coinname,
      failure.toString(),
      success.toString(),
      maxFailtry.toString(),
      SuccessTry.toString()
    );
    let inp = "manager!A" + (pos + 3).toString();
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

async function GetAccount() {
  try {
    let balances = await binance.futuresBalance();
    return parseFloat(balances[1].availableBalance);
  } catch (err) {
    console.log(err);
  }
}

async function GetPnl() {
  try {
    let balances = await binance.futuresBalance();
    return parseFloat(balances[1].crossUnPnl);
  } catch (err) {
    console.log(err);
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

async function longnum(x, plusEntry, json1) {
  try {
    let long =
      ((parseFloat(json1.markPrice) - plusEntry) / plusEntry) * 100 * x;
    return long;
  } catch (err) {
    console.log(err);
  }
}

async function getPercent(json1, json2, plusAmt, minusAmt, reve) {
  try {
    let amt;
    if (plusAmt > minusAmt) {
      amt = plusAmt;
    } else {
      amt = minusAmt;
    }
    let per =
      ((parseFloat(json1.unRealizedProfit) +
        parseFloat(json2.unRealizedProfit)) /
        (parseFloat(json1.markPrice) * amt)) *
      100 *
      reve;
    return per;
  } catch (err) {
    console.log(err);
  }
}

async function shortnum(x, minusEntry, json2) {
  try {
    let short =
      ((parseFloat(json2.markPrice) - minusEntry) / minusEntry) * -1 * 100 * x;
    return short;
  } catch (err) {
    console.log(err);
  }
}

async function cancleShortorder() {
  try {
    let openOrders = await binance.futuresOpenOrders(),
      Orders = Object.keys(openOrders);
    for (let Order of Orders) {
      let obj = openOrders[Order];
      if (obj.positionSide == "SHORT") {
        await binance.futuresCancel(obj.symbol, { orderId: obj.orderId });
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function cancleLongorder() {
  try {
    let openOrders = await binance.futuresOpenOrders(),
      Orders = Object.keys(openOrders);
    for (let Order of Orders) {
      let obj = openOrders[Order];
      if (obj.positionSide == "LONG") {
        await binance.futuresCancel(obj.symbol, { orderId: obj.orderId });
      }
    }
  } catch (err) {
    console.log(err);
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

async function getlongOrder() {
  try {
    let longOrder = 1;
    let openOrders = await binance.futuresOpenOrders(),
      Orders = Object.keys(openOrders);
    for (let Order of Orders) {
      let obj = openOrders[Order];
      if (obj.positionSide == "SHORT") {
        return longOrder;
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function getshortOrder() {
  try {
    let shortOrder = 1;
    let openOrders = await binance.futuresOpenOrders(),
      Orders = Object.keys(openOrders);
    for (let Order of Orders) {
      let obj = openOrders[Order];
      if (obj.positionSide == "LONG") {
        return shortOrder;
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function getorderType(coinname) {
  try {
    let order = await binance.futuresAllOrders(coinname);
    if (
      order[order.length - 1].origType == "STOP_MARKET" &&
      order[order.length - 1].status == "FILLED"
    ) {
      return 100;
    } else {
      return 200;
    }
  } catch (error) {
    return 300;
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

async function getStart(coinname, pos) {
  try {
    let candle3 = await binance.futuresCandles(coinname, "1m");
    if (pos == 1) {
      // 롱 종료
      if (
        candle3[candle3.length - 2][4] - candle3[candle3.length - 2][1] < 0 &&
        candle3[candle3.length - 3][4] - candle3[candle3.length - 3][1] < 0
      ) {
        // if((candle3[candle3.length - 2][4]-candle3[candle3.length - 2][1])/candle3[candle3.length - 2][1] + (candle3[candle3.length - 3][4]-candle3[candle3.length - 3][1])/candle3[candle3.length - 3][1] < -1)
        // {
        //     return 2;
        // }
        return 1;
      }
      return 2;
    } else if (pos == 2) {
      // 숏 종료
      if (
        candle3[candle3.length - 2][4] - candle3[candle3.length - 2][1] > 0 &&
        candle3[candle3.length - 3][4] - candle3[candle3.length - 3][1] > 0
      ) {
        // if((candle3[candle3.length - 2][4]-candle3[candle3.length - 2][1])/candle3[candle3.length - 2][1] + (candle3[candle3.length - 3][4]-candle3[candle3.length - 3][1])/candle3[candle3.length - 3][1] > 1)
        // {
        //     return 2;
        // }
        return 1;
      }
      return 2;
    }
  } catch (error) {
    return 3;
  }
}

async function getRSI(coinname, minute) {
  try {
    var candleArr = [];
    var diffArr = [];
    var gain = [];
    var loss = [];
    let AU = 0;
    let AD = 0;
    let start = 0;
    let start2 = 0;
    let candle;
    var now = new Date();
    let minutes = await getMinute(now);
    let seconds = await getSecond(now);
    candleArr[0] = await GetPrices(coinname);
    await sleep(500);
    while (candleArr[0] == 100000) {
      candleArr[0] = await GetPrices(coinname);
      await sleep(500);
    }
    if (start == 0 && start2 == 0) {
      candle = await getCandle(coinname, minute);
      await sleep(500);
      while (candle == 100) {
        candle = await getCandle(coinname, minute);
        await sleep(500);
      }
      for (let i = 0; i < 14; i++) {
        candleArr[i + 1] = candle[candle.length - i - 1][1];
      }
      start = 1;
      start2 = 1;
    }
    if (minutes % 3 == 0 && seconds <= 10) {
      start = 0;
    }
    if (minutes % 3 != 0) {
      start2 = 0;
    }
    for (let i = 0; i < 14; i++) {
      diffArr[i] = candleArr[i] - candleArr[i + 1];
    }
    for (let i = 0; i < 14; i++) {
      if (diffArr[i] >= 0) {
        gain[i] = diffArr[i];
        loss[i] = 0;
      } else if (diffArr[i] < 0) {
        gain[i] = 0;
        loss[i] = diffArr[i];
      }
    }

    for (let i = 0; i < 14; i++) {
      AU = AU + gain[i];
      AD = AD + loss[i];
    }
    AU = AU / 14;
    AD = AD / 14;
    let RS = (AU / AD) * -1;
    let RSI = 100 - 100 / (1 + RS);
    return RSI;
  } catch (error) {
    return 100;
  }
}

async function getRSI2(coinname, minute) {
  try {
    var candleArr = [];
    var diffArr = [];
    var gain = [];
    var loss = [];
    let AU = 0;
    let fAU = 0;
    let fAD = 0;
    let AD = 0;
    let start = 0;
    let start2 = 0;
    let candle;
    var now = new Date();
    let minutes = await getMinute(now);
    let seconds = await getSecond(now);
    //candleArr[0] = await GetPrices(coinname);
    await sleep(1000);
    // while(candleArr[0] == 100000)
    // {
    //     candleArr[0] = await GetPrices(coinname);
    //     await sleep(500);
    // }
    candle = await getCandle(coinname, minute);
    await sleep(500);
    while (candle == 100) {
      candle = await getCandle(coinname, minute);
      await sleep(500);
    }
    for (let i = 0; i < 28; i++) {
      candleArr[i] = candle[candle.length - i - 5][4];
    }
    for (let i = 0; i < 27; i++) {
      diffArr[i] = candleArr[i] - candleArr[i + 1];
    }
    for (let i = 0; i < 27; i++) {
      if (diffArr[i] >= 0) {
        gain[i] = diffArr[i];
        loss[i] = 0;
      } else if (diffArr[i] < 0) {
        gain[i] = 0;
        loss[i] = diffArr[i];
      }
    }
    for (let i = 13; i < 27; i++) {
      AU = AU + gain[i];
      AD = AD + loss[i];
    }

    AU = AU / 14;
    AD = AD / 14;

    for (let i = 12; i >= 0; i--) {
      AU = (AU * 13 + gain[i]) / 14;
      AD = (AD * 13 + loss[i]) / 14;
    }
    let RS = (AU / AD) * -1;
    let RSI = 100 - 100 / (1 + RS);
    return RSI;
  } catch (error) {
    console.log(error);
    return 100;
  }
}

async function getRSI3(coinname, minute) {
  try {
    var candleArr = [];
    var diffArr = [];
    var gain = [];
    var loss = [];
    let AU = 0;
    let fAU = 0;
    let fAD = 0;
    let AD = 0;
    let start = 0;
    let start2 = 0;
    let candle;
    var now = new Date();
    let minutes = await getMinute(now);
    let seconds = await getSecond(now);
    candleArr[0] = await GetPrices(coinname);
    await sleep(1000);
    while (candleArr[0] == 100000) {
      candleArr[0] = await GetPrices(coinname);
      await sleep(500);
    }
    if (start == 0 && start2 == 0) {
      candle = await getCandle(coinname, minute);
      await sleep(500);
      while (candle == 100) {
        candle = await getCandle(coinname, minute);
        await sleep(500);
      }
      for (let i = 0; i < 27; i++) {
        candleArr[i + 1] = candle[candle.length - i - 1][4];
      }
      start = 1;
      start2 = 1;
    }
    if (minutes % 3 == 0 && seconds <= 10) {
      start = 0;
    }
    if (minutes % 3 != 0) {
      start2 = 0;
    }
    for (let i = 0; i < 27; i++) {
      diffArr[i] = candleArr[i] - candleArr[i + 1];
    }
    for (let i = 0; i < 27; i++) {
      if (diffArr[i] >= 0) {
        gain[i] = diffArr[i];
        loss[i] = 0;
      } else if (diffArr[i] < 0) {
        gain[i] = 0;
        loss[i] = diffArr[i];
      }
    }
    for (let i = 13; i < 27; i++) {
      AU = AU + gain[i];
      AD = AD + loss[i];
    }

    AU = AU / 14;
    AD = AD / 14;

    for (let i = 12; i >= 0; i--) {
      AU = (AU * 13 + gain[i]) / 14;
      AD = (AD * 13 + loss[i]) / 14;
    }
    let RS = (AU / AD) * -1;
    let RSI = 100 - 100 / (1 + RS);
    return RSI;
  } catch (error) {
    return 100;
  }
}

//async function getCandles(coinname, RSI3m, RSI15m)
async function getCandles(coinname, RSI15m) {
  try {
    let low;
    let high;
    let close;
    let per;
    // 포지션이 1이면 숏 종료 포지션이 2이면 롱 종료
    //if (RSI3m <= 35 && RSI15m <= 35 && RSI15m != 100 && RSI3m != 100)
    if (RSI15m <= 35 && RSI15m >= 20 && RSI15m != 100) {
      let candle2 = await binance.futuresCandles(coinname, "15m");
      low = candle2[candle2.length - 2][3];
      close = candle2[candle2.length - 2][4];
      per = (close - low) / low;
      if (per <= tail) {
        //console.log("꼬리 잡힘");
        return 200;
      } else {
        return 400;
      }
    }
    //else if (RSI3m >= 65 && RSI15m >= 65 && RSI15m != 100 && RSI3m != 100)
    else if (RSI15m >= 65 && RSI15m <= 80 && RSI15m != 100) {
      let candle2 = await binance.futuresCandles(coinname, "15m");
      high = candle2[candle2.length - 2][2];
      close = candle2[candle2.length - 2][4];
      per = (high - close) / high;
      if (per <= tail) {
        //console.log("꼬리 잡힘");
        return 100;
      } else {
        return 400;
      }
    }
  } catch (error) {
    return 300;
  }
}

async function OneMinuteLongShort(coinname) {
  try {
    let volume = await binance.futuresCandles(coinname, "1m");
    if (
      parseFloat(volume[volume.length - 1][4]) -
        parseFloat(volume[volume.length - 1][1]) >
      0
    ) {
      return 2;
    } else if (
      parseFloat(volume[volume.length - 1][4]) -
        parseFloat(volume[volume.length - 1][1]) <
      0
    ) {
      return 1;
    }
    //volume : 7 open : 1 close : 4
  } catch (error) {
    return 3;
  }
}

async function getVolume(coinname) {
  try {
    await sleep(2000);
    //volume : 7 open : 1 close : 4
    let volume = await binance.futuresCandles(coinname, "15m");
    let sum = 0;
    for (let i = 1; i < 15; ++i) {
      sum += parseFloat(volume[volume.length - i - 1][7]);
    }
    let avg = sum / 14;
    // for (let i = 1 ; i < 21 ; ++i)
    // {
    //     console.log(i, volume[volume.length-i -1 ][7]/avg);
    // }
    if (parseFloat(volume[volume.length - 1][7]) / avg > 2.5) {
      if (volume[volume.length - 1][4] > volume[volume.length - 1][1]) {
        console.log(coinname);
        console.log("숏 종료");
      } else {
        console.log(coinname);
        console.log("롱 종료");
      }
      var now = new Date();
      let time = now.toLocaleString();
      console.log(time);
      await sleep(900000);
    } else {
      return 2000;
    }
  } catch (error) {
    return 3000;
  }
}

async function getUpdown(coinname, upDown) {
  try {
    if (upDown == 2) {
      //rsi가 높은 상태
      while (true) {
        await sleep(1000);
        let volume = await binance.futuresCandles(coinname, "15m");
        if (
          parseFloat(volume[volume.length - 2][4]) -
            parseFloat(volume[volume.length - 2][1]) <
          0
        ) {
          console.log(
            parseFloat(volume[volume.length - 2][4]) -
              parseFloat(volume[volume.length - 2][1])
          );
          return 20;
        }
      }
    } else if (upDown == 1) {
      //rsi가 낮은 상태
      while (true) {
        await sleep(1000);
        let volume = await binance.futuresCandles(coinname, "15m");
        if (
          parseFloat(volume[volume.length - 2][4]) -
            parseFloat(volume[volume.length - 2][1]) >
          0
        ) {
          console.log(
            parseFloat(volume[volume.length - 2][4]) -
              parseFloat(volume[volume.length - 2][1])
          );
          return 10;
        }
      }
    }
  } catch (error) {
    return 30;
  }
}

async function getCompare(coinname, upDown) {
  // updown 2 => rsi 높음, undown 1 => rsi 낮음
  try {
    await sleep(3000);
    let volume = await binance.futuresCandles(coinname, "15m");
    let up = 0;
    let down = 0;
    //volume : 7 open : 1 close : 4
    for (let i = 0; i < 3; i++) {
      if (
        parseFloat(volume[volume.length + i - 4][4]) -
          parseFloat(volume[volume.length + i - 4][1]) >
        0
      ) {
        if (
          upDown == 2 &&
          (parseFloat(volume[volume.length + i - 4][2]) -
            parseFloat(volume[volume.length + i - 4][4])) /
            parseFloat(volume[volume.length + i - 4][2]) >
            tail
        ) {
          up += 0;
        }
        // else if (i == 0 && upDown == 1 && (parseFloat(volume[volume.length + i - 4][4])-parseFloat(volume[volume.length + i - 4][3]))
        // / parseFloat(volume[volume.length + i - 4][3]) > tail)
        // {
        //     up += 0;
        // }
        else {
          up +=
            (parseFloat(volume[volume.length + i - 4][7]) *
              (parseFloat(volume[volume.length + i - 4][4]) -
                parseFloat(volume[volume.length + i - 4][1]))) /
            parseFloat(volume[volume.length + i - 4][1]);
        }
      } else if (
        parseFloat(volume[volume.length + i - 4][4]) -
          parseFloat(volume[volume.length + i - 4][1]) <
        0
      ) {
        // if (i == 0 && upDown == 2 && (parseFloat(volume[volume.length + i - 4][2])-parseFloat(volume[volume.length + i - 4][4]))
        // / parseFloat(volume[volume.length + i - 4][2]) > tail)
        // {
        //     down += 0;
        // }
        if (
          upDown == 1 &&
          (parseFloat(volume[volume.length + i - 4][4]) -
            parseFloat(volume[volume.length + i - 4][3])) /
            parseFloat(volume[volume.length + i - 4][3]) >
            tail
        ) {
          down += 0;
        } else {
          down +=
            (parseFloat(volume[volume.length + i - 4][7]) *
              (parseFloat(volume[volume.length + i - 4][1]) -
                parseFloat(volume[volume.length + i - 4][4]))) /
            parseFloat(volume[volume.length + i - 4][1]);
        }
      }
    }
    if (up == 0) {
      // rsi가 높았는데 계속 떨어지는 추세 그러면 바로 숏으로
      //console.log(1, up, down);
      return 2;
    } else if (down == 0) {
      //rsi가 낮았는데 계속 오르는 추세 그러면 바로 롱으로
      //console.log(2, up, down);
      return 1;
    }
    // else if (up == 0 && upDown == 1) //rsi가 낮았는데 계속 떨어지는 추세
    // {
    //     let upDo = await getUpdown(coinname, 1);
    //     while (upDo == 30)
    //     {
    //         await sleep(1000);
    //         upDo = await getUpdown(coinname, 1);
    //     }
    //     if (upDo == 10)
    //     {
    //         //console.log(3, up, down);
    //         return 1;
    //     }

    // }
    // else if (down == 0 && upDown == 2) //rsi가 높은데 계속 오르는 추세
    // {
    //     let upDo = await getUpdown(coinname, 2);
    //     while (upDo == 30)
    //     {
    //         await sleep(1000);
    //         upDo = await getUpdown(coinname, 2);
    //     }
    //     if (upDo == 20)
    //     {
    //         //console.log(4, up, down);
    //         return 2;
    //     }
    // }
    else if (up > down && down != 0) {
      //console.log(5, up, down);
      return 1; //숏 종료
    } else if (up < down && up != 0) {
      //console.log(6, up, down);
      return 2; //롱 종료
    } else if (up == 0 && down == 0) {
      //console.log(7, up, down);
      return 5;
    }
  } catch (error) {
    return 3;
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

async function compareCanldes(coinname) {
  try {
    let volume = await binance.futuresCandles(coinname, "1m");
    let avg = 0;
    for (let i = 0; i < 14; i++) {
      avg += parseFloat(volume[volume.length - 2 - i][7]);
    }
    avg = avg / 14;
    if ((parseFloat(volume[volume.length - 2][7]) / avg) * 100 >= 200) {
      if (volume[volume.length - 2][4] > volume[volume.length - 2][1]) {
        return 2;
      } else {
        return 1;
      }
    }
    await sleep(1000);
    return 4;
  } catch (error) {
    return 3;
  }
}

async function showMoney() {
  while (true) {
    let secondreaBlalance = await GetBalances();

    let inputtt = await inputMoney(client, secondreaBlalance);
    while (inputtt == 100) {
      await sleep(1000);
      inputtt = await inputMoney(client, secondreaBlalance);
    }

    await sleep(60000);
  }
}

let firstFailure = 0;
let secondFailure = 0;
let longSuccess = 0;
let shortSuccess = 0;
let firstEmpty = 0;
let secondeEmpty = 0;
let positionDir = "NONE";

async function final(longFail, shortFail, ch) {
  let longSwitch = false;
  let shortSwitch = false;
  let switchS = false;
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
    let firstBalance = await GetBalances();
    if (isNaN(firstBalance)) {
      console.log("UTCK 켜세요");
      return;
    }
    reve = 50;
    await binance.useServerTime();
    await Leverage(reve, coinName);
    await sleep(1000);
    coinPrices = await GetPrices(coinName);
    while (coinPrices == 100000) {
      await sleep(1000);
      coinPrices = await GetPrices(coinName);
    }
    //amt = (secondreaBlalance / coinPrices / 13).toFixed(bbfix);
    // const longAmt = (
    //   (secondreaBlalance / coinPrices / reve) *
    //   5 *
    //   2 ** longFailure
    // ).toFixed(bbfix);
    // const shortAmt = (
    //   (secondreaBlalance / coinPrices / reve) *
    //   5 *
    //   2 ** shortFailure
    // ).toFixed(bbfix);
    const longAmt = (
      (secondreaBlalance / 6700 / coinPrices) *
      reve *
      2 ** longFailure
    ).toFixed(bbfix);
    const shortAmt = (
      (secondreaBlalance / 6700 / coinPrices) *
      reve *
      2 ** shortFailure
    ).toFixed(bbfix);
    console.log(longAmt);
    long = await FuturesLongBuy(longAmt, coinName);
    while (long == 1000) {
      await sleep(1000);
      long = await FuturesLongBuy(longAmt, coinName);
      if (long == 2000) {
        break;
      }
    }
    short = await FuturesShortSell(shortAmt, coinName);
    while (short == 1000) {
      await sleep(1000);
      short = await FuturesShortSell(shortAmt, coinName);
      if (short == 2000) {
        break;
      }
    }
    await sleep(3000);
    json1 = await plusBalance(coinName);
    while (json1.errornum == 1) {
      await sleep(1000);
      json1 = await plusBalance(coinName);
    }
    let longEntryPrice = parseFloat(json1.entryPrice);
    let plusAmt = await getplusAmt(json1);
    // let longStopPrice = (longEntryPrice * 0.995).toFixed(fix);
    // let longLimitPrice = (longEntryPrice * 1.006).toFixed(fix);
    // let longSadPrice = (longEntryPrice * 1.001).toFixed(fix);
    // let longSadPrice2 = longEntryPrice * 1.0035;
    let longStopPrice = (
      longEntryPrice *
      (0.996 - longFailure * 0.0005)
    ).toFixed(fix);
    let longLimitPrice = (
      longEntryPrice *
      (1.005 + longFailure * 0.0005)
    ).toFixed(fix);
    json2 = await minusBalance(coinName);
    while (json2.errornum == 1) {
      await sleep(1000);
      json2 = await minusBalance(coinName);
    }
    let longBadPrice = longEntryPrice * (1.006 + longFailure * 0.0005);
    let longMoreBadPrice = longEntryPrice * (0.995 - longFailure * 0.0005);
    let shortEntryPrice = parseFloat(json2.entryPrice);
    let minusAmt = await getminusAmt(json2);
    let shortStopPrice = (
      shortEntryPrice *
      (1.004 + shortFailure * 0.0005)
    ).toFixed(fix);
    let shortLimitPrice = (
      shortEntryPrice *
      (0.995 - shortFailure * 0.0005)
    ).toFixed(fix);
    let shortBadPrice = shortEntryPrice * (0.994 - shortFailure * 0.0005);
    let shortMoreBadPrice = shortEntryPrice * (1.005 + shortFailure * 0.0005);
    let stopLongSell = await FuturesstopLongSell(
      plusAmt,
      coinName,
      longStopPrice
    );
    while (stopLongSell == 1000) {
      await cancleOrder(coinName);
      await sleep(300000);
      return;
      await sleep(1000);
      stopLongSell = stopLongSell = await FuturesstopLongSell(
        plusAmt,
        coinName,
        longStopPrice
      );
      if (stopLongSell == 2000) {
        break;
      }
    }
    let stopShortBuy = await FuturesstopShortBuy(
      minusAmt,
      coinName,
      shortStopPrice
    );
    while (stopShortBuy == 1000) {
      await cancleOrder(coinName);
      await sleep(300000);
      return;
      await sleep(1000);
      stopShortBuy = await FuturesstopShortBuy(
        minusAmt,
        coinName,
        shortStopPrice
      );
      if (stopShortBuy == 2000) {
        break;
      }
    }
    let limitLongSell = await FutureslimitLongSell(
      plusAmt,
      coinName,
      longLimitPrice
    );
    while (limitLongSell == 1000) {
      await cancleOrder(coinName);
      await sleep(300000);
      return;
      await sleep(1000);
      limitLongSell = await FutureslimitLongSell(
        plusAmt,
        coinName,
        longLimitPrice
      );
      if (limitLongSell == 2000) {
        break;
      }
    }
    let limitShortBuy = await FutureslimitShortBuy(
      shortAmt,
      coinName,
      shortLimitPrice
    );
    while (limitShortBuy == 1000) {
      await cancleOrder(coinName);
      await sleep(300000);
      return;
      await sleep(1000);
      limitShortBuy = await FutureslimitShortBuy(
        shortAmt,
        coinName,
        shortLimitPrice
      );
      if (limitShortBuy == 2000) {
        break;
      }
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
        if (longEntryPrice >= markPrice) {
          longFailure++;
          positionDir = "SHORT";
        } else if (markPrice >= longEntryPrice) {
          longFailure = 0;
          longSuccess++;
          positionDir = "LONG";
        }
        longSwitch = true;
      }
      if (minusAmt == 0 && shortSwitch == false) {
        if (shortEntryPrice <= markPrice) {
          shortFailure++;
          positionDir = "LONG";
        } else if (markPrice <= shortEntryPrice) {
          shortFailure = 0;
          shortSuccess++;
          positionDir = "SHORT";
        }
        shortSwitch = true;
      }
      if (shortSwitch && longSwitch) {
        await cancleOrder(coinName);
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
        console.log(firstEmpty, secondeEmpty);
        return;
      }
      // console.log(
      //   "롱 :",
      //   markPrice - longEntryPrice,
      //   "숏 :",
      //   shortEntryPrice - markPrice
      // );
      await sleep(150);
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
//   let TSM = 0;
//   let QSM = 0;
//   let FSM = 0;
//   let chance = true;
//   let select = coin * 1;
//   let num;
//   secondreaBlalance = await GetBalances();
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
//       coinName = "FTMUSDT";
//       num = 3;
//       fix = 4;
//       bbfix = 0;
//       break;
//   }
//   while (true) {
//     const sorted = [FFM, SFM, TSM, QSM, FSM].sort();
//     FFM = sorted[4];
//     SFM = sorted[3];
//     TSM = sorted[2];
//     QSM = sorted[1];
//     FSM = sorted[0];
//     console.log(FFM, SFM, TSM, QSM, FSM);
//     await inputManager(
//       client,
//       coinName,
//       num,
//       FFM,
//       SFM,
//       TSM,
//       QSM,
//       FSM,
//       longSuccess,
//       shortSuccess
//     );
//     if (FFM == 4 && SFM == 0) {
//       let secondreaBlalance2 = await GetBalances();
//       if (secondreaBlalance2 > secondreaBlalance) {
//         secondreaBlalance = secondreaBlalance2;
//       }
//     }
//     let stopAll = await getManagerStop(client);
//     while (stopAll == 100) {
//       await sleep(1000);
//       stopAll = await getManagerStop(client);
//     }
//     // if (FFM >= 4 && SFM >= 2) {
//     //   let stop = await getManager(client);
//     //   while (stop == 100) {
//     //     await sleep(1000);
//     //     stop = await getManager(client);
//     //   }
//     //   if (stop != num && stop != 0) {
//     //     console.log("대기중");
//     //     await sleep(60000);
//     //     continue;
//     //   } else if (stop == 0) {
//     //     let input = await inputManagerFail(client, num);
//     //     while (input == 100) {
//     //       await sleep(1000);
//     //       input = await inputManagerFail(client, num);
//     //     }
//     //   }
//     // }
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
//       if (FSM != 0 && QSM != 0) {
//         await final(QSM, FSM, false);
//         QSM = firstFailure;
//         FSM = secondFailure;
//       } else if (QSM != 0 && TSM != 0) {
//         await final(TSM, QSM, false);
//         TSM = firstFailure;
//         QSM = secondFailure;
//       } else if (TSM != 0 && SFM != 0) {
//         await final(SFM, TSM, false);
//         SFM = firstFailure;
//         TSM = secondFailure;
//       } else if (SFM != 0 && FFM != 1) {
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
//       if (FFM == SFM || SFM >= 2) {
//         await final(FFM, SFM, false);
//         FFM = firstFailure;
//         SFM = secondFailure;
//       } else if (SFM == TSM) {
//         await final(SFM, TSM, false);
//         SFM = firstFailure;
//         TSM = secondFailure;
//       } else if (TSM == QSM) {
//         await final(TSM, QSM, false);
//         TSM = firstFailure;
//         QSM = secondFailure;
//       } else {
//         await final(QSM, FSM, false);
//         QSM = firstFailure;
//         FSM = secondFailure;
//       }
//     }
//     let stop = await getManager(client);
//     while (stop == 100) {
//       await sleep(1000);
//       stop = await getManager(client);
//     }
//     if (stop == num && FFM == 3 && SFM == 0) {
//       let input = await inputManagerFail(client, 0);
//       while (input == 100) {
//         await sleep(1000);
//         input = await inputManagerFail(client, 0);
//       }
//     }
//     if (FFM >= 9) {
//       return;
//     } else if (FFM >= 4 && SFM >= 2) {
//       let stop = await getManager(client);
//       while (stop == 100) {
//         await sleep(1000);
//         stop = await getManager(client);
//       }
//       if (stop == 0) {
//         let input = await inputManagerFail(client, num);
//         while (input == 100) {
//           await sleep(1000);
//           input = await inputManagerFail(client, num);
//         }
//       }
//     } else if (stopAll == 1 && FFM >= 4) {
//       let stop = await getManager(client);
//       while (stop == 100) {
//         await sleep(1000);
//         stop = await getManager(client);
//       }
//       if (stop == 0) {
//         let input = await inputManagerFail(client, num);
//         while (input == 100) {
//           await sleep(1000);
//           input = await inputManagerFail(client, num);
//         }
//       }
//     }
//   }
// }

async function home(coin) {
  let FFM = 0;
  let SFM = 0;
  let select = coin * 1;
  let num;
  let start = true;
  secondreaBlalance = await GetBalances();
  if (isNaN(secondreaBlalance)) {
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
      coinName = "TRXUSDT";
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
  }
  while (true) {
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
    if (manager[4] == "1" && FFM <= 1 && SFM <= 1) {
      const sorted = [parseInt(manager[0]), parseInt(manager[1])].sort();
      FFM = sorted[1];
      SFM = sorted[0];
      longSuccess = parseInt(manager[2]);
      shortSuccess = parseInt(manager[3]);
      inputManagerFFM(client, num);
    } else {
      const sorted = [FFM, SFM].sort();
      FFM = sorted[1];
      SFM = sorted[0];
    }
    console.log(FFM, SFM);
    await inputManager(
      client,
      coinName,
      num,
      FFM,
      SFM,
      longSuccess,
      shortSuccess
    );
    let secondreaBlalance2 = await GetBalances();
    if (secondreaBlalance2 > secondreaBlalance) {
      secondreaBlalance = secondreaBlalance2;
    }
    let stopAll = await getManagerStop(client);
    while (stopAll == 100) {
      await sleep(1000);
      stopAll = await getManagerStop(client);
    }
    if (FFM >= 10) {
      let stop = await getManager(client);
      while (stop == 100) {
        await sleep(1000);
        stop = await getManager(client);
      }
      if (stop != num && stop != 0) {
        await sleep(60000);
        continue;
      } else if (stop == 0) {
        let input = await inputManagerFail(client, num);
        while (input == 100) {
          await sleep(1000);
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
      if (SFM != 0 && FFM != 1) {
        await final(FFM, SFM, false);
        FFM = firstFailure;
        SFM = secondFailure;
      } else if (SFM == 0 && FFM != 1) {
        await final(FFM, 0, false);
        FFM = firstFailure;
        SFM = secondFailure;
      } else if (FFM == 1) {
        await cancleOrder(coinName);
        let stop = await getManager(client);
        while (stop == 100) {
          await sleep(1000);
          stop = await getManager(client);
        }
        if (stop == num) {
          let input = await inputManagerFail(client, 0);
          while (input == 100) {
            await sleep(1000);
            input = await inputManagerFail(client, 0);
          }
        }
        return;
      }
    } else {
      await final(FFM, SFM, false);
      FFM = firstFailure;
      SFM = secondFailure;
      let stop = await getManager(client);
      while (stop == 100) {
        await sleep(1000);
        stop = await getManager(client);
      }
      if (stop == num && FFM < 5) {
        let input = await inputManagerFail(client, 0);
        while (input == 100) {
          await sleep(1000);
          input = await inputManagerFail(client, 0);
        }
      }
    }
    if (FFM >= 13) {
      return;
    }
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
  shortSuccess
) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    let memberArray = new Array();
    memberArray[0] = new Array(
      coinName,
      FFM.toString(),
      SFM.toString(),
      longSuccess.toString(),
      shortSuccess.toString()
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

home(3);
async function abc() {
  const order = await binance.futuresAllOrders("FTMUSDT");
  console.log(order.length);
  for (let i = order.length - 1; i >= 0; i--) {
    if (order[i].status == "FILLED" && order[i].positionSide == "LONG") {
      console.log(order[i]);
    }
  }
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
