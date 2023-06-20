/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const Web3Controller = require("../controllers/web3_2.controller");
const router = express.Router();

router.get("/transactions", Web3Controller.transactionHistory);
router.get("/nativeBalance", Web3Controller.nativeTokenWalletBalance);
router.get("/customBalance", Web3Controller.customTokenWalletBalance);
router.get("/otherTokenBalance", Web3Controller.otherTokenWalletBalance);
router.get("/createWallet", Web3Controller.createWallet);
router.get("/sendNativeToken", Web3Controller.sendNativeToken);
router.get("/sendCustomToken", Web3Controller.sendCustomToken);
router.get("/importTokens", Web3Controller.importTokens);
router.get("/importAccountFromPrivateKey", Web3Controller.importAccountFromPrivateKey);
router.get("/importAccountFromPhrase", Web3Controller.importAccountFromPhrase);
router.get("/importNFTs", Web3Controller.importNFTs);
router.get("/stakeNapaTokens", Web3Controller.stakeNapaTokens);
router.get("/unstakeNapaTokens", Web3Controller.unstakeNapaTokens);
router.get("/fetchAccountsByIndex", Web3Controller.fetchAccountsByIndex);
router.get("/getAllNFTsOfUser", Web3Controller.getAllNFTsOfUser);
router.get("/getSpecificNFTsOfUser", Web3Controller.getSpecificNFTsOfUser);
router.post("/signTransaction", Web3Controller.signTransaction);
router.get("/fetchTokenTransfers", Web3Controller.fetchTokenTransfers);
router.get("/fetchNFTTransfers", Web3Controller.fetchNFTTransfers);
router.get("/fetchAllMixedTransactions", Web3Controller.fetchAllMixedTransactions);
router.post("/getGasFees", Web3Controller.getGasFees);
router.get("/addStreamAddress", Web3Controller.addStreamAddress);
router.get("/sendNFT", Web3Controller.sendNFT);

// we don't need bellow endpoints from now.   
// router.get("/switchNetwork", Web3Controller.switchNetwork);
// router.get("/getCurrentNetwork", Web3Controller.getCurrentNetwork);


module.exports = router;