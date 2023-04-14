/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const HealthController = require("../controllers/health.controller");
const router = express.Router();

router.get("/", HealthController.healthChecker);

module.exports = router;