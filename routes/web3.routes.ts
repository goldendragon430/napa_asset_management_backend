/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const Web3Controller = require("../controllers/web3.controller");
const router = express.Router();

router.get("/transactions", Web3Controller.transactionHistory);
router.get("/nativeBalance", Web3Controller.nativeTokenWalletBalance);
router.get("/customBalance", Web3Controller.customTokenWalletBalance);
router.get("/createWallet", Web3Controller.createWallet);
router.get("/sendNativeToken", Web3Controller.sendNativeToken);
router.get("/sendCustomToken", Web3Controller.sendCustomToken);

module.exports = router;
