import Binance from "node-binance-api";

const binance = new Binance().options({
  APIKEY: "cdnPPkgDmOA6M4qf3R4RFttRg4oHRSYdJvgyL0nQa2pTccWKN85OhCKKDklkzwAP",
  APISECRET: "1WH46dc1WfGfkz8ucPTevhQ19vt1uCL5K9PTXjPx2EFYyzPmC4Z6YHDvKDX4rDy1",
  useServerTime: true,
  reconnect: true,
  recvWindow: 90000,
  verbose: true,
  hedgeMode: true,
});

export default binance;
