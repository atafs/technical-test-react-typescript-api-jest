export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "/v2"
    : "https://staging.api.neurolabs.ai/v2";

export const API_KEY: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3ODAxNjA1MjMsImlhdCI6MTc0ODYyNDUyMywiaXNzIjoiaHR0cHM6Ly9zdGFnaW5nLmFwaS5uZXVyb2xhYnMuYWkvIiwianRpIjoiMjMxZjk0MWUtNTA5YS00MDE0LTk4OTMtOTNiYTM5ZTIwYWZjIiwic3ViIjoiYjExY2ZjZDAtMzk4YS00OGE1LTljODktODZjNDdlODBlZmY1In0.xbxonZ0YX6J3_OIlIk_FL0hE4rymBDre8FE6pCEaqE4";
