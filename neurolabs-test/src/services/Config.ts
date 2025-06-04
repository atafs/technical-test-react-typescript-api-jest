export const API_BASE_URL: string =
  process.env.NODE_ENV === "development"
    ? "/v2"
    : process.env.REACT_APP_API_BASE_URL || "";

export const API_KEY: string = process.env.REACT_APP_API_KEY || "";

console.log("Config - REACT_APP_ENV:", process.env.REACT_APP_ENV); // Debug
console.log("Config - API_BASE_URL:", API_BASE_URL); // Debug
console.log("Config - API_KEY:", API_KEY); // Debug

if (!API_KEY) {
  throw new Error("REACT_APP_API_KEY is not defined in the .env file");
}

if (process.env.NODE_ENV !== "development" && !API_BASE_URL) {
  throw new Error("REACT_APP_API_BASE_URL is not defined in the .env file");
}

const isDebug = process.env.NODE_ENV === "development";

export const logger = {
  log: (...args: any[]) => {
    if (isDebug) console.log(...args);
  },
  error: (...args: any[]) => {
    if (isDebug) console.error(...args);
  },
};
