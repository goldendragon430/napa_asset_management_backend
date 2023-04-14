import HealthRouter = require("./health.route");

const setUpRoutes = (app) => {
  app.use("/health", HealthRouter);
};

export default setUpRoutes;
