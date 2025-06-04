const fs = require("fs");
const path = require("path");

// Custom logger for http-proxy-middleware
const customLogger = {
  info: (...args) => {
    const message = args.join(" ");
    console.log(message);
    fs.appendFileSync(
      path.join(__dirname, "proxy.log"),
      `[${new Date().toISOString()}] ${message}\n`
    );
  },
  warn: (...args) => {
    const message = args.join(" ");
    console.warn(message);
    fs.appendFileSync(
      path.join(__dirname, "proxy.log"),
      `[${new Date().toISOString()}] WARN: ${message}\n`
    );
  },
  error: (...args) => {
    const message = args.join(" ");
    console.error(message);
    fs.appendFileSync(
      path.join(__dirname, "proxy.log"),
      `[${new Date().toISOString()}] ERROR: ${message}\n`
    );
  },
};

try {
  const { createProxyMiddleware } = require("http-proxy-middleware");

  customLogger.info("Loading setupProxy.js");

  module.exports = function (app) {
    const target =
      process.env.REACT_APP_ENV === "local"
        ? "http://localhost:3001"
        : "https://staging.api.neurolabs.ai";

    customLogger.info(
      `Setting up proxy middleware for /v2 to target ${target}`
    );

    app.use(
      "/v2",
      createProxyMiddleware({
        target,
        changeOrigin: true,
        logLevel: "debug",
        secure: target.includes("localhost") ? false : true,
        logger: customLogger,
      })
    );
  };
} catch (error) {
  customLogger.error(`Failed to load setupProxy.js: ${error}`);
}
