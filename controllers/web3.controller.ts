// web3 functions will come in this file

import ApiResponse from "../utils/api-response";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { ethers } from "ethers";
import commonTokenAbi from "../web3Utils/abis/tokenAbi.json";

// 1. transaction history - DONE
// 2. wallet balance - both (1. custom and 2. native) DONE
// 3. create Wallet - Done
// 4. send & Receive Tokens - Done
// 5. switching chain.
// 6. import tokens
// 7. import wallet.
// 8. Import NFTs


/*
  (1) transactionHistory()
  request: 
  params {
        "chainId":"0x5",
        "walletAddress":"0xE4F3fD84131dEedB822Bd2D457Bb7f406d971440"
  },
  expected response: {
    "code": 200,
    "responseTimeStamp": "17-04-2023 11:27:30:2730",
    "message": "Transactions fetched successfully",
    "data": {
        "transactions": {
            "total": null,
            "page_size": 100,
            "page": 0,
            "cursor": null,
            "result": [
                {
                    "hash": "0xfd95155393501ae8614dc6f4029af49542bde61998dc9438055daf5736dd164d",
                    "nonce": "0",
                    "transaction_index": "53",
                    "from_address": "0xe4f3fd84131deedb822bd2d457bb7f406d971440",
                    "to_address": "0xa266b6dbaaa9805c8d2d77370c7b3ec227a600e4",
                    "value": "3175691293135124000",
                    "gas": "21000",
                    "gas_price": "22337058279",
                    "input": "0x",
                    "receipt_cumulative_gas_used": "13844221",
                    "receipt_gas_used": "21000",
                    "receipt_contract_address": null,
                    "receipt_root": null,
                    "receipt_status": "1",
                    "block_timestamp": "2023-03-31T23:29:12.000Z",
                    "block_number": "8752090",
                    "block_hash": "0x74a1daf3a8f92b6c8e50906dfaf06817c87f5cfa011ed562754806d6ed89aca4",
                    "transfer_index": [
                        8752090,
                        53
                    ]
                },
            ]
        }
    }
  }
*/

const transactionHistory = async (req, res) => {
  try {
    const response = await Moralis.EvmApi.transaction.getWalletTransactions({
      chain: req.query.chainId.toString(),
      address: req.query.walletAddress.toString(),
    });

    console.log(
      response,
      `All Transactions of ${req.query.walletAddress.toString()}.`
    );

    ApiResponse.successResponseWithData(
      res,
      "Transactions fetched successfully",
      { TransactionHistory: response }
    );
  } catch (error) {
    console.log(error, "Error while Fetching transactions");
    res.status(503).send();
  }
};


/*
  (2.1) nativeTokenWalletBalance()
  request: 
  params: {
      "chainId":11155111,
      "walletAddress":0xE4F3fD84131dEedB822Bd2D457Bb7f406d971440
      },
  expected response: {
    {
    "code": 200,
    "responseTimeStamp": "17-04-2023 12:30:44:3044",
    "message": "Balance fetched successfully",
    "data": {
        "transactions": {
            "balance": "6612076634099694241"
        }
    }
}
}
*/

const nativeTokenWalletBalance = async (req, res) => {
  try {
    // Convert a number to a hexadecimal string with:
    const hexString = (Number(req.query.chainId)).toString(16);
    const convertedHEX = "0x" + hexString

    const response = await Moralis.EvmApi.balance.getNativeBalance({
      "chain": convertedHEX,
      "address": (req.query.walletAddress).toString()
    });
    console.log(
      response,
      `Balance of ${response}`
    );

    ApiResponse.successResponseWithData(res, "Balance fetched successfully", {
      NativeTokenWalletBalance: response,
    });
  } catch (error) {
    console.log(error, "Error while Fetching balance");
    res.status(503).send();
  }
};



/*
  (2.2) customTokenWalletBalance() for one or more tokens
  request: 
  params: {
      "chainId":5,
      "tokenAddresses":0x816A6295C4be3c76a4fd5102c9f9A7D407e43981
      "walletAddress":0xE4F3fD84131dEedB822Bd2D457Bb7f406d971440
      },
  expected response: {
    {
    "code": 200,
    "responseTimeStamp": "17-04-2023 12:30:44:3044",
    "message": "Balance fetched successfully",
    "data": {
        "transactions": {
            "balance": "6612076634099694241"
        }
    }
}
}
*/

