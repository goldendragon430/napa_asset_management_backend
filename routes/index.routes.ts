import HealthRouter = require("./health.route");
import Web3Router = require("./web3.routes");
import WebhookRouter = require("./webhook.routes")

const setUpRoutes = (app) => {
  app.use("/health", HealthRouter);
  app.use("/", Web3Router);
  app.use("/webhook", WebhookRouter);
};

export default setUpRoutes;
