import axios from "axios";

const production = "http://seonwoomoney.com";
const development = "http://localhost:8000/";
const url = process.env.NODE_ENV !== "development" ? production : development;

export const axiosInstance = axios.create({
  baseURL: url,
});
