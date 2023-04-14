/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const Web3Controller = require("../controllers/web3.controller");
const router = express.Router();

router.get("/Transactions/:chainId/:walletAddress", Web3Controller.transactionHistory);
router.get("/nativeBalance/:chainId/:walletAddress", Web3Controller.nativeTokenWalletBalance);
router.get("/customBalance/:chainId/:walletAddress/:tknAddress", Web3Controller.customTokenWalletBalance);
router.get("/createWallet", Web3Controller.createWallet);
router.get("/sendNativeToken/:contract_address/:send_token_amount/:to_address/:send_account/:private_key", Web3Controller.createWallet);

module.exports = router;
