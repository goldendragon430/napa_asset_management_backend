import HealthRouter = require("./health.route");
import Web3Router = require("./web3.routes");

const setUpRoutes = (app) => {
  app.use("/health", HealthRouter);
  app.use("/", Web3Router);
};

export default setUpRoutes;