const customTokenWalletBalance = async (req, res) => {
  try {
    // Convert a number to a hexadecimal string with:
    const hexString = (Number(req.query.chainId)).toString(16);
    const convertedHEX = "0x" + hexString;

    // fetching balance for all tokens. 
    let tokens: Array<string> = []

    tokens = req.query.tokenAddresses.split(',');
    tokens.map(String)
    console.log(tokens, convertedHEX, "converted HEX and token addresses");

    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      "chain": convertedHEX,
      "tokenAddresses": tokens,
      "address": (req.query.walletAddress).toString()
    });

    console.log(
      response
    );

    ApiResponse.successResponseWithData(
      res,
      "Balance fetched for Custom Tokens successfully",
      { CustomTokenWalletBalance: response }
    );
  } catch (error) {
    console.log(error, "Error while Fetching Custom Token balance");
    res.status(503).send();
  }
};



/*
  (3) createWallet()
  request: 
  params: {
      "chainId":5,
      "tokenAddresses":0x816A6295C4be3c76a4fd5102c9f9A7D407e43981
      "walletAddress":0xE4F3fD84131dEedB822Bd2D457Bb7f406d971440
      },
  expected response: {
    {
  "code": 200,
  "responseTimeStamp": "17-04-2023 02:24:46:2446",
  "message": "Wallet created successfully",
  "data": {
      "wallet": {
          "provider": null,
          "address": "0xb7C5F8a4EAbb6B447BA37A002480477d4e74e5Bc",
          "publicKey": "0x0222bd02bd9beeced551168b0dbaca49ce4b6807cc0fbd85e6c205509cdc4fe6a1",
          "fingerprint": "0xdacb7920",
          "parentFingerprint": "0xd8670d0d",
          "mnemonic": {
              "phrase": "explain frost knife craft arch fox account copper question brave weasel ladder",
              "password": "",
              "wordlist": {
                  "locale": "en"
              },
              "entropy": "0x508badee9900b0b880617faf836be23e"
          },
          "chainCode": "0xc4ca4112f1e9c6a0b487bf820924ac47b9a5fb07a928c5a2b5b3b4e53fbb8ce5",
          "path": "m/44'/60'/0'/0/0",
          "index": 0,
          "depth": 5
      }
  }
}
*/

const createWallet = async (req, res) => {
  try {
    const response = ethers.Wallet.createRandom();
    console.log(response, "Wallet creation response.");

    ApiResponse.successResponseWithData(res, "Wallet created successfully", {
      CreateWallet: response,
    });
  } catch (error) {
    console.log(error, "Error while Fetching creating a Wallet");
    res.status(503).send();
  }
};


/*
  (4) sendNativeToken()
  request: 
  params: {
      "private_key":YOUR_WALLET_PRIVATE_KEY,
      "send_token_amount":0.001,
      "send_account":0x13c8c779899b5EA05236923203A2DbAbBC485AC0  (FROM_ACCOUNT),
      "to_address":0xFee897E3a3F12a1550E73b8437C20301325Cc98F  (TO_ACCOUNT)
      },
  expected response: {
    {
        "code": 200,
        "responseTimeStamp": "17-04-2023 03:20:12:2012",
        "message": "Native Tokens sent successfully.",
        "data": {
            "wallet": {
                "nonce": 84,
                "gasPrice": {
                    "type": "BigNumber",
                    "hex": "0x3b9aca08"
                },
                "gasLimit": {
                    "type": "BigNumber",
                    "hex": "0x0186a0"
                },
                "to": "0xFee897E3a3F12a1550E73b8437C20301325Cc98F",
                "value": {
                    "type": "BigNumber",
                    "hex": "0x038d7ea4c68000"
                },
                "data": "0x",
                "chainId": 11155111,
                "v": 22310257,
                "r": "0xee8ad348973385c89410f6585c8ed544498265412285e6d3051e897091eab7a8",
                "s": "0x4b468d449085e73b544c26639a74a4781f882a7a3e8e6c922066264cf20f1f40",
                "from": "0x13c8c779899b5EA05236923203A2DbAbBC485AC0",
                "hash": "0xd8ad9f15ac763012a59eb58359cb9fb52e32fe5bcc5fe3c245d5b90d97bd4e64",
                "type": null
            }
        }
    }
  }
*/

const sendNativeToken = async (req, res) => {
  try {
    global.ethersProvider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/1v5h6i5Tpuc4-xvrPVnuFHn7xl6jX2qd");

    let wallet = new ethers.Wallet((req.query.private_key).toString());
    let walletSigner = wallet.connect(global.ethersProvider);

    global.ethersProvider.getGasPrice().then(async (currentGasPrice: any) => {
      let gas_price = ethers.utils.hexlify((currentGasPrice));
      let gas_limit: any = 100000;
      const tx = {
        from: req.query.send_account,
        to: req.query.to_address,
        value: ethers.utils.parseEther(req.query.send_token_amount),
        nonce: global.ethersProvider.getTransactionCount(
          req.query.send_account,
          "latest"
        ),
        gasLimit: ethers.utils.hexlify(gas_limit), // 100000
        gasPrice: gas_price,
      }

      try {
        const response: any = await walletSigner.sendTransaction(tx)
        ApiResponse.successResponseWithData(
          res,
          "Native Tokens sent successfully.",
          { NativeTokenSend: response }
        );
      } catch (error) {
        console.log("failed to send!!")
      }
    }).catch((e: any) => {
      console.log("Error while Fetching gasPrice", e);
    })

  } catch (error) {
    console.log(error, "Unknown Error while Sending Tokens");
    res.status(503).send();
  }
};

