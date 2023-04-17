// web3 functions will come in this file

import ApiResponse from "../utils/api-response";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { ethers } from "ethers";
import commonTokenAbi from "../web3Utils/abis/tokenAbi.json";

// 1. transaction history - DONE
// 2. wallet balance - both (1. custom and 2. native) DONE
// 3. create Wallet - Done
// 4. send & Receive Tokens
// 5. switching chain.
// 6.import tokens
// 7. import wallet.
// 8. Import NFTs

const transactionHistory = async (req, res) => {
  try {
    await Moralis.start({
      apiKey: process.env.API_KEY,
    });

    const response = await Moralis.EvmApi.transaction.getWalletTransactions({
      chain: req.params.chainId.toString(),
      address: req.params.walletAddress.toString(),
    });

    console.log(
      response,
      `All Transactions of ${req.params.walletAddress.toString()}.`
    );

    ApiResponse.successResponseWithData(
      res,
      "Transactions fetched successfully",
      { transactions: response }
    );
  } catch (error) {
    console.log(error, "Error while Fetching transactions");
    res.status(503).send();
  }
};

/*
  request: 
  params {

  },
  expected response: {

  }
*/

const nativeTokenWalletBalance = async (req, res) => {
  try {
    await Moralis.start({
      apiKey: process.env.API_KEY,
    });

    console.log("req query", req.query);

    const address = req.query.walletAddress;

    let chain;
    if (req.query.chainId == 0) {
      chain = EvmChain.ETHEREUM;
    } else if (req.query.chainId == 1) {
      chain = EvmChain.GOERLI;
    } else if (req.query.chainId == 2) {
      chain = EvmChain.SEPOLIA;
    }
    const response = await Moralis.EvmApi.balance.getNativeBalance({
      address,
      chain,
    });

    console.log(
      response,
      `Balance of ${req.query.walletAddress.toString()}. ${response}`
    );

    ApiResponse.successResponseWithData(res, "Balance fetched successfully", {
      transactions: response,
    });
  } catch (error) {
    console.log(error, "Error while Fetching balance");
    res.status(503).send();
  }
};

const customTokenWalletBalance = async (req, res) => {
  try {
    await Moralis.start({
      apiKey: process.env.API_KEY,
    });

    let chain;
    if (req.params.chainId == 0) {
      chain = EvmChain.ETHEREUM;
    } else if (req.params.chainId == 1) {
      chain = EvmChain.GOERLI;
    } else if (req.params.chainId == 2) {
      chain = EvmChain.SEPOLIA;
    }

    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain: chain,
      tokenAddresses: [req.params.tknAddress.toString()],
      address: req.params.walletAddress,
    });

    console.log(
      response,
      `Balance of ${req.params.walletAddress.toString()}. ${response}`
    );

    ApiResponse.successResponseWithData(
      res,
      "Balance fetched for Custom Token successfully",
      { transactions: response }
    );
  } catch (error) {
    console.log(error, "Error while Fetching Custom Token balance");
    res.status(503).send();
  }
};

const createWallet = async (req, res) => {
  try {
    const response = ethers.Wallet.createRandom();

    console.log(response, "Wallet creation response.");

    ApiResponse.successResponseWithData(res, "Wallet created successfully", {
      wallet: response,
    });
  } catch (error) {
    console.log(error, "Error while Fetching creating a Wallet");
    res.status(503).send();
  }
};

// const sendNativeToken = async (req, res) => {
//   try {
//     // /sendNativeToken/:contract_address/:send_token_amount/:to_address/:send_account/:private_key
//     window.ethersProvider.getGasPrice().then(async (currentGasPrice: any) => {
//       let gas_price = ethers.hexlify((currentGasPrice))
//       let gas_limit: any = 100000
//       const tx = {
//         from: req.params.send_account,
//         to: req.params.to_address,
//         value: ethers.parseEther(req.params.send_token_amount),
//         nonce: window.ethersProvider.getTransactionCount(
//           req.params.send_account,
//           "latest"
//         ),

//         gasLimit: ethers.hexlify(gas_limit), // 100000
//         gasPrice: gas_price,
//       }

//       try {
//         let wallet = new ethers.Wallet(req.params.private_key)
//         let walletSigner = wallet.connect(window.ethersProvider)
//         const response: any = await walletSigner.sendTransaction(tx)
//         alert("Send finished!")
//         ApiResponse.successResponseWithData(
//           res,
//           "Tokens sent successfully.",
//           { wallet: response }
//         );
//       } catch (error) {
//         alert("failed to send!!")
//       }

//     }).catch(() => {
//     })
//   } catch (error) {
//     console.log(error, "Error while Sending Tokens");
//     res.status(503).send();
//   }
// };

module.exports = {
  transactionHistory,
  nativeTokenWalletBalance,
  customTokenWalletBalance,
  createWallet,
};
