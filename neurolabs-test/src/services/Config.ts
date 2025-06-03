export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "/v2"
    : "https://staging.api.neurolabs.ai/v2";

export const API_KEY: string = process.env.REACT_APP_API_KEY || "";

if (!API_KEY) {
  throw new Error("REACT_APP_API_KEY is not defined in the .env file");
}

// Control logging based on environment
const isDebug = process.env.NODE_ENV === "development";

// Logging utility to gate debug logs
export const logger = {
  log: (...args: any[]) => {
    if (isDebug) console.log(...args);
  },
  error: (...args: any[]) => {
    if (isDebug) console.error(...args);
  },
};
