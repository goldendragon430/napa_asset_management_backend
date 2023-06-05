/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const WebhookController = require("../controllers/webhook.controller");
const router = express.Router();

router.post("/", WebhookController.webhook);

module.exports = router;