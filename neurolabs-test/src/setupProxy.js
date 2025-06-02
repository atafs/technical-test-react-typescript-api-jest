const fs = require("fs");

// Custom logger for http-proxy-middleware
const customLogger = {
  info: (...args) => {
    const message = args.join(" ");
    console.log(message);
    fs.appendFileSync(
      "/Users/americotomas/Repos/staffengineer/technical-test-react-typescript-api-jest/neurolabs-test/proxy.log",
      `[${new Date().toISOString()}] ${message}\n`
    );
  },
  warn: (...args) => {
    const message = args.join(" ");
    console.warn(message);
    fs.appendFileSync(
      "/Users/americotomas/Repos/staffengineer/technical-test-react-typescript-api-jest/neurolabs-test/proxy.log",
      `[${new Date().toISOString()}] WARN: ${message}\n`
    );
  },
  error: (...args) => {
    const message = args.join(" ");
    console.error(message);
    fs.appendFileSync(
      "/Users/americotomas/Repos/staffengineer/technical-test-react-typescript-api-jest/neurolabs-test/proxy.log",
      `[${new Date().toISOString()}] ERROR: ${message}\n`
    );
  },
};

try {
  const { createProxyMiddleware } = require("http-proxy-middleware");

  console.log("Loading setupProxy.js");

  fs.appendFileSync(
    "/Users/americotomas/Repos/staffengineer/technical-test-react-typescript-api-jest/neurolabs-test/proxy.log",
    `[${new Date().toISOString()}] Loading setupProxy.js\n`
  );

  module.exports = function (app) {
    console.log("Setting up proxy middleware for /v2");
    fs.appendFileSync(
      "/Users/americotomas/Repos/staffengineer/technical-test-react-typescript-api-jest/neurolabs-test/proxy.log",
      `[${new Date().toISOString()}] Setting up proxy middleware for /v2\n`
    );

    app.use(
      "/v2",
      createProxyMiddleware({
        target: "https://staging.api.neurolabs.ai/v2", // Include /v2 in the target
        changeOrigin: true,
        logLevel: "debug",
        secure: false,
        logger: customLogger,
      })
    );
  };
} catch (error) {
  console.error("Failed to load setupProxy.js:", error);
  fs.appendFileSync(
    "/Users/americotomas/Repos/staffengineer/technical-test-react-typescript-api-jest/neurolabs-test/proxy.log",
    `[${new Date().toISOString()}] Failed to load setupProxy.js: ${error}\n`
  );
}
