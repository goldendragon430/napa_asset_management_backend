/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const Web3Controller = require("../controllers/web3.controller");
const router = express.Router();

router.get("/walletBalance/:walletId", Web3Controller.walletBalance);

module.exports = router;
