const Binance = require("node-binance-api");
require("dotenv").config();
const { google } = require("googleapis");
const keys = require("./credentials.json");
const client = new google.auth.JWT(
  "bot-user@bot-project-345504.iam.gserviceaccount.com",

  null,

  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDNizgufm1E+5pd\nORwy+HQNIJaIhyQ2j6rJhT0GpcRmC50HkPXMrnEd7jkuuGk8uTuxwROT8c4cda1n\nA19NuunktVhXJu7U4vDb2QgUK2cOwrXV4BSpmQsJnQbxfuC+RwwfhKrXoIkwCZ8M\nAiiEyQyecpXby4CoaDu5viYPQvynBTEK44Ls6z26TF6fLrvyPg0dMNYZrR/ZFzwH\nG/8ya/Q9ib8i4ff8rQhnV1ZCaPepO5ftvzPgts45wsB8YB5WHy7oFnKYJxDqmJKL\nu2dOELZLruKghiLHVuVbTN70osTMTvBw+49HmgHoTbsoEAVuu7TRUVu1yLt7njpz\n3PpUApWHAgMBAAECggEAEk59AX8XIla6Z+UnQs7oHycw4RYQPp/LGUm5prbq6B/O\nq5bYnZNH1d+azjN0hAkHbQyCPuIBdn1wpUUintyv6kPQi2qXSPSxeRM6afl3o1Pq\nOBNOI9DSr9eBf87KG4heZww83xmYPmQM+1fR3gm+CvqvqDTWz6kA8MkjwKY5tHJT\n5YoUeV7Vi+4joTK/rgHFB35kqtzs1gfc1U+gAW/DvhzdKncmml5+2BfNH6IjTLgM\n/2ruCKzGFa18VwRgVh9KP6uXaPN6rkn3taarl15E2ELIXycUQw1QIRPKU6RM6IGl\nEaDJm+OfvdpYRVUDLA2YluF3sglkoFBoXAe6s0wc4QKBgQD7HQx48BLqx1TDaxkf\nPfr3RCDYpugrnWrf3nxqtxbZatbV3n0IMUhiA1l9Tx6FpR0G+nah/c2ddYy5oYoH\nKs+iE0NNIMk3hCnHwBp0t8a5Z4PiOUCWAcuYrjwjpQbQxVeMs2bo/vNK4uSPzouS\npllTVugqRirQx6CJ90hQMY26lwKBgQDRiykCYWXyE6fCh4emDoCd4mK+SAaJAHpe\nH+taXfUiopqOxfsxE5RQfZOR1lU8x1EPMoe0rudQrOW4w+kyeI+yxTfijw4LJTsr\n04zk0F0DULB6YDDUpj+BM3NDYkPn4xDvBaVZXuvDiyyjwSRKCSEMPao1n9AmMAU0\nFfLiOl4KkQKBgCZFMxVrYTau0lhGBjogtBLjKy5ZoaCkCRm9SrDo3m6cPcmyctPA\nzwtA/259lGVB2L6rhVEC4UdSFvRjjimxeJt23BbxHDl9xvBOcrm/GGZBRHRBzXoP\nI/xM8ZVtHTDMIp+q59AyqtmK4tKX4+WhvJNa918Z+oR/KBRev4KZSsRZAoGBAI0V\n45DEv31Umpmx4zV9gj/L06xGlo/cEIgbeb2okYq2bNZAmzaZ9jyTsK56331CvmM7\nJIAVW43IPAxBbFwdLLOzckNLCquab9K8Z5sQZ+/5fjmHVpl3Lj7xw2PVX99b1WT6\nKjCYZqmMpYvEWYi3yNaTFm1woxdzMa22MYj8v6DhAoGAD32j6nOcVQCpyk2ME6EB\nfcdQEmgx59AIcYoGb9/btQCNS7i2zhJw06z1icBSvsqPIDumXh122/JSJLTTAz6p\nAK59rPiprMQB+8Yx7ACFUPlS8bJIj2/DVMs7yLNHQSZNMI2KOMEcffh4fC3SkzOM\ni/cRlN6m3gtQo5hXhu4hfS0=\n-----END PRIVATE KEY-----\n",

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
        await cancleOrder(coinName);
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
        await cancleOrder(coinName);
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
            await cancleOrder(coinName);
            return;
          }
          await sleep(100);
        }
      }
      if (plusAmt === 0) {
        await cancleOrder(coinName);
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
        await cancleOrder(coinName);
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
        await cancleOrder(coinName);
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
            await cancleOrder(coinName);
            inputEnd(true);
            return;
          }
          await sleep(100);
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
        await cancleOrder(coinName);
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
        await cancleOrder(coinName);
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
        await cancleOrder(coinName);
        inputEnd(true);
        return;
      }
      await sleep(100);
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
      inputEnd(false);
      let input = inputManager(client, coin, amountFix, priceFix);
      while (input === 100) {
        await sleep(1000);
        input = inputManager(client, coin, amountFix, priceFix);
      }
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
      }
    }
    await sleep(1000);
  }
}

main();
