var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Binance = require("node-binance-api");
var google = require("googleapis").google;
var keys = require("./credentials.json");
var readline = require("readline");
var SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
var client = new google.auth.JWT(keys.client_email, null, keys.private_key, ["https://www.googleapis.com/auth/spreadsheets"] // 사용자 시트 및 해당 속성에 대한 읽기/쓰기 액세스 허용
);
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var XLSX = require("xlsx");
var transporter = nodemailer.createTransport(smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "wlstjsdn12@gmail.com",
        pass: "dkfejtjsdn12!"
    }
}));
var mailOptions = {
    from: "wlstjsdn12@gmail.com",
    to: "wlstjsdn12@gmail.com",
    subject: "오류남",
    text: "멈춤"
};
var isFail = false;
var binance = new Binance().options({
    APIKEY: "cdnPPkgDmOA6M4qf3R4RFttRg4oHRSYdJvgyL0nQa2pTccWKN85OhCKKDklkzwAP",
    APISECRET: "1WH46dc1WfGfkz8ucPTevhQ19vt1uCL5K9PTXjPx2EFYyzPmC4Z6YHDvKDX4rDy1",
    useServerTime: true,
    reconnect: true,
    recvWindow: 90000,
    verbose: true,
    hedgeMode: true
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
var order_flag;
var coinPrices;
var myusefulBalances;
var json1 = {
    errornum: 0,
    positionAmt: "",
    entryPrice: "",
    unRealizedProfit: "",
    markPrice: ""
};
var json2 = {
    errornum: 0,
    positionAmt: "",
    entryPrice: "",
    unRealizedProfit: "",
    markPrice: ""
};
var reve;
var bb;
var bb2;
var ris;
var longOrdernum;
var failTry;
var maxFailtry = 0;
var shortOrdernum;
var cont = 0;
var cont2;
var amt;
var badProfit = 0;
var min = 0;
var success = 0;
var success2 = 0;
var plussuccess = 0;
var minussuccess = 0;
var profit1 = 0.7; // 안보임
var profit2 = profit1; // 잘 되는 쪽
var profit3 = profit1;
var profit4 = profit1;
var profit5 = 0.7; // 잘 안되는 쪽
var fail = 0;
var fee2 = 0;
var select;
var longmin;
var shortmin;
var plusfee;
var minusfee;
var direction;
var change = 0;
var realfee;
var good = 0;
var fix;
var bbfix;
var long;
var short;
var tail;
var flag;
var totalProfit = 0;
var successFail = 0;
function get(client) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, request, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: "manager!A2:A2"
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.get(request)];
                case 1:
                    response = (_a.sent()).data;
                    return [2 /*return*/, parseFloat(response.values[0][0])];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getLongShort(client, pos) {
    return __awaiter(this, void 0, void 0, function () {
        var inp, sheets, request, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    inp = "manager!F" + (pos + 3).toString() + ":F" + (pos + 3).toString();
                    sheets = google.sheets({ version: "v4", auth: client });
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: inp
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.get(request)];
                case 1:
                    response = (_a.sent()).data;
                    return [2 /*return*/, parseFloat(response.values[0][0])];
                case 2:
                    error_2 = _a.sent();
                    console.log(error_2);
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function get2(client) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, request, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: "manager!B2:B2"
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.get(request)];
                case 1:
                    response = (_a.sent()).data;
                    return [2 /*return*/, parseFloat(response.values[0][0])];
                case 2:
                    error_3 = _a.sent();
                    console.log(error_3);
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function input(client, num) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, memberArray, request, response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    memberArray = new Array();
                    memberArray[0] = new Array(num.toString());
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: "manager!G2",
                        valueInputOption: "USER_ENTERED",
                        resource: { values: memberArray }
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.update(request)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, 1];
                case 2:
                    error_4 = _a.sent();
                    console.log(error_4);
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function inputEnd(client) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, memberArray, num, request, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    memberArray = new Array();
                    num = 0;
                    memberArray[0] = new Array(num.toString());
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: "manager!G2",
                        valueInputOption: "USER_ENTERED",
                        resource: { values: memberArray }
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.update(request)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, 1];
                case 2:
                    error_5 = _a.sent();
                    console.log(error_5);
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function inputLongShort(client, pos, off) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, memberArray, zero, inp, request, response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    memberArray = new Array();
                    zero = 1;
                    if (off == 0) {
                        zero = 0;
                    }
                    memberArray[0] = new Array(zero.toString());
                    inp = "manager!F" + (pos + 3).toString() + ":F" + (pos + 3).toString();
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: inp,
                        valueInputOption: "USER_ENTERED",
                        resource: { values: memberArray }
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.update(request)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, 1];
                case 2:
                    error_6 = _a.sent();
                    console.log(error_6);
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function inputFail2(client, coinname, failure, pos, success, SuccessTry, totalProfit, flagSum) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, memberArray, inp, request, response, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    memberArray = new Array();
                    memberArray[0] = new Array(coinname, failure.toString(), success.toString(), maxFailtry.toString(), SuccessTry.toString(), totalProfit.toString(), flagSum.toString());
                    inp = "manager!A" + (pos + 3).toString();
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: inp,
                        valueInputOption: "USER_ENTERED",
                        resource: { values: memberArray }
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.update(request)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, 1];
                case 2:
                    error_7 = _a.sent();
                    console.log(error_7);
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function inputFail12(client, coinname, failure, pos, success, totalProfit, margin) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, memberArray, inp, request, response, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    memberArray = new Array();
                    memberArray[0] = new Array(coinname, failure.toString(), success.toString(), maxFailtry.toString(), totalProfit.toString(), margin.toString());
                    inp = "manager!A" + (pos + 3).toString();
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: inp,
                        valueInputOption: "USER_ENTERED",
                        resource: { values: memberArray }
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.update(request)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, 1];
                case 2:
                    error_8 = _a.sent();
                    console.log(error_8);
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function inputFail3(client, coinname, failure, pos, success, totalProfit, flagSum) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, memberArray, inp, request, response, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    memberArray = new Array();
                    memberArray[0] = new Array(coinname, failure.toString(), success.toString(), maxFailtry.toString(), totalProfit.toString(), flagSum.toString());
                    inp = "manager!A" + (pos + 3).toString();
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: inp,
                        valueInputOption: "USER_ENTERED",
                        resource: { values: memberArray }
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.update(request)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, 1];
                case 2:
                    error_9 = _a.sent();
                    console.log(error_9);
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function inputPercent(client, pos, percent) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, memberArray, inp, request, response, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    memberArray = new Array();
                    memberArray[0] = new Array(percent.toString());
                    inp = "manager!H" + (pos + 3).toString() + ":H" + (pos + 3).toString();
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: inp,
                        valueInputOption: "USER_ENTERED",
                        resource: { values: memberArray }
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.update(request)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, 1];
                case 2:
                    error_10 = _a.sent();
                    console.log(error_10);
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function inputFail(client, coinname, failure, pos, success, SuccessTry) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, memberArray, inp, request, response, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    memberArray = new Array();
                    memberArray[0] = new Array(coinname, failure.toString(), success.toString(), maxFailtry.toString(), SuccessTry.toString());
                    inp = "manager!A" + (pos + 3).toString();
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: inp,
                        valueInputOption: "USER_ENTERED",
                        resource: { values: memberArray }
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.update(request)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, 1];
                case 2:
                    error_11 = _a.sent();
                    console.log(error_11);
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function inputMoney(client, balance) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, memberArray, inp, request, response, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    memberArray = new Array();
                    memberArray[0] = new Array(balance.toString());
                    inp = "manager!D2";
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: inp,
                        valueInputOption: "USER_ENTERED",
                        resource: { values: memberArray }
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.update(request)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, 1];
                case 2:
                    error_12 = _a.sent();
                    console.log(error_12);
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function getError() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("Email sent: " + info.response);
                }
            });
            return [2 /*return*/];
        });
    });
}
function GetPrices(coinname) {
    return __awaiter(this, void 0, void 0, function () {
        var prices, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresMarkPrice(coinname)];
                case 1:
                    prices = _a.sent();
                    return [2 /*return*/, parseFloat(prices.markPrice)];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, 100000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function GetAccount() {
    return __awaiter(this, void 0, void 0, function () {
        var balances, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresBalance()];
                case 1:
                    balances = _a.sent();
                    return [2 /*return*/, parseFloat(balances[1].availableBalance)];
                case 2:
                    err_2 = _a.sent();
                    console.log(err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function GetPnl() {
    return __awaiter(this, void 0, void 0, function () {
        var balances, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresBalance()];
                case 1:
                    balances = _a.sent();
                    return [2 /*return*/, parseFloat(balances[1].crossUnPnl)];
                case 2:
                    err_3 = _a.sent();
                    console.log(err_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function GetBalances() {
    return __awaiter(this, void 0, void 0, function () {
        var balance, balances, nums, _i, nums_1, num, obj, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    balance = void 0;
                    return [4 /*yield*/, binance.futuresBalance()];
                case 1:
                    balances = _a.sent(), nums = Object.keys(balances);
                    for (_i = 0, nums_1 = nums; _i < nums_1.length; _i++) {
                        num = nums_1[_i];
                        obj = balances[num];
                        if (obj.asset == "USDT") {
                            balance = obj.balance;
                        }
                    }
                    return [2 /*return*/, parseFloat(balance)];
                case 2:
                    err_4 = _a.sent();
                    return [2 /*return*/, 10];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FuturesLongBuy(x, y) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketBuy, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresMarketBuy(y, x, {
                            positionSide: "LONG"
                        })];
                case 1:
                    MarketBuy = _a.sent();
                    if (MarketBuy.code != null) {
                        if (MarketBuy.code != -4164) {
                            console.log(MarketBuy.msg);
                            console.log(x, y);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketBuy);
                    return [2 /*return*/, 2000];
                case 2:
                    err_5 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FuturesstopLongBuy(x, y, z) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketBuy, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresMarketBuy(y, x, {
                            positionSide: "LONG",
                            type: "STOP_MARKET",
                            stopPrice: z
                        })];
                case 1:
                    MarketBuy = _a.sent();
                    if (MarketBuy.code != null) {
                        if (MarketBuy.code != -4164) {
                            console.log(MarketBuy.msg);
                            console.log(x, y, z);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketBuy);
                    return [2 /*return*/, 2000];
                case 2:
                    err_6 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FutureslimitLongBuy(x, y, z) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketBuy, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresBuy(y, x, z, { positionSide: "LONG" })];
                case 1:
                    MarketBuy = _a.sent();
                    if (MarketBuy.code != null) {
                        if (MarketBuy.code != -4164) {
                            console.log(MarketBuy.msg);
                            console.log(x, y, z);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketBuy);
                    return [2 /*return*/, 2000];
                case 2:
                    err_7 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FuturestakelimitLongBuy(x, y, z) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketBuy, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresBuy(y, x, z, {
                            positionSide: "LONG",
                            type: "TAKE_PROFIT",
                            stopPrice: z
                        })];
                case 1:
                    MarketBuy = _a.sent();
                    if (MarketBuy.code != null) {
                        if (MarketBuy.code != -4164) {
                            console.log(MarketBuy.msg);
                            console.log(x, y, z);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketBuy);
                    return [2 /*return*/, 2000];
                case 2:
                    err_8 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FuturesstoplimitLongBuy(x, y, z) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketBuy, err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresBuy(y, x, z, {
                            positionSide: "LONG",
                            type: "STOP",
                            stopPrice: z
                        })];
                case 1:
                    MarketBuy = _a.sent();
                    if (MarketBuy.code != null) {
                        if (MarketBuy.code != -4164) {
                            console.log(MarketBuy.msg);
                            console.log(x, y, z);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketBuy);
                    return [2 /*return*/, 2000];
                case 2:
                    err_9 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FuturesShortBuy(x, y) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketBuy, err_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresMarketBuy(y, x, {
                            positionSide: "SHORT"
                        })];
                case 1:
                    MarketBuy = _a.sent();
                    if (MarketBuy.code != null) {
                        if (MarketBuy.code != -4164) {
                            console.log(MarketBuy.msg);
                            console.log(x, y);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketBuy);
                    return [2 /*return*/, 2000];
                case 2:
                    err_10 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FuturesstopShortBuy(x, y, z) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketBuy, err_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresMarketBuy(y, x, {
                            positionSide: "SHORT",
                            type: "STOP_MARKET",
                            stopPrice: z
                        })];
                case 1:
                    MarketBuy = _a.sent();
                    if (MarketBuy.code != null) {
                        if (MarketBuy.code != -4164) {
                            console.log(MarketBuy.msg);
                            console.log(x, y, z);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketBuy);
                    return [2 /*return*/, 2000];
                case 2:
                    err_11 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FutureslimitShortBuy(x, y, z) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketBuy, err_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresBuy(y, x, z, {
                            positionSide: "SHORT"
                        })];
                case 1:
                    MarketBuy = _a.sent();
                    if (MarketBuy.code != null) {
                        if (MarketBuy.code != -4164) {
                            console.log(MarketBuy.msg);
                            console.log(x, y, z);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketBuy);
                    return [2 /*return*/, 2000];
                case 2:
                    err_12 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FuturesstoplimitShortBuy(x, y, z) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketBuy, err_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresBuy(y, x, z, {
                            positionSide: "SHORT",
                            type: "STOP",
                            stopPrice: z
                        })];
                case 1:
                    MarketBuy = _a.sent();
                    if (MarketBuy.code != null) {
                        if (MarketBuy.code != -4164) {
                            console.log(MarketBuy.msg);
                            console.log(x, y, z);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketBuy);
                    return [2 /*return*/, 2000];
                case 2:
                    err_13 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FuturestakelimitShortBuy(x, y, z) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketBuy, err_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresBuy(y, x, z, {
                            positionSide: "SHORT",
                            type: "TAKE_PROFIT",
                            stopPrice: z
                        })];
                case 1:
                    MarketBuy = _a.sent();
                    if (MarketBuy.code != null) {
                        if (MarketBuy.code != -4164) {
                            console.log(MarketBuy.msg);
                            console.log(x, y, z);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketBuy);
                    return [2 /*return*/, 2000];
                case 2:
                    err_14 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FuturesShortSell(x, y) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketSell, err_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresMarketSell(y, x, {
                            positionSide: "SHORT"
                        })];
                case 1:
                    MarketSell = _a.sent();
                    if (MarketSell.code != null) {
                        if (MarketSell.code != -4164) {
                            console.log(MarketSell.msg);
                            console.log(x, y);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketSell);
                    return [2 /*return*/, 2000];
                case 2:
                    err_15 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FuturesstopShortSell(x, y, z) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketSell, err_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresMarketSell(y, x, {
                            positionSide: "SHORT",
                            type: "STOP_MARKET",
                            stopPrice: z
                        })];
                case 1:
                    MarketSell = _a.sent();
                    if (MarketSell.code != null) {
                        if (MarketSell.code != -4164) {
                            console.log(MarketSell.msg);
                            console.log(x, y, z);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketSell);
                    return [2 /*return*/, 2000];
                case 2:
                    err_16 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FutureslimitShortSell(x, y, z) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketSell, err_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresSell(y, x, z, {
                            positionSide: "SHORT"
                        })];
                case 1:
                    MarketSell = _a.sent();
                    if (MarketSell.code != null) {
                        if (MarketSell.code != -4164) {
                            console.log(MarketSell.msg);
                            console.log(x, y, z);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketSell);
                    return [2 /*return*/, 2000];
                case 2:
                    err_17 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FuturesstoplimitShortSell(x, y, z) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketSell, err_18;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresSell(y, x, z, {
                            positionSide: "SHORT",
                            type: "STOP",
                            stopPrice: z
                        })];
                case 1:
                    MarketSell = _a.sent();
                    if (MarketSell.code != null) {
                        if (MarketSell.code != -4164) {
                            console.log(MarketSell.msg);
                            console.log(x, y, z);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketSell);
                    return [2 /*return*/, 2000];
                case 2:
                    err_18 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FuturestakelimitShortSell(x, y, z) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketSell, err_19;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresSell(y, x, z, {
                            positionSide: "SHORT",
                            type: "TAKE_PROFIT",
                            stopPrice: z
                        })];
                case 1:
                    MarketSell = _a.sent();
                    if (MarketSell.code != null) {
                        if (MarketSell.code != -4164) {
                            console.log(MarketSell.msg);
                            console.log(x, y, z);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketSell);
                    return [2 /*return*/, 2000];
                case 2:
                    err_19 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FuturesLongSell(x, y) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketSell, err_20;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresMarketSell(y, x, {
                            positionSide: "LONG"
                        })];
                case 1:
                    MarketSell = _a.sent();
                    if (MarketSell.code != null) {
                        if (MarketSell.code != -4164) {
                            console.log(MarketSell.msg);
                            console.log(x, y);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketSell);
                    return [2 /*return*/, 2000];
                case 2:
                    err_20 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FuturesstopLongSell(x, y, z) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketSell, err_21;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresMarketSell(y, x, {
                            positionSide: "LONG",
                            type: "STOP_MARKET",
                            stopPrice: z
                        })];
                case 1:
                    MarketSell = _a.sent();
                    if (MarketSell.code != null) {
                        if (MarketSell.code != -4164) {
                            console.log(MarketSell.msg);
                            console.log(x, y, z);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketSell);
                    return [2 /*return*/, 2000];
                case 2:
                    err_21 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FutureslimitLongSell(x, y, z) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketSell, err_22;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresSell(y, x, z, {
                            positionSide: "LONG"
                        })];
                case 1:
                    MarketSell = _a.sent();
                    if (MarketSell.code != null) {
                        if (MarketSell.code != -4164) {
                            console.log(MarketSell.msg);
                            console.log(x, y, z);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketSell);
                    return [2 /*return*/, 2000];
                case 2:
                    err_22 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FuturesstoplimitLongSell(x, y, z) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketSell, err_23;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresSell(y, x, z, {
                            positionSide: "LONG",
                            type: "STOP",
                            stopPrice: z
                        })];
                case 1:
                    MarketSell = _a.sent();
                    if (MarketSell.code != null) {
                        if (MarketSell.code != -4164) {
                            console.log(MarketSell.msg);
                            console.log(x, y, z);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketSell);
                    return [2 /*return*/, 2000];
                case 2:
                    err_23 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function FuturestakelimitLongSell(x, y, z) {
    return __awaiter(this, void 0, void 0, function () {
        var MarketSell, err_24;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresSell(y, x, z, {
                            positionSide: "LONG",
                            type: "TAKE_PROFIT",
                            stopPrice: z
                        })];
                case 1:
                    MarketSell = _a.sent();
                    if (MarketSell.code != null) {
                        if (MarketSell.code != -4164) {
                            console.log(MarketSell.msg);
                            console.log(x, y, z);
                            return [2 /*return*/, 1000];
                        }
                    }
                    console.log(MarketSell);
                    return [2 /*return*/, 2000];
                case 2:
                    err_24 = _a.sent();
                    return [2 /*return*/, 1000];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function cancleOrder(x) {
    return __awaiter(this, void 0, void 0, function () {
        var order, err_25;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresCancelAll(x)];
                case 1:
                    order = _a.sent();
                    console.log(order);
                    return [3 /*break*/, 3];
                case 2:
                    err_25 = _a.sent();
                    console.log(err_25);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function plusBalance(coinname) {
    return __awaiter(this, void 0, void 0, function () {
        var position_data, markets, _i, markets_1, market, obj, size, err_26;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    json1.errornum = 0;
                    return [4 /*yield*/, binance.futuresPositionRisk()];
                case 1:
                    position_data = _a.sent(), markets = Object.keys(position_data);
                    for (_i = 0, markets_1 = markets; _i < markets_1.length; _i++) {
                        market = markets_1[_i];
                        obj = position_data[market], size = Number(obj.positionAmt);
                        if (size == 0 && obj.symbol != coinname)
                            continue;
                        if (obj.positionSide == "LONG" && obj.symbol == coinname) {
                            json1.positionAmt = obj.positionAmt;
                            json1.entryPrice = obj.entryPrice;
                            json1.unRealizedProfit = obj.unRealizedProfit;
                            json1.markPrice = obj.markPrice;
                        }
                    }
                    return [2 /*return*/, json1];
                case 2:
                    err_26 = _a.sent();
                    json1.errornum = 1;
                    return [2 /*return*/, json1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function minusBalance(coinname) {
    return __awaiter(this, void 0, void 0, function () {
        var position_data, markets, _i, markets_2, market, obj, size, err_27;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    json2.errornum = 0;
                    return [4 /*yield*/, binance.futuresPositionRisk()];
                case 1:
                    position_data = _a.sent(), markets = Object.keys(position_data);
                    for (_i = 0, markets_2 = markets; _i < markets_2.length; _i++) {
                        market = markets_2[_i];
                        obj = position_data[market], size = Number(obj.positionAmt);
                        if (size == 0 && obj.symbol != coinname)
                            continue;
                        if (obj.positionSide == "SHORT" && obj.symbol == coinname) {
                            json2.positionAmt = obj.positionAmt;
                            json2.entryPrice = obj.entryPrice;
                            json2.unRealizedProfit = obj.unRealizedProfit;
                            json2.markPrice = obj.markPrice;
                        }
                    }
                    return [2 /*return*/, json2];
                case 2:
                    err_27 = _a.sent();
                    json2.errornum = 1;
                    return [2 /*return*/, json2];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function longnum(x, plusEntry, json1) {
    return __awaiter(this, void 0, void 0, function () {
        var long_1;
        return __generator(this, function (_a) {
            try {
                long_1 = ((parseFloat(json1.markPrice) - plusEntry) / plusEntry) * 100 * x;
                return [2 /*return*/, long_1];
            }
            catch (err) {
                console.log(err);
            }
            return [2 /*return*/];
        });
    });
}
function getPercent(json1, json2, plusAmt, minusAmt, reve) {
    return __awaiter(this, void 0, void 0, function () {
        var amt_1, per;
        return __generator(this, function (_a) {
            try {
                if (plusAmt > minusAmt) {
                    amt_1 = plusAmt;
                }
                else {
                    amt_1 = minusAmt;
                }
                per = ((parseFloat(json1.unRealizedProfit) +
                    parseFloat(json2.unRealizedProfit)) /
                    (parseFloat(json1.markPrice) * amt_1)) *
                    100 *
                    reve;
                return [2 /*return*/, per];
            }
            catch (err) {
                console.log(err);
            }
            return [2 /*return*/];
        });
    });
}
function shortnum(x, minusEntry, json2) {
    return __awaiter(this, void 0, void 0, function () {
        var short_1;
        return __generator(this, function (_a) {
            try {
                short_1 = ((parseFloat(json2.markPrice) - minusEntry) / minusEntry) * -1 * 100 * x;
                return [2 /*return*/, short_1];
            }
            catch (err) {
                console.log(err);
            }
            return [2 /*return*/];
        });
    });
}
function cancleShortorder() {
    return __awaiter(this, void 0, void 0, function () {
        var openOrders, Orders, _i, Orders_1, Order, obj, err_28;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, binance.futuresOpenOrders()];
                case 1:
                    openOrders = _a.sent(), Orders = Object.keys(openOrders);
                    _i = 0, Orders_1 = Orders;
                    _a.label = 2;
                case 2:
                    if (!(_i < Orders_1.length)) return [3 /*break*/, 5];
                    Order = Orders_1[_i];
                    obj = openOrders[Order];
                    if (!(obj.positionSide == "SHORT")) return [3 /*break*/, 4];
                    return [4 /*yield*/, binance.futuresCancel(obj.symbol, { orderId: obj.orderId })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_28 = _a.sent();
                    console.log(err_28);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function cancleLongorder() {
    return __awaiter(this, void 0, void 0, function () {
        var openOrders, Orders, _i, Orders_2, Order, obj, err_29;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, binance.futuresOpenOrders()];
                case 1:
                    openOrders = _a.sent(), Orders = Object.keys(openOrders);
                    _i = 0, Orders_2 = Orders;
                    _a.label = 2;
                case 2:
                    if (!(_i < Orders_2.length)) return [3 /*break*/, 5];
                    Order = Orders_2[_i];
                    obj = openOrders[Order];
                    if (!(obj.positionSide == "LONG")) return [3 /*break*/, 4];
                    return [4 /*yield*/, binance.futuresCancel(obj.symbol, { orderId: obj.orderId })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_29 = _a.sent();
                    console.log(err_29);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function getplusAmt(json1) {
    return __awaiter(this, void 0, void 0, function () {
        var Amt;
        return __generator(this, function (_a) {
            try {
                Amt = parseFloat(json1.positionAmt);
                return [2 /*return*/, Amt];
            }
            catch (err) {
                console.log(err);
            }
            return [2 /*return*/];
        });
    });
}
function getminusAmt(json2) {
    return __awaiter(this, void 0, void 0, function () {
        var Amt;
        return __generator(this, function (_a) {
            try {
                Amt = parseFloat(json2.positionAmt) * -1;
                return [2 /*return*/, Amt];
            }
            catch (err) {
                console.log(err);
            }
            return [2 /*return*/];
        });
    });
}
function Leverage(x, y) {
    return __awaiter(this, void 0, void 0, function () {
        var err_30;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresLeverage(y, x)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_30 = _a.sent();
                    console.log(err_30);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getlongOrder() {
    return __awaiter(this, void 0, void 0, function () {
        var longOrder, openOrders, Orders, _i, Orders_3, Order, obj, err_31;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    longOrder = 1;
                    return [4 /*yield*/, binance.futuresOpenOrders()];
                case 1:
                    openOrders = _a.sent(), Orders = Object.keys(openOrders);
                    for (_i = 0, Orders_3 = Orders; _i < Orders_3.length; _i++) {
                        Order = Orders_3[_i];
                        obj = openOrders[Order];
                        if (obj.positionSide == "SHORT") {
                            return [2 /*return*/, longOrder];
                        }
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_31 = _a.sent();
                    console.log(err_31);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getshortOrder() {
    return __awaiter(this, void 0, void 0, function () {
        var shortOrder, openOrders, Orders, _i, Orders_4, Order, obj, err_32;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    shortOrder = 1;
                    return [4 /*yield*/, binance.futuresOpenOrders()];
                case 1:
                    openOrders = _a.sent(), Orders = Object.keys(openOrders);
                    for (_i = 0, Orders_4 = Orders; _i < Orders_4.length; _i++) {
                        Order = Orders_4[_i];
                        obj = openOrders[Order];
                        if (obj.positionSide == "LONG") {
                            return [2 /*return*/, shortOrder];
                        }
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_32 = _a.sent();
                    console.log(err_32);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getorderType(coinname) {
    return __awaiter(this, void 0, void 0, function () {
        var order, error_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresAllOrders(coinname)];
                case 1:
                    order = _a.sent();
                    if (order[order.length - 1].origType == "STOP_MARKET" &&
                        order[order.length - 1].status == "FILLED") {
                        return [2 /*return*/, 100];
                    }
                    else {
                        return [2 /*return*/, 200];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_13 = _a.sent();
                    return [2 /*return*/, 300];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getMinute(now) {
    return __awaiter(this, void 0, void 0, function () {
        var minutes;
        return __generator(this, function (_a) {
            try {
                minutes = now.getMinutes();
                return [2 /*return*/, minutes];
            }
            catch (error) {
                return [2 /*return*/, 1];
            }
            return [2 /*return*/];
        });
    });
}
function getSecond(now) {
    return __awaiter(this, void 0, void 0, function () {
        var seconds;
        return __generator(this, function (_a) {
            try {
                seconds = now.getSeconds();
                return [2 /*return*/, seconds];
            }
            catch (error) {
                return [2 /*return*/, 30];
            }
            return [2 /*return*/];
        });
    });
}
function getCandle(coinname, minute) {
    return __awaiter(this, void 0, void 0, function () {
        var candle, error_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresCandles(coinname, minute)];
                case 1:
                    candle = _a.sent();
                    return [2 /*return*/, candle];
                case 2:
                    error_14 = _a.sent();
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getStart(coinname, pos) {
    return __awaiter(this, void 0, void 0, function () {
        var candle3, error_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresCandles(coinname, "1m")];
                case 1:
                    candle3 = _a.sent();
                    if (pos == 1) {
                        // 롱 종료
                        if (candle3[candle3.length - 2][4] - candle3[candle3.length - 2][1] < 0 &&
                            candle3[candle3.length - 3][4] - candle3[candle3.length - 3][1] < 0) {
                            // if((candle3[candle3.length - 2][4]-candle3[candle3.length - 2][1])/candle3[candle3.length - 2][1] + (candle3[candle3.length - 3][4]-candle3[candle3.length - 3][1])/candle3[candle3.length - 3][1] < -1)
                            // {
                            //     return 2;
                            // }
                            return [2 /*return*/, 1];
                        }
                        return [2 /*return*/, 2];
                    }
                    else if (pos == 2) {
                        // 숏 종료
                        if (candle3[candle3.length - 2][4] - candle3[candle3.length - 2][1] > 0 &&
                            candle3[candle3.length - 3][4] - candle3[candle3.length - 3][1] > 0) {
                            // if((candle3[candle3.length - 2][4]-candle3[candle3.length - 2][1])/candle3[candle3.length - 2][1] + (candle3[candle3.length - 3][4]-candle3[candle3.length - 3][1])/candle3[candle3.length - 3][1] > 1)
                            // {
                            //     return 2;
                            // }
                            return [2 /*return*/, 1];
                        }
                        return [2 /*return*/, 2];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_15 = _a.sent();
                    return [2 /*return*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getRSI(coinname, minute) {
    return __awaiter(this, void 0, void 0, function () {
        var candleArr, diffArr, gain, loss, AU, AD, start, start2, candle, now, minutes, seconds, _a, _b, _c, _d, i, i, i, i, RS, RSI, error_16;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 16, , 17]);
                    candleArr = [];
                    diffArr = [];
                    gain = [];
                    loss = [];
                    AU = 0;
                    AD = 0;
                    start = 0;
                    start2 = 0;
                    candle = void 0;
                    now = new Date();
                    return [4 /*yield*/, getMinute(now)];
                case 1:
                    minutes = _e.sent();
                    return [4 /*yield*/, getSecond(now)];
                case 2:
                    seconds = _e.sent();
                    _a = candleArr;
                    _b = 0;
                    return [4 /*yield*/, GetPrices(coinname)];
                case 3:
                    _a[_b] = _e.sent();
                    return [4 /*yield*/, sleep(500)];
                case 4:
                    _e.sent();
                    _e.label = 5;
                case 5:
                    if (!(candleArr[0] == 100000)) return [3 /*break*/, 8];
                    _c = candleArr;
                    _d = 0;
                    return [4 /*yield*/, GetPrices(coinname)];
                case 6:
                    _c[_d] = _e.sent();
                    return [4 /*yield*/, sleep(500)];
                case 7:
                    _e.sent();
                    return [3 /*break*/, 5];
                case 8:
                    if (!(start == 0 && start2 == 0)) return [3 /*break*/, 15];
                    return [4 /*yield*/, getCandle(coinname, minute)];
                case 9:
                    candle = _e.sent();
                    return [4 /*yield*/, sleep(500)];
                case 10:
                    _e.sent();
                    _e.label = 11;
                case 11:
                    if (!(candle == 100)) return [3 /*break*/, 14];
                    return [4 /*yield*/, getCandle(coinname, minute)];
                case 12:
                    candle = _e.sent();
                    return [4 /*yield*/, sleep(500)];
                case 13:
                    _e.sent();
                    return [3 /*break*/, 11];
                case 14:
                    for (i = 0; i < 14; i++) {
                        candleArr[i + 1] = candle[candle.length - i - 1][1];
                    }
                    start = 1;
                    start2 = 1;
                    _e.label = 15;
                case 15:
                    if (minutes % 3 == 0 && seconds <= 10) {
                        start = 0;
                    }
                    if (minutes % 3 != 0) {
                        start2 = 0;
                    }
                    for (i = 0; i < 14; i++) {
                        diffArr[i] = candleArr[i] - candleArr[i + 1];
                    }
                    for (i = 0; i < 14; i++) {
                        if (diffArr[i] >= 0) {
                            gain[i] = diffArr[i];
                            loss[i] = 0;
                        }
                        else if (diffArr[i] < 0) {
                            gain[i] = 0;
                            loss[i] = diffArr[i];
                        }
                    }
                    for (i = 0; i < 14; i++) {
                        AU = AU + gain[i];
                        AD = AD + loss[i];
                    }
                    AU = AU / 14;
                    AD = AD / 14;
                    RS = (AU / AD) * -1;
                    RSI = 100 - 100 / (1 + RS);
                    return [2 /*return*/, RSI];
                case 16:
                    error_16 = _e.sent();
                    return [2 /*return*/, 100];
                case 17: return [2 /*return*/];
            }
        });
    });
}
function getRSI2(coinname, minute) {
    return __awaiter(this, void 0, void 0, function () {
        var candleArr, diffArr, gain, loss, AU, fAU, fAD, AD, start, start2, candle, now, minutes, seconds, i, i, i, i, i, RS, RSI, error_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 10, , 11]);
                    candleArr = [];
                    diffArr = [];
                    gain = [];
                    loss = [];
                    AU = 0;
                    fAU = 0;
                    fAD = 0;
                    AD = 0;
                    start = 0;
                    start2 = 0;
                    candle = void 0;
                    now = new Date();
                    return [4 /*yield*/, getMinute(now)];
                case 1:
                    minutes = _a.sent();
                    return [4 /*yield*/, getSecond(now)];
                case 2:
                    seconds = _a.sent();
                    //candleArr[0] = await GetPrices(coinname);
                    return [4 /*yield*/, sleep(1000)];
                case 3:
                    //candleArr[0] = await GetPrices(coinname);
                    _a.sent();
                    return [4 /*yield*/, getCandle(coinname, minute)];
                case 4:
                    // while(candleArr[0] == 100000)
                    // {
                    //     candleArr[0] = await GetPrices(coinname);
                    //     await sleep(500);
                    // }
                    candle = _a.sent();
                    return [4 /*yield*/, sleep(500)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    if (!(candle == 100)) return [3 /*break*/, 9];
                    return [4 /*yield*/, getCandle(coinname, minute)];
                case 7:
                    candle = _a.sent();
                    return [4 /*yield*/, sleep(500)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 9:
                    for (i = 0; i < 28; i++) {
                        candleArr[i] = candle[candle.length - i - 5][4];
                    }
                    for (i = 0; i < 27; i++) {
                        diffArr[i] = candleArr[i] - candleArr[i + 1];
                    }
                    for (i = 0; i < 27; i++) {
                        if (diffArr[i] >= 0) {
                            gain[i] = diffArr[i];
                            loss[i] = 0;
                        }
                        else if (diffArr[i] < 0) {
                            gain[i] = 0;
                            loss[i] = diffArr[i];
                        }
                    }
                    for (i = 13; i < 27; i++) {
                        AU = AU + gain[i];
                        AD = AD + loss[i];
                    }
                    AU = AU / 14;
                    AD = AD / 14;
                    for (i = 12; i >= 0; i--) {
                        AU = (AU * 13 + gain[i]) / 14;
                        AD = (AD * 13 + loss[i]) / 14;
                    }
                    RS = (AU / AD) * -1;
                    RSI = 100 - 100 / (1 + RS);
                    return [2 /*return*/, RSI];
                case 10:
                    error_17 = _a.sent();
                    console.log(error_17);
                    return [2 /*return*/, 100];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function getRSI3(coinname, minute) {
    return __awaiter(this, void 0, void 0, function () {
        var candleArr, diffArr, gain, loss, AU, fAU, fAD, AD, start, start2, candle, now, minutes, seconds, _a, _b, _c, _d, i, i, i, i, i, RS, RSI, error_18;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 16, , 17]);
                    candleArr = [];
                    diffArr = [];
                    gain = [];
                    loss = [];
                    AU = 0;
                    fAU = 0;
                    fAD = 0;
                    AD = 0;
                    start = 0;
                    start2 = 0;
                    candle = void 0;
                    now = new Date();
                    return [4 /*yield*/, getMinute(now)];
                case 1:
                    minutes = _e.sent();
                    return [4 /*yield*/, getSecond(now)];
                case 2:
                    seconds = _e.sent();
                    _a = candleArr;
                    _b = 0;
                    return [4 /*yield*/, GetPrices(coinname)];
                case 3:
                    _a[_b] = _e.sent();
                    return [4 /*yield*/, sleep(1000)];
                case 4:
                    _e.sent();
                    _e.label = 5;
                case 5:
                    if (!(candleArr[0] == 100000)) return [3 /*break*/, 8];
                    _c = candleArr;
                    _d = 0;
                    return [4 /*yield*/, GetPrices(coinname)];
                case 6:
                    _c[_d] = _e.sent();
                    return [4 /*yield*/, sleep(500)];
                case 7:
                    _e.sent();
                    return [3 /*break*/, 5];
                case 8:
                    if (!(start == 0 && start2 == 0)) return [3 /*break*/, 15];
                    return [4 /*yield*/, getCandle(coinname, minute)];
                case 9:
                    candle = _e.sent();
                    return [4 /*yield*/, sleep(500)];
                case 10:
                    _e.sent();
                    _e.label = 11;
                case 11:
                    if (!(candle == 100)) return [3 /*break*/, 14];
                    return [4 /*yield*/, getCandle(coinname, minute)];
                case 12:
                    candle = _e.sent();
                    return [4 /*yield*/, sleep(500)];
                case 13:
                    _e.sent();
                    return [3 /*break*/, 11];
                case 14:
                    for (i = 0; i < 27; i++) {
                        candleArr[i + 1] = candle[candle.length - i - 1][4];
                    }
                    start = 1;
                    start2 = 1;
                    _e.label = 15;
                case 15:
                    if (minutes % 3 == 0 && seconds <= 10) {
                        start = 0;
                    }
                    if (minutes % 3 != 0) {
                        start2 = 0;
                    }
                    for (i = 0; i < 27; i++) {
                        diffArr[i] = candleArr[i] - candleArr[i + 1];
                    }
                    for (i = 0; i < 27; i++) {
                        if (diffArr[i] >= 0) {
                            gain[i] = diffArr[i];
                            loss[i] = 0;
                        }
                        else if (diffArr[i] < 0) {
                            gain[i] = 0;
                            loss[i] = diffArr[i];
                        }
                    }
                    for (i = 13; i < 27; i++) {
                        AU = AU + gain[i];
                        AD = AD + loss[i];
                    }
                    AU = AU / 14;
                    AD = AD / 14;
                    for (i = 12; i >= 0; i--) {
                        AU = (AU * 13 + gain[i]) / 14;
                        AD = (AD * 13 + loss[i]) / 14;
                    }
                    RS = (AU / AD) * -1;
                    RSI = 100 - 100 / (1 + RS);
                    return [2 /*return*/, RSI];
                case 16:
                    error_18 = _e.sent();
                    return [2 /*return*/, 100];
                case 17: return [2 /*return*/];
            }
        });
    });
}
//async function getCandles(coinname, RSI3m, RSI15m)
function getCandles(coinname, RSI15m) {
    return __awaiter(this, void 0, void 0, function () {
        var low, high, close_1, per, candle2, candle2, error_19;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    low = void 0;
                    high = void 0;
                    per = void 0;
                    if (!(RSI15m <= 35 && RSI15m >= 20 && RSI15m != 100)) return [3 /*break*/, 2];
                    return [4 /*yield*/, binance.futuresCandles(coinname, "15m")];
                case 1:
                    candle2 = _a.sent();
                    low = candle2[candle2.length - 2][3];
                    close_1 = candle2[candle2.length - 2][4];
                    per = (close_1 - low) / low;
                    if (per <= tail) {
                        //console.log("꼬리 잡힘");
                        return [2 /*return*/, 200];
                    }
                    else {
                        return [2 /*return*/, 400];
                    }
                    return [3 /*break*/, 4];
                case 2:
                    if (!(RSI15m >= 65 && RSI15m <= 80 && RSI15m != 100)) return [3 /*break*/, 4];
                    return [4 /*yield*/, binance.futuresCandles(coinname, "15m")];
                case 3:
                    candle2 = _a.sent();
                    high = candle2[candle2.length - 2][2];
                    close_1 = candle2[candle2.length - 2][4];
                    per = (high - close_1) / high;
                    if (per <= tail) {
                        //console.log("꼬리 잡힘");
                        return [2 /*return*/, 100];
                    }
                    else {
                        return [2 /*return*/, 400];
                    }
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_19 = _a.sent();
                    return [2 /*return*/, 300];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function OneMinuteLongShort(coinname) {
    return __awaiter(this, void 0, void 0, function () {
        var volume, error_20;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, binance.futuresCandles(coinname, "1m")];
                case 1:
                    volume = _a.sent();
                    if (parseFloat(volume[volume.length - 1][4]) -
                        parseFloat(volume[volume.length - 1][1]) >
                        0) {
                        return [2 /*return*/, 2];
                    }
                    else if (parseFloat(volume[volume.length - 1][4]) -
                        parseFloat(volume[volume.length - 1][1]) <
                        0) {
                        return [2 /*return*/, 1];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_20 = _a.sent();
                    return [2 /*return*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getVolume(coinname) {
    return __awaiter(this, void 0, void 0, function () {
        var volume, sum, i, avg, now, time, error_21;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, sleep(2000)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, binance.futuresCandles(coinname, "15m")];
                case 2:
                    volume = _a.sent();
                    sum = 0;
                    for (i = 1; i < 15; ++i) {
                        sum += parseFloat(volume[volume.length - i - 1][7]);
                    }
                    avg = sum / 14;
                    if (!(parseFloat(volume[volume.length - 1][7]) / avg > 2.5)) return [3 /*break*/, 4];
                    if (volume[volume.length - 1][4] > volume[volume.length - 1][1]) {
                        console.log(coinname);
                        console.log("숏 종료");
                    }
                    else {
                        console.log(coinname);
                        console.log("롱 종료");
                    }
                    now = new Date();
                    time = now.toLocaleString();
                    console.log(time);
                    return [4 /*yield*/, sleep(900000)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4: return [2 /*return*/, 2000];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_21 = _a.sent();
                    return [2 /*return*/, 3000];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function getUpdown(coinname, upDown) {
    return __awaiter(this, void 0, void 0, function () {
        var volume, volume, error_22;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 10, , 11]);
                    if (!(upDown == 2)) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 4];
                    return [4 /*yield*/, sleep(1000)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, binance.futuresCandles(coinname, "15m")];
                case 3:
                    volume = _a.sent();
                    if (parseFloat(volume[volume.length - 2][4]) -
                        parseFloat(volume[volume.length - 2][1]) <
                        0) {
                        console.log(parseFloat(volume[volume.length - 2][4]) -
                            parseFloat(volume[volume.length - 2][1]));
                        return [2 /*return*/, 20];
                    }
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 9];
                case 5:
                    if (!(upDown == 1)) return [3 /*break*/, 9];
                    _a.label = 6;
                case 6:
                    if (!true) return [3 /*break*/, 9];
                    return [4 /*yield*/, sleep(1000)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, binance.futuresCandles(coinname, "15m")];
                case 8:
                    volume = _a.sent();
                    if (parseFloat(volume[volume.length - 2][4]) -
                        parseFloat(volume[volume.length - 2][1]) >
                        0) {
                        console.log(parseFloat(volume[volume.length - 2][4]) -
                            parseFloat(volume[volume.length - 2][1]));
                        return [2 /*return*/, 10];
                    }
                    return [3 /*break*/, 6];
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_22 = _a.sent();
                    return [2 /*return*/, 30];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function getCompare(coinname, upDown) {
    return __awaiter(this, void 0, void 0, function () {
        var volume, up, down, i, error_23;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, sleep(3000)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, binance.futuresCandles(coinname, "15m")];
                case 2:
                    volume = _a.sent();
                    up = 0;
                    down = 0;
                    //volume : 7 open : 1 close : 4
                    for (i = 0; i < 3; i++) {
                        if (parseFloat(volume[volume.length + i - 4][4]) -
                            parseFloat(volume[volume.length + i - 4][1]) >
                            0) {
                            if (upDown == 2 &&
                                (parseFloat(volume[volume.length + i - 4][2]) -
                                    parseFloat(volume[volume.length + i - 4][4])) /
                                    parseFloat(volume[volume.length + i - 4][2]) >
                                    tail) {
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
                        }
                        else if (parseFloat(volume[volume.length + i - 4][4]) -
                            parseFloat(volume[volume.length + i - 4][1]) <
                            0) {
                            // if (i == 0 && upDown == 2 && (parseFloat(volume[volume.length + i - 4][2])-parseFloat(volume[volume.length + i - 4][4]))
                            // / parseFloat(volume[volume.length + i - 4][2]) > tail)
                            // {
                            //     down += 0;
                            // }
                            if (upDown == 1 &&
                                (parseFloat(volume[volume.length + i - 4][4]) -
                                    parseFloat(volume[volume.length + i - 4][3])) /
                                    parseFloat(volume[volume.length + i - 4][3]) >
                                    tail) {
                                down += 0;
                            }
                            else {
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
                        return [2 /*return*/, 2];
                    }
                    else if (down == 0) {
                        //rsi가 낮았는데 계속 오르는 추세 그러면 바로 롱으로
                        //console.log(2, up, down);
                        return [2 /*return*/, 1];
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
                        return [2 /*return*/, 1]; //숏 종료
                    }
                    else if (up < down && up != 0) {
                        //console.log(6, up, down);
                        return [2 /*return*/, 2]; //롱 종료
                    }
                    else if (up == 0 && down == 0) {
                        //console.log(7, up, down);
                        return [2 /*return*/, 5];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_23 = _a.sent();
                    return [2 /*return*/, 3];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function GetRandom() {
    return __awaiter(this, void 0, void 0, function () {
        var num;
        return __generator(this, function (_a) {
            try {
                num = Math.random();
                if (num > 0.5) {
                    return [2 /*return*/, 1];
                }
                else {
                    return [2 /*return*/, 2];
                }
            }
            catch (_b) {
                return [2 /*return*/, 3];
            }
            return [2 /*return*/];
        });
    });
}
function compareCanldes(coinname) {
    return __awaiter(this, void 0, void 0, function () {
        var volume, avg, i, error_24;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, binance.futuresCandles(coinname, "1m")];
                case 1:
                    volume = _a.sent();
                    avg = 0;
                    for (i = 0; i < 14; i++) {
                        avg += parseFloat(volume[volume.length - 2 - i][7]);
                    }
                    avg = avg / 14;
                    if ((parseFloat(volume[volume.length - 2][7]) / avg) * 100 >= 200) {
                        if (volume[volume.length - 2][4] > volume[volume.length - 2][1]) {
                            return [2 /*return*/, 2];
                        }
                        else {
                            return [2 /*return*/, 1];
                        }
                    }
                    return [4 /*yield*/, sleep(1000)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, 4];
                case 3:
                    error_24 = _a.sent();
                    return [2 /*return*/, 3];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function showMoney() {
    return __awaiter(this, void 0, void 0, function () {
        var secondreaBlalance_1, inputtt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 8];
                    return [4 /*yield*/, GetBalances()];
                case 1:
                    secondreaBlalance_1 = _a.sent();
                    return [4 /*yield*/, inputMoney(client, secondreaBlalance_1)];
                case 2:
                    inputtt = _a.sent();
                    _a.label = 3;
                case 3:
                    if (!(inputtt == 100)) return [3 /*break*/, 6];
                    return [4 /*yield*/, sleep(1000)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, inputMoney(client, secondreaBlalance_1)];
                case 5:
                    inputtt = _a.sent();
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, sleep(60000)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 0];
                case 8: return [2 /*return*/];
            }
        });
    });
}
var firstFailure = 0;
var secondFailure = 0;
var longSuccess = 0;
var shortSuccess = 0;
var firstEmpty = 0;
var secondeEmpty = 0;
var positionDir = "NONE";
function final(longFail, shortFail, ch) {
    return __awaiter(this, void 0, void 0, function () {
        var longSwitch, shortSwitch, switchS, longFailure, shortFailure, shoot, firstBalance, longAmt, shortAmt, longEntryPrice, plusAmt, longStopPrice, longLimitPrice, longBadPrice, longMoreBadPrice, shortEntryPrice, minusAmt, shortStopPrice, shortLimitPrice, shortBadPrice, shortMoreBadPrice, stopLongSell, stopShortBuy, limitLongSell, limitShortBuy, markPrice, error_25;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    longSwitch = false;
                    shortSwitch = false;
                    switchS = false;
                    return [4 /*yield*/, GetRandom()];
                case 1:
                    shoot = _a.sent();
                    if ((longFail * 1 > 0 || shortFail * 1 > 0) && ch) {
                        longFailure = longFail * 1;
                        shortFailure = shortFail * 1;
                    }
                    if (positionDir == "NONE" && shoot == 1) {
                        longFailure = longFail * 1;
                        shortFailure = shortFail * 1;
                    }
                    else if (positionDir == "NONE" && shoot == 2) {
                        longFailure = shortFail * 1;
                        shortFailure = longFail * 1;
                    }
                    else if (positionDir == "LONG") {
                        if (longFail >= shortFail) {
                            longFailure = longFail * 1;
                            shortFailure = shortFail * 1;
                        }
                        else {
                            longFailure = shortFail * 1;
                            shortFailure = longFail * 1;
                        }
                    }
                    else if (positionDir == "SHORT") {
                        if (longFail >= shortFail) {
                            longFailure = shortFail * 1;
                            shortFailure = longFail * 1;
                        }
                        else {
                            longFailure = longFail * 1;
                            shortFailure = shortFail * 1;
                        }
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 99, , 100]);
                    return [4 /*yield*/, GetBalances()];
                case 3:
                    firstBalance = _a.sent();
                    if (isNaN(firstBalance)) {
                        console.log("UTCK 켜세요");
                        return [2 /*return*/];
                    }
                    reve = 50;
                    return [4 /*yield*/, binance.useServerTime()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, Leverage(reve, coinName)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, sleep(1000)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, GetPrices(coinName)];
                case 7:
                    coinPrices = _a.sent();
                    _a.label = 8;
                case 8:
                    if (!(coinPrices == 100000)) return [3 /*break*/, 11];
                    return [4 /*yield*/, sleep(1000)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, GetPrices(coinName)];
                case 10:
                    coinPrices = _a.sent();
                    return [3 /*break*/, 8];
                case 11:
                    longAmt = ((secondreaBlalance / 6700 / coinPrices) *
                        reve *
                        Math.pow(2, longFailure)).toFixed(bbfix);
                    shortAmt = ((secondreaBlalance / 6700 / coinPrices) *
                        reve *
                        Math.pow(2, shortFailure)).toFixed(bbfix);
                    console.log(longAmt);
                    return [4 /*yield*/, FuturesLongBuy(longAmt, coinName)];
                case 12:
                    long = _a.sent();
                    _a.label = 13;
                case 13:
                    if (!(long == 1000)) return [3 /*break*/, 16];
                    return [4 /*yield*/, sleep(1000)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, FuturesLongBuy(longAmt, coinName)];
                case 15:
                    long = _a.sent();
                    if (long == 2000) {
                        return [3 /*break*/, 16];
                    }
                    return [3 /*break*/, 13];
                case 16: return [4 /*yield*/, FuturesShortSell(shortAmt, coinName)];
                case 17:
                    short = _a.sent();
                    _a.label = 18;
                case 18:
                    if (!(short == 1000)) return [3 /*break*/, 21];
                    return [4 /*yield*/, sleep(1000)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, FuturesShortSell(shortAmt, coinName)];
                case 20:
                    short = _a.sent();
                    if (short == 2000) {
                        return [3 /*break*/, 21];
                    }
                    return [3 /*break*/, 18];
                case 21: return [4 /*yield*/, sleep(3000)];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, plusBalance(coinName)];
                case 23:
                    json1 = _a.sent();
                    _a.label = 24;
                case 24:
                    if (!(json1.errornum == 1)) return [3 /*break*/, 27];
                    return [4 /*yield*/, sleep(1000)];
                case 25:
                    _a.sent();
                    return [4 /*yield*/, plusBalance(coinName)];
                case 26:
                    json1 = _a.sent();
                    return [3 /*break*/, 24];
                case 27:
                    longEntryPrice = parseFloat(json1.entryPrice);
                    return [4 /*yield*/, getplusAmt(json1)];
                case 28:
                    plusAmt = _a.sent();
                    longStopPrice = (longEntryPrice *
                        (0.996 - longFailure * 0.0005)).toFixed(fix);
                    longLimitPrice = (longEntryPrice *
                        (1.005 + longFailure * 0.0005)).toFixed(fix);
                    return [4 /*yield*/, minusBalance(coinName)];
                case 29:
                    json2 = _a.sent();
                    _a.label = 30;
                case 30:
                    if (!(json2.errornum == 1)) return [3 /*break*/, 33];
                    return [4 /*yield*/, sleep(1000)];
                case 31:
                    _a.sent();
                    return [4 /*yield*/, minusBalance(coinName)];
                case 32:
                    json2 = _a.sent();
                    return [3 /*break*/, 30];
                case 33:
                    longBadPrice = longEntryPrice * (1.006 + longFailure * 0.0005);
                    longMoreBadPrice = longEntryPrice * (0.995 - longFailure * 0.0005);
                    shortEntryPrice = parseFloat(json2.entryPrice);
                    return [4 /*yield*/, getminusAmt(json2)];
                case 34:
                    minusAmt = _a.sent();
                    shortStopPrice = (shortEntryPrice *
                        (1.004 + shortFailure * 0.0005)).toFixed(fix);
                    shortLimitPrice = (shortEntryPrice *
                        (0.995 - shortFailure * 0.0005)).toFixed(fix);
                    shortBadPrice = shortEntryPrice * (0.994 - shortFailure * 0.0005);
                    shortMoreBadPrice = shortEntryPrice * (1.005 + shortFailure * 0.0005);
                    return [4 /*yield*/, FuturesstopLongSell(plusAmt, coinName, longStopPrice)];
                case 35:
                    stopLongSell = _a.sent();
                    _a.label = 36;
                case 36:
                    if (!(stopLongSell == 1000)) return [3 /*break*/, 41];
                    return [4 /*yield*/, cancleOrder(coinName)];
                case 37:
                    _a.sent();
                    return [4 /*yield*/, sleep(300000)];
                case 38:
                    _a.sent();
                    return [2 /*return*/];
                case 39:
                    _a.sent();
                    return [4 /*yield*/, FuturesstopLongSell(plusAmt, coinName, longStopPrice)];
                case 40:
                    stopLongSell = stopLongSell = _a.sent();
                    if (stopLongSell == 2000) {
                        return [3 /*break*/, 41];
                    }
                    return [3 /*break*/, 36];
                case 41: return [4 /*yield*/, FuturesstopShortBuy(minusAmt, coinName, shortStopPrice)];
                case 42:
                    stopShortBuy = _a.sent();
                    _a.label = 43;
                case 43:
                    if (!(stopShortBuy == 1000)) return [3 /*break*/, 48];
                    return [4 /*yield*/, cancleOrder(coinName)];
                case 44:
                    _a.sent();
                    return [4 /*yield*/, sleep(300000)];
                case 45:
                    _a.sent();
                    return [2 /*return*/];
                case 46:
                    _a.sent();
                    return [4 /*yield*/, FuturesstopShortBuy(minusAmt, coinName, shortStopPrice)];
                case 47:
                    stopShortBuy = _a.sent();
                    if (stopShortBuy == 2000) {
                        return [3 /*break*/, 48];
                    }
                    return [3 /*break*/, 43];
                case 48: return [4 /*yield*/, FutureslimitLongSell(plusAmt, coinName, longLimitPrice)];
                case 49:
                    limitLongSell = _a.sent();
                    _a.label = 50;
                case 50:
                    if (!(limitLongSell == 1000)) return [3 /*break*/, 55];
                    return [4 /*yield*/, cancleOrder(coinName)];
                case 51:
                    _a.sent();
                    return [4 /*yield*/, sleep(300000)];
                case 52:
                    _a.sent();
                    return [2 /*return*/];
                case 53:
                    _a.sent();
                    return [4 /*yield*/, FutureslimitLongSell(plusAmt, coinName, longLimitPrice)];
                case 54:
                    limitLongSell = _a.sent();
                    if (limitLongSell == 2000) {
                        return [3 /*break*/, 55];
                    }
                    return [3 /*break*/, 50];
                case 55: return [4 /*yield*/, FutureslimitShortBuy(shortAmt, coinName, shortLimitPrice)];
                case 56:
                    limitShortBuy = _a.sent();
                    _a.label = 57;
                case 57:
                    if (!(limitShortBuy == 1000)) return [3 /*break*/, 62];
                    return [4 /*yield*/, cancleOrder(coinName)];
                case 58:
                    _a.sent();
                    return [4 /*yield*/, sleep(300000)];
                case 59:
                    _a.sent();
                    return [2 /*return*/];
                case 60:
                    _a.sent();
                    return [4 /*yield*/, FutureslimitShortBuy(shortAmt, coinName, shortLimitPrice)];
                case 61:
                    limitShortBuy = _a.sent();
                    if (limitShortBuy == 2000) {
                        return [3 /*break*/, 62];
                    }
                    return [3 /*break*/, 57];
                case 62:
                    if (!true) return [3 /*break*/, 98];
                    return [4 /*yield*/, plusBalance(coinName)];
                case 63:
                    json1 = _a.sent();
                    _a.label = 64;
                case 64:
                    if (!(json1.errornum == 1)) return [3 /*break*/, 67];
                    return [4 /*yield*/, sleep(1000)];
                case 65:
                    _a.sent();
                    return [4 /*yield*/, plusBalance(coinName)];
                case 66:
                    json1 = _a.sent();
                    return [3 /*break*/, 64];
                case 67: return [4 /*yield*/, minusBalance(coinName)];
                case 68:
                    json2 = _a.sent();
                    _a.label = 69;
                case 69:
                    if (!(json2.errornum == 1)) return [3 /*break*/, 72];
                    return [4 /*yield*/, sleep(1000)];
                case 70:
                    _a.sent();
                    return [4 /*yield*/, minusBalance(coinName)];
                case 71:
                    json2 = _a.sent();
                    return [3 /*break*/, 69];
                case 72: return [4 /*yield*/, getplusAmt(json1)];
                case 73:
                    plusAmt = _a.sent();
                    return [4 /*yield*/, getminusAmt(json2)];
                case 74:
                    minusAmt = _a.sent();
                    markPrice = parseFloat(json1.markPrice);
                    if (!(markPrice >= longBadPrice && plusAmt != 0)) return [3 /*break*/, 79];
                    return [4 /*yield*/, FuturesLongSell(plusAmt, coinName)];
                case 75:
                    long = _a.sent();
                    _a.label = 76;
                case 76:
                    if (!(long == 1000)) return [3 /*break*/, 79];
                    return [4 /*yield*/, sleep(1000)];
                case 77:
                    _a.sent();
                    return [4 /*yield*/, FuturesLongSell(plusAmt, coinName)];
                case 78:
                    long = _a.sent();
                    if (long == 2000) {
                        return [3 /*break*/, 79];
                    }
                    return [3 /*break*/, 76];
                case 79:
                    if (!(markPrice <= longMoreBadPrice && plusAmt != 0)) return [3 /*break*/, 84];
                    return [4 /*yield*/, FuturesLongSell(plusAmt, coinName)];
                case 80:
                    long = _a.sent();
                    _a.label = 81;
                case 81:
                    if (!(long == 1000)) return [3 /*break*/, 84];
                    return [4 /*yield*/, sleep(1000)];
                case 82:
                    _a.sent();
                    return [4 /*yield*/, FuturesLongSell(plusAmt, coinName)];
                case 83:
                    long = _a.sent();
                    if (long == 2000) {
                        return [3 /*break*/, 84];
                    }
                    return [3 /*break*/, 81];
                case 84:
                    if (!(markPrice <= shortBadPrice && minusAmt != 0)) return [3 /*break*/, 89];
                    return [4 /*yield*/, FuturesShortBuy(minusAmt, coinName)];
                case 85:
                    short = _a.sent();
                    _a.label = 86;
                case 86:
                    if (!(short == 1000)) return [3 /*break*/, 89];
                    return [4 /*yield*/, sleep(1000)];
                case 87:
                    _a.sent();
                    return [4 /*yield*/, FuturesShortBuy(minusAmt, coinName)];
                case 88:
                    short = _a.sent();
                    if (short == 2000) {
                        return [3 /*break*/, 89];
                    }
                    return [3 /*break*/, 86];
                case 89:
                    if (!(markPrice >= shortMoreBadPrice && minusAmt != 0)) return [3 /*break*/, 94];
                    return [4 /*yield*/, FuturesShortBuy(minusAmt, coinName)];
                case 90:
                    short = _a.sent();
                    _a.label = 91;
                case 91:
                    if (!(short == 1000)) return [3 /*break*/, 94];
                    return [4 /*yield*/, sleep(1000)];
                case 92:
                    _a.sent();
                    return [4 /*yield*/, FuturesShortBuy(minusAmt, coinName)];
                case 93:
                    short = _a.sent();
                    if (short == 2000) {
                        return [3 /*break*/, 94];
                    }
                    return [3 /*break*/, 91];
                case 94:
                    if (plusAmt == 0 && longSwitch == false) {
                        if (longEntryPrice >= markPrice) {
                            longFailure++;
                            positionDir = "SHORT";
                        }
                        else if (markPrice >= longEntryPrice) {
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
                        }
                        else if (markPrice <= shortEntryPrice) {
                            shortFailure = 0;
                            shortSuccess++;
                            positionDir = "SHORT";
                        }
                        shortSwitch = true;
                    }
                    if (!(shortSwitch && longSwitch)) return [3 /*break*/, 96];
                    return [4 /*yield*/, cancleOrder(coinName)];
                case 95:
                    _a.sent();
                    if (longFailure >= shortFailure) {
                        firstFailure = longFailure;
                        secondFailure = shortFailure;
                    }
                    else if (shortFailure >= longFailure) {
                        firstFailure = shortFailure;
                        secondFailure = longFailure;
                    }
                    console.log("1번 실패 :", firstFailure);
                    console.log("1번 성공 :", longSuccess);
                    console.log("2번 실패 :", secondFailure);
                    console.log("2번 성공 :", shortSuccess);
                    console.log(firstEmpty, secondeEmpty);
                    return [2 /*return*/];
                case 96: 
                // console.log(
                //   "롱 :",
                //   markPrice - longEntryPrice,
                //   "숏 :",
                //   shortEntryPrice - markPrice
                // );
                return [4 /*yield*/, sleep(150)];
                case 97:
                    // console.log(
                    //   "롱 :",
                    //   markPrice - longEntryPrice,
                    //   "숏 :",
                    //   shortEntryPrice - markPrice
                    // );
                    _a.sent();
                    return [3 /*break*/, 62];
                case 98: return [3 /*break*/, 100];
                case 99:
                    error_25 = _a.sent();
                    console.log(error_25);
                    return [3 /*break*/, 100];
                case 100: return [2 /*return*/];
            }
        });
    });
}
var secondreaBlalance;
var coinName;
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
function home(coin) {
    return __awaiter(this, void 0, void 0, function () {
        var FFM, SFM, select, num, start, manager, sorted, sorted, sorted, secondreaBlalance2, stopAll, stop_1, input_1, stop_2, input_2, stop_3, input_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    FFM = 0;
                    SFM = 0;
                    select = coin * 1;
                    start = true;
                    return [4 /*yield*/, GetBalances()];
                case 1:
                    secondreaBlalance = _a.sent();
                    if (isNaN(secondreaBlalance)) {
                        return [2 /*return*/];
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
                    }
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 55];
                    return [4 /*yield*/, getManager2(client, num + 3)];
                case 3:
                    manager = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(manager == 100)) return [3 /*break*/, 7];
                    return [4 /*yield*/, sleep(1000)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, getManager2(client, num + 3)];
                case 6:
                    manager = _a.sent();
                    return [3 /*break*/, 4];
                case 7:
                    if (start) {
                        sorted = [parseInt(manager[0]), parseInt(manager[1])].sort();
                        FFM = sorted[1];
                        SFM = sorted[0];
                        longSuccess = parseInt(manager[2]);
                        shortSuccess = parseInt(manager[3]);
                        inputManagerFFM(client, num);
                        start = false;
                    }
                    if (manager[4] == "1" && FFM <= 1 && SFM <= 1) {
                        sorted = [parseInt(manager[0]), parseInt(manager[1])].sort();
                        FFM = sorted[1];
                        SFM = sorted[0];
                        longSuccess = parseInt(manager[2]);
                        shortSuccess = parseInt(manager[3]);
                        inputManagerFFM(client, num);
                    }
                    else {
                        sorted = [FFM, SFM].sort();
                        FFM = sorted[1];
                        SFM = sorted[0];
                    }
                    console.log(FFM, SFM);
                    return [4 /*yield*/, inputManager(client, coinName, num, FFM, SFM, longSuccess, shortSuccess)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, GetBalances()];
                case 9:
                    secondreaBlalance2 = _a.sent();
                    if (secondreaBlalance2 > secondreaBlalance) {
                        secondreaBlalance = secondreaBlalance2;
                    }
                    return [4 /*yield*/, getManagerStop(client)];
                case 10:
                    stopAll = _a.sent();
                    _a.label = 11;
                case 11:
                    if (!(stopAll == 100)) return [3 /*break*/, 14];
                    return [4 /*yield*/, sleep(1000)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, getManagerStop(client)];
                case 13:
                    stopAll = _a.sent();
                    return [3 /*break*/, 11];
                case 14:
                    if (!(FFM >= 8)) return [3 /*break*/, 26];
                    return [4 /*yield*/, getManager(client)];
                case 15:
                    stop_1 = _a.sent();
                    _a.label = 16;
                case 16:
                    if (!(stop_1 == 100)) return [3 /*break*/, 19];
                    return [4 /*yield*/, sleep(1000)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, getManager(client)];
                case 18:
                    stop_1 = _a.sent();
                    return [3 /*break*/, 16];
                case 19:
                    if (!(stop_1 != num && stop_1 != 0)) return [3 /*break*/, 21];
                    return [4 /*yield*/, sleep(60000)];
                case 20:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 21:
                    if (!(stop_1 == 0)) return [3 /*break*/, 26];
                    return [4 /*yield*/, inputManagerFail(client, num)];
                case 22:
                    input_1 = _a.sent();
                    _a.label = 23;
                case 23:
                    if (!(input_1 == 100)) return [3 /*break*/, 26];
                    return [4 /*yield*/, sleep(1000)];
                case 24:
                    _a.sent();
                    return [4 /*yield*/, inputManagerFail(client, num)];
                case 25:
                    input_1 = _a.sent();
                    return [3 /*break*/, 23];
                case 26:
                    if (!(stopAll == 1)) return [3 /*break*/, 43];
                    if (!(SFM != 0 && FFM != 1)) return [3 /*break*/, 28];
                    return [4 /*yield*/, final(FFM, SFM, false)];
                case 27:
                    _a.sent();
                    FFM = firstFailure;
                    SFM = secondFailure;
                    return [3 /*break*/, 42];
                case 28:
                    if (!(SFM == 0 && FFM != 1)) return [3 /*break*/, 30];
                    return [4 /*yield*/, final(FFM, 0, false)];
                case 29:
                    _a.sent();
                    FFM = firstFailure;
                    SFM = secondFailure;
                    return [3 /*break*/, 42];
                case 30:
                    if (!(FFM == 1)) return [3 /*break*/, 42];
                    return [4 /*yield*/, cancleOrder(coinName)];
                case 31:
                    _a.sent();
                    return [4 /*yield*/, getManager(client)];
                case 32:
                    stop_2 = _a.sent();
                    _a.label = 33;
                case 33:
                    if (!(stop_2 == 100)) return [3 /*break*/, 36];
                    return [4 /*yield*/, sleep(1000)];
                case 34:
                    _a.sent();
                    return [4 /*yield*/, getManager(client)];
                case 35:
                    stop_2 = _a.sent();
                    return [3 /*break*/, 33];
                case 36:
                    if (!(stop_2 == num)) return [3 /*break*/, 41];
                    return [4 /*yield*/, inputManagerFail(client, 0)];
                case 37:
                    input_2 = _a.sent();
                    _a.label = 38;
                case 38:
                    if (!(input_2 == 100)) return [3 /*break*/, 41];
                    return [4 /*yield*/, sleep(1000)];
                case 39:
                    _a.sent();
                    return [4 /*yield*/, inputManagerFail(client, 0)];
                case 40:
                    input_2 = _a.sent();
                    return [3 /*break*/, 38];
                case 41: return [2 /*return*/];
                case 42: return [3 /*break*/, 54];
                case 43: return [4 /*yield*/, final(FFM, SFM, false)];
                case 44:
                    _a.sent();
                    FFM = firstFailure;
                    SFM = secondFailure;
                    return [4 /*yield*/, getManager(client)];
                case 45:
                    stop_3 = _a.sent();
                    _a.label = 46;
                case 46:
                    if (!(stop_3 == 100)) return [3 /*break*/, 49];
                    return [4 /*yield*/, sleep(1000)];
                case 47:
                    _a.sent();
                    return [4 /*yield*/, getManager(client)];
                case 48:
                    stop_3 = _a.sent();
                    return [3 /*break*/, 46];
                case 49:
                    if (!(stop_3 == num && FFM < 5)) return [3 /*break*/, 54];
                    return [4 /*yield*/, inputManagerFail(client, 0)];
                case 50:
                    input_3 = _a.sent();
                    _a.label = 51;
                case 51:
                    if (!(input_3 == 100)) return [3 /*break*/, 54];
                    return [4 /*yield*/, sleep(1000)];
                case 52:
                    _a.sent();
                    return [4 /*yield*/, inputManagerFail(client, 0)];
                case 53:
                    input_3 = _a.sent();
                    return [3 /*break*/, 51];
                case 54:
                    if (FFM >= 13) {
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 2];
                case 55: return [2 /*return*/];
            }
        });
    });
}
function inputManagerFail(client, num) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, memberArray, request, response, error_26;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    memberArray = new Array();
                    memberArray[0] = new Array(num.toString());
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: "manager!A2",
                        valueInputOption: "USER_ENTERED",
                        resource: { values: memberArray }
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.update(request)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, 1];
                case 2:
                    error_26 = _a.sent();
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function inputManagerFFM(client, num) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, memberArray, request, response, error_27;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    memberArray = new Array();
                    memberArray[0] = new Array("0");
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: "manager!F".concat(num + 3),
                        valueInputOption: "USER_ENTERED",
                        resource: { values: memberArray }
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.update(request)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, 1];
                case 2:
                    error_27 = _a.sent();
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getManager(client) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, request, response, error_28;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: "manager!A2:A2"
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.get(request)];
                case 1:
                    response = (_a.sent()).data;
                    return [2 /*return*/, parseFloat(response.values[0][0])];
                case 2:
                    error_28 = _a.sent();
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getManager2(client, num) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, request, response, error_29;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: "manager!B".concat(num, ":F").concat(num)
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.get(request)];
                case 1:
                    response = (_a.sent()).data;
                    return [2 /*return*/, response.values[0]];
                case 2:
                    error_29 = _a.sent();
                    console.log(error_29);
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getManagerStop(client) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, request, response, error_30;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: "manager!B2:B2"
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.get(request)];
                case 1:
                    response = (_a.sent()).data;
                    return [2 /*return*/, parseFloat(response.values[0][0])];
                case 2:
                    error_30 = _a.sent();
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function inputManager(client, coinName, num, FFM, SFM, longSuccess, shortSuccess) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, memberArray, inp, request, response, error_31;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sheets = google.sheets({ version: "v4", auth: client });
                    memberArray = new Array();
                    memberArray[0] = new Array(coinName, FFM.toString(), SFM.toString(), longSuccess.toString(), shortSuccess.toString());
                    inp = "manager!A" + (num + 3).toString();
                    request = {
                        spreadsheetId: "1i97pOdBOsEhv9vKtpluXW-fs6PbLCectRfB_UtW5RE4",
                        range: inp,
                        valueInputOption: "USER_ENTERED",
                        resource: { values: memberArray }
                    };
                    return [4 /*yield*/, sheets.spreadsheets.values.update(request)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, 1];
                case 2:
                    error_31 = _a.sent();
                    console.log(error_31);
                    return [2 /*return*/, 100];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function scan() {
    return __awaiter(this, void 0, void 0, function () {
        var N, r10;
        return __generator(this, function (_a) {
            console.log("코인 ?");
            r10 = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            r10.on("line", function (coin) {
                r10.close();
                console.log("롱 실패 : ?");
                var r0 = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                r0.on("line", function (longFail) {
                    r0.close();
                    console.log("숏 실패 : ?");
                    var r5 = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    r5.on("line", function (shortFail) {
                        r5.close();
                        if (longFail > 0 || shortFail > 0) {
                            final(longFail, shortFail, true);
                        }
                        else if (coin == 0) {
                            inputBalance();
                        }
                        else {
                            home(coin);
                        }
                    });
                });
            });
            return [2 /*return*/, N];
        });
    });
}
home(3);
function abc() {
    return __awaiter(this, void 0, void 0, function () {
        var order, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, binance.futuresAllOrders("FTMUSDT")];
                case 1:
                    order = _a.sent();
                    console.log(order.length);
                    for (i = order.length - 1; i >= 0; i--) {
                        if (order[i].status == "FILLED" && order[i].positionSide == "LONG") {
                            console.log(order[i]);
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function inputBalance() {
    return __awaiter(this, void 0, void 0, function () {
        var now, time, mainBalacne, secondBalance, now_1, time_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = new Date();
                    time = now.toLocaleString();
                    console.log(time);
                    return [4 /*yield*/, GetBalances()];
                case 1:
                    mainBalacne = _a.sent();
                    return [4 /*yield*/, inputMoney(client, mainBalacne)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 8];
                    return [4 /*yield*/, GetBalances()];
                case 4:
                    secondBalance = _a.sent();
                    if (!(secondBalance > mainBalacne)) return [3 /*break*/, 6];
                    now_1 = new Date();
                    time_1 = now_1.toLocaleString();
                    console.log(time_1);
                    mainBalacne = secondBalance;
                    console.log(mainBalacne);
                    return [4 /*yield*/, inputMoney(client, mainBalacne)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [4 /*yield*/, sleep(10000)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 8: return [2 /*return*/];
            }
        });
    });
}
