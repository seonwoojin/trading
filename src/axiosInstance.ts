import axios from "axios";

const production = "https://seonwoomoney.com";
const development = "http://localhost:4000/";
const url = process.env.NODE_ENV !== "development" ? production : development;

export const axiosInstance = axios.create({
  baseURL: url,
});