/*
  (4) sendCustomToken()
  request: 
  params: {
      "private_key":YOUR_WALLET_PRIVATE_KEY,
      "send_token_amount":0.001,
      "send_account":0x13c8c779899b5EA05236923203A2DbAbBC485AC0  (FROM_ACCOUNT),
      "to_address":0xFee897E3a3F12a1550E73b8437C20301325Cc98F  (TO_ACCOUNT)
      },
  expected response: {
{
    "code": 200,
    "responseTimeStamp": "17-04-2023 04:16:48:1648",
    "message": "Custom Tokens sent successfully.",
    "data": {
        "CustomTokenSend": {
            "nonce": 86,
            "gasPrice": {
                "type": "BigNumber",
                "hex": "0x3b9aca07"
            },
            "gasLimit": {
                "type": "BigNumber",
                "hex": "0xdc87"
            },
            "to": "0xE2D4E29BfAC30D91a5e5Dd9BF4492A4241AE2A1D",
            "value": {
                "type": "BigNumber",
                "hex": "0x00"
            },
            "data": "0xa9059cbb000000000000000000000000fee897e3a3f12a1550e73b8437c20301325cc98f0000000000000000000000000000000000000000000000056bc75e2d63100000",
            "chainId": 11155111,
            "v": 22310258,
            "r": "0xac4fe466b5a2b86212bfdc3423c049b3ad64694dd3540574b84ff6de5d107dde",
            "s": "0x164edaf7eb05afba422912119f10c3b1434c0a1e24a108fdc6be24a6bb6d455d",
            "from": "0x13c8c779899b5EA05236923203A2DbAbBC485AC0",
            "hash": "0xb1fa415db99ce301f6fb2e4297ce9ffb6af056db29014c47ff54d6dc9ef27f0e",
            "type": null
        }
    }
}
  }
*/

const sendCustomToken = async (req, res) => {
  console.time();
  try {
    global.ethersProvider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/1v5h6i5Tpuc4-xvrPVnuFHn7xl6jX2qd");

    let wallet = new ethers.Wallet((req.query.private_key).toString());
    let walletSigner = wallet.connect(global.ethersProvider);

    try {
      // general token send
      let contract = new ethers.Contract(
        (req.query.contract_address).toString(),
        commonTokenAbi.abi,
        walletSigner
      )

      // How many tokens?
      let numberOfTokens = ethers.utils.parseUnits(req.query.send_token_amount, 18)
      console.log(`numberOfTokens: ${numberOfTokens}`)

      // Send tokens
      contract.transfer((req.query.to_address).toString(), (numberOfTokens).toString()).then((transferResult: any) => {
        console.log(transferResult)

        ApiResponse.successResponseWithData(
          res,
          "Custom Tokens sent successfully.",
          { CustomTokenSend: transferResult }
        );

      })
    }
    catch (error) {
      console.log("failed to send!!")
    }
  } catch (error) {
    console.log(error, "Unknown Error while Sending Custom Tokens");
    res.status(503).send();
  }
  console.timeEnd();
};


/*
  (5) importToken()
  request: 
  params: {
      "chainId":11155111,
      "walletAddress":0xE4F3fD84131dEedB822Bd2D457Bb7f406d971440
      },
  expected response: {
    {
    "code": 200,
    "responseTimeStamp": "17-04-2023 12:30:44:3044",
    "message": "Balance fetched successfully",
    "data": {
        "transactions": {
            "balance": "6612076634099694241"
        }
    }
}
}
*/

// const importToken = async (req, res) => {
//   try {
//     // Convert a number to a hexadecimal string with:
//     const hexString = (Number(req.query.chainId)).toString(16);
//     const convertedHEX = "0x" + hexString

//     const response = await Moralis.EvmApi.balance.getNativeBalance({
//       "chain": convertedHEX,
//       "address": (req.query.walletAddress).toString()
//     });
//     console.log(
//       response,
//       `Balance of ${response}`
//     );

//     ApiResponse.successResponseWithData(res, "Balance fetched successfully", {
//       NativeTokenWalletBalance: response,
//     });
//   } catch (error) {
//     console.log(error, "Error while Fetching balance");
//     res.status(503).send();
//   }
// };


module.exports = {
  transactionHistory,
  nativeTokenWalletBalance,
  customTokenWalletBalance,
  createWallet,
  sendNativeToken,
  sendCustomToken,
  // importToken
};
