export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "/v2"
    : "https://staging.api.neurolabs.ai/v2";

export const API_KEY: string = process.env.REACT_APP_API_KEY || "";

if (!API_KEY) {
  throw new Error("REACT_APP_API_KEY is not defined in the .env file");
}
