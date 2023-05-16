// web3 functions will come in this file

import ApiResponse from "../utils/api-response";
import Moralis from "moralis";
import { ethers, utils } from "ethers";
import commonTokenAbi from "../web3Utils/abis/tokenAbi.json";
import commonNftAbi from "../web3Utils/abis/nftAbi.json";
import { AllChainIdNew } from "../web3Utils/chainData";
import { originalNapaStakingAddress, originalNapatokenAddress } from "../web3Utils/addresses";
import napaTokenAbi from "../web3Utils/abis/napaTokenAbi.json"
import napaStakingAbi from "../web3Utils/abis/stakingAbi.json"

// 1.  transaction history - DONE
// 2.  wallet balance - both (1. custom and 2. native) DONE
// 3.  create Wallet - Done
// 4.  send & Receive Tokens - Done
// 5.  switching chain. - Done
// 6.  import tokens - Done
// 7.  import wallet. - Done
// 8.  Import NFTs. - Done
// 9.  fetch Current Network. - Done
// 10. stake & unstake. - Done.


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
    res.status(503).json({
      error,
      message:error.message
    });
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
    console.log(response.address, "public Key.");
    console.log(response._signingKey().privateKey, "private key.");
    console.log(response._mnemonic().phrase, "MNEMONIC.");
    const walletData = {
      public_key:response.address,
      private_key:response._signingKey().privateKey,
      mnemonic:response._mnemonic().phrase
    }
    
    ApiResponse.successResponseWithData(res, "Wallet created successfully", {
      CreateWallet: walletData,
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
    const wallet = new ethers.Wallet((req.query.private_key).toString());
    const walletSigner = wallet.connect(global.ethersProvider);

    global.ethersProvider.getGasPrice().then(async (currentGasPrice: any) => {
      const gas_price = ethers.utils.hexlify((currentGasPrice));
      const gas_limit: any = 100000;
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
    const wallet = new ethers.Wallet((req.query.private_key).toString());
    const walletSigner = wallet.connect(global.ethersProvider);

    try {
      // general token send
      const contract = new ethers.Contract(
        (req.query.contract_address).toString(),
        commonTokenAbi.abi,
        walletSigner
      )

      // How many tokens?
      const numberOfTokens = ethers.utils.parseUnits(req.query.send_token_amount, 18)
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
        "responseTimeStamp": "17-04-2023 04:56:37:5637",
        "message": "Token Imported successfully",
        "data": {
            "tokenData": {
                "decimals": 18,
                "balance": "400000000000000000000",
                "symbol": "NAPA",
                "name": "NAPA Society"
            }
        }
    }
}
*/

const importToken = async (req, res) => {
  try {
    const wallet = new ethers.Wallet(req.query.private_key);
    const walletSigner = wallet.connect(global.ethersProvider);

    const contract = new ethers.Contract(
      (req.query.contract_address).toString(),
      commonTokenAbi.abi,
      walletSigner
    )

    const decimals = await contract.decimals();
    const balance = (await contract.balanceOf((req.query.account_address).toString())).toString();
    const symbol = await contract.symbol();
    const name = await contract.name();
    console.log(name, symbol, balance, decimals, "-=-=-")

    ApiResponse.successResponseWithData(res, "Token Imported successfully", {
      tokenData: { decimals, balance, symbol, name },
    });

  } catch (error) {
    console.log(error, "Error while Importing Token");
    res.status(503).send();
  }
};

/*
  (6) importAccountFromPrivateKey()
  request: 
  params: {
      "privateKey":YOUR_PRIVATE_KEY
      },
  expected response: {
    {
    "code": 200,
    "responseTimeStamp": "17-04-2023 05:08:42:842",
    "message": "Wallet successfully imported from Privatekey ",
    "data": {
        "tokenData": {
            "response": "0xFee897E3a3F12a1550E73b8437C20301325Cc98F"
        }
    }
  }
}
*/

const importAccountFromPrivateKey = async (req, res) => {
  try {
    const wallet = new ethers.Wallet(req.query.privateKey);
    wallet.getAddress().then(async (response: any) => {
      console.log(await response, "-==-publicKey-==-");
      ApiResponse.successResponseWithData(res, "Wallet successfully imported from Privatekey ", {
        tokenData: { response },
      });
    }).catch((e: any) => {
      console.log(e, "Error while importing wallet");
    })
  } catch (error) {
    console.log(error, "Error while Importing Wallet");
    res.status(503).send();
  }
};

/*
  (7) importAccountFromPhrase()
  request: 
  params: {
      "phrase":YOUR_SECRET_PHRASE
      },
  expected response: {
    {
    "code": 200,
    "responseTimeStamp": "17-04-2023 05:52:40:5240",
    "message": "Wallet successfully imported By Phrase ",
    "data": {
        "tokenData": {
            "secondAccount": {
                "privateKey": "0x9ca920272be13eebad1866dab88bc6d6e7fb65be95b5640d6a89d787f33dc2b4",
                "publicKey": "0x03f8c54504ffda4388db4e03fe564d89e392109a3480d03818c931e9d05640f7a3",
                "parentFingerprint": "0xfc250dbb",
                "fingerprint": "0xfaa9a2b4",
                "address": "0xFBE446CcCfAfA2da17F327783C6AFf627f50445C",
                "chainCode": "0xcd908155b1ee43a2f5ba22cce3a334608fe9081b93bbd2f91812ee691063c087",
                "index": 1,
                "depth": 5,
                "mnemonic": {
                    "phrase": "ribbon major wrap acid oval admit stuff review hair prevent usage purchase",
                    "path": "m/44'/60'/0'/0/1",
                    "locale": "en"
                },
                "path": "m/44'/60'/0'/0/1"
            }
        }
      }
    }
}
*/

const importAccountFromPhrase = async (req, res) => {
  try {
    const hdNode = utils.HDNode.fromMnemonic(req.query.phrase);

    const firstAccount = hdNode.derivePath(`m/44'/60'/0'/0/0`); // This returns a new HDNode
    const secondAccount = hdNode.derivePath(`m/44'/60'/0'/0/1`);
    const thirdAccount = hdNode.derivePath(`m/44'/60'/0'/0/2`);
    const fourthAccount = hdNode.derivePath(`m/44'/60'/0'/0/3`);

    console.log("First Account", firstAccount);
    console.log("Second Account ", secondAccount);
    console.log("Third Account", thirdAccount);
    console.log("Fourth Account", fourthAccount);

    ApiResponse.successResponseWithData(res, "Wallet successfully imported By Phrase ", {
      tokenData: { firstAccount },
    });
  } catch (error) {
    console.log(error, "Error while Importing Wallet");
    res.status(503).send();
  }
};

/*
  (7) importAccountFromPhrase()
  request: 
  params: {
      "contract_address":0x7bBBa86B912C40a92eca40369B5813cf87153251,
      "private_key":YOUR_PRIVATE_KEY,
      "tknId":68
      },
  expected response: {
    {
    "code": 200,
    "responseTimeStamp": "17-04-2023 06:59:35:5935",
    "message": "NFT imported Successfully ",
    "data": {
        "tokenData": {
            "nftData": "https://gateway.pinata.cloud/ipfs/QmZ5aBbubHi3U2ssjWxj6x3nMEXFVqMzK7zNeGahpGg1VS"
        }
    }
}
}
*/

const importNFTs = async (req, res) => {
  try {
    const wallet = new ethers.Wallet(req.query.private_key)
    const walletSigner = wallet.connect(global.ethersProvider)

    const contract = new ethers.Contract(
      req.query.contract_address,
      commonNftAbi.abi,
      walletSigner
    )

    const nftData = await contract.tokenURI(req.query.tknId);
    console.log(await nftData, "NFT data....!");

    ApiResponse.successResponseWithData(res, "NFT imported Successfully ", {
      tokenData: { nftData },
    });
  } catch (error) {
    console.log(error, "Error while Importing Wallet");
    res.status(503).send();
  }
};

/*
  (7) switchNetwork()
  request: 
  params: {
      id: 7, (between 1-7)
      },
  expected response: {
        {
    "code": 200,
    "responseTimeStamp": "18-04-2023 12:55:30:5530",
    "message": "Network switched Successfully.",
    "data": {
        "currentNetwork": {
            "data": {
                "_isProvider": true,
                "_events": [],
                "_emitted": {
                    "block": -2
                },
                "formatter": {
                    "formats": {
                        "transaction": {},
                        "transactionRequest": {},
                        "receiptLog": {},
                        "receipt": {},
                        "block": {},
                        "blockWithTransactions": {},
                        "filter": {},
                        "filterLog": {}
                    }
                },
                "anyNetwork": false,
                "_networkPromise": {},
                "_maxInternalBlockNumber": -1024,
                "_lastBlockNumber": -2,
                "_pollingInterval": 4000,
                "_fastQueryDate": 0,
                "connection": {
                    "url": "https://matic.getblock.io/acfb8004-9fb8-42c5-a5b2-da8000aaecfa/mainnet/"
                },
                "_nextId": 43,
                "_network": {
                    "name": "matic",
                    "chainId": 137,
                    "ensAddress": null
                }
            },
            "response": "Sepolia test network"
        }
    }
}
}
*/

const switchNetwork = async (req, res) => {
  try {
    const data = global.ethersProvider;
    let response: any = "nothing";

    console.log(data, "Network Before.");

    if ((req.query.id).toString() === "1") {
      global.ethersProvider = new ethers.providers.JsonRpcProvider(AllChainIdNew[0].rpcURL);
      response = AllChainIdNew[0].name;
    } else if ((req.query.id).toString() === "2") {
      global.ethersProvider = new ethers.providers.JsonRpcProvider(AllChainIdNew[1].rpcURL);
      response = AllChainIdNew[1].name;
    } else if ((req.query.id).toString() === "3") {
      global.ethersProvider = new ethers.providers.JsonRpcProvider(AllChainIdNew[2].rpcURL);
      response = AllChainIdNew[2].name;
    } else if ((req.query.id).toString() === "4") {
      global.ethersProvider = new ethers.providers.JsonRpcProvider(AllChainIdNew[3].rpcURL);
      response = AllChainIdNew[3].name;
    } else if ((req.query.id).toString() === "5") {
      global.ethersProvider = new ethers.providers.JsonRpcProvider(AllChainIdNew[4].rpcURL);
      response = AllChainIdNew[4].name;
    } else if ((req.query.id).toString() === "6") {
      global.ethersProvider = new ethers.providers.JsonRpcProvider(AllChainIdNew[5].rpcURL);
      response = AllChainIdNew[5].name;
    } else if ((req.query.id).toString() === "7") {
      global.ethersProvider = new ethers.providers.JsonRpcProvider(AllChainIdNew[6].rpcURL);
      response = AllChainIdNew[6].name;
    } else {
      console.log("Please select Correct N/w");
      response = "Please select Correct N/w";
    }

    console.log(data, "Network After.");

    ApiResponse.successResponseWithData(res, "Network switched Successfully.", {
      currentNetwork: { data, response },
    });
  } catch (error) {
    console.log(error, "Error while Switching the Network.");
    res.status(503).send();
  }
};

/*
  (8) getCurrentNetwork()
  request: 
  params: {
      },
  expected response: {
      {
  "code": 200,
  "responseTimeStamp": "18-04-2023 12:55:34:5534",
  "message": "Network fetched Successfully.",
  "data": {
      "currentNetwork": {
          "data": {
              "_isProvider": true,
              "_events": [],
              "_emitted": {
                  "block": -2
              },
              "formatter": {
                  "formats": {
                      "transaction": {},
                      "transactionRequest": {},
                      "receiptLog": {},
                      "receipt": {},
                      "block": {},
                      "blockWithTransactions": {},
                      "filter": {},
                      "filterLog": {}
                  }
              },
              "anyNetwork": false,
              "_networkPromise": {},
              "_maxInternalBlockNumber": -1024,
              "_lastBlockNumber": -2,
              "_pollingInterval": 4000,
              "_fastQueryDate": 0,
              "connection": {
                  "url": "https://eth.getblock.io/acfb8004-9fb8-42c5-a5b2-da8000aaecfa/sepolia/"
              },
              "_nextId": 43,
              "_network": {
                  "name": "sepolia",
                  "chainId": 11155111,
                  "ensAddress": null
              }
          }
      }
  }
}
}
*/

const getCurrentNetwork = async (req, res) => {
  try {
    const data = global.ethersProvider;
    console.log(data, "Network After.");
    ApiResponse.successResponseWithData(res, "Network fetched Successfully.", {
      currentNetwork: { data },
    });
  } catch (error) {
    console.log(error, "Error while Switching the Network.");
    res.status(503).send();
  }
};

/*
  (10.1) stakeTokens()
  request: 
  params: {
    plan:30 || 60 || 90 || 120,
    address: "0xaBcDsaskjis786sadgsa7d65asdsaasas",
    amount:10,
    privateKey:" YOUR_PRIVATE_KEY"
      },
  expected response: {
                "approvalResponse": {
                "to": "0x245567d7CC4a7382FA5E69E73C647ce6a10bF8D4",
                "from": "0xE4F3fD84131dEedB822Bd2D457Bb7f406d971440",
                "contractAddress": null,
                "transactionIndex": 20,
                "gasUsed": {
                    "type": "BigNumber",
                    "hex": "0xb4ee"
                },"stakeResponse": {
                "to": "0x652b61A82eC3eba8cA6b3c4B5836aE477F36BD3C",
                "from": "0xE4F3fD84131dEedB822Bd2D457Bb7f406d971440",
                "contractAddress": null,
                "transactionIndex": 22,
                "gasUsed": {
                    "type": "BigNumber",
                    "hex": "0x03404a"
                },
  }
*/

const stakeNapaTokens = async (req, res) => {
  try {
    let error;
    let approvalResponse;
    let stakeResponse;
    const decimals = 10 ** 18;
    const amtInWei = req.query.amount * decimals;

    const wallet = new ethers.Wallet((req.query.private_key).toString());
    const walletSigner = wallet.connect(global.ethersProvider);

    const napaTokenCtr = new ethers.Contract(originalNapatokenAddress, napaTokenAbi.abi, walletSigner);
    const napaStakeCtr = new ethers.Contract(originalNapaStakingAddress, napaStakingAbi.abi, walletSigner);

    const userDeposit = await napaStakeCtr.UserPlanDetails((req.query.address).toString(), (req.query.plan).toString());
    const userStakedAmt = userDeposit[1].toString();

    if (userStakedAmt > 0) {
      error = "Already staked for this plan";
    }
    else {
      let isCorrectPlan = false;
      if (Number(req.query.plan) === 30 || Number(req.query.plan) === 60 || Number(req.query.plan) === 90 || Number(req.query.plan) === 120) {
        isCorrectPlan = true;
      } else {
        isCorrectPlan = false;
      }

      const userBal: number = await napaTokenCtr.balanceOf((req.query.address).toString());

      if ((await userBal / decimals) > req.query.amount && await userBal > 0 && userStakedAmt <= 0 && Number(req.query.amount) > 0 && isCorrectPlan) {
        await napaTokenCtr.approve(originalNapaStakingAddress, amtInWei.toString()).then(async (res) => {
          approvalResponse = await res.wait();

          if (req.query.plan == 30) {
            await napaStakeCtr.stakeTokens(amtInWei.toString(), 30).then(async (res: any) => {
              stakeResponse = await res.wait();
            }).catch((e: any) => {
              error = e + "Error while Staking";
            })
          }
          else if (req.query.plan == 60) {
            await napaStakeCtr.stakeTokens(amtInWei.toString(), 60).then(async (res: any) => {
              stakeResponse = await res.wait();
            }).catch((e: any) => {
              error = e + "Error while Staking";
            })
          }
          else if (req.query.plan == 90) {
            await napaStakeCtr.stakeTokens(amtInWei.toString(), 90).then(async (res: any) => {
              stakeResponse = await res.wait();
            }).catch((e: any) => {
              error = e + "Error while Staking";
            })
          }
          else if (req.query.plan == 120) {
            await napaStakeCtr.stakeTokens(amtInWei.toString(), 120).then(async (res: any) => {
              stakeResponse = await res.wait();
            }).catch((e: any) => {
              error = e + "Error while Staking";
            })
          }
        }).catch((e: any) => {
          error = e + "Error while taking an Approval";
        });
      } else {
        if (Number(req.query.plan) != 30 || Number(req.query.plan) != 60 || Number(req.query.plan) != 90 || Number(req.query.plan) != 120) {
          error = "Selected Wrong Plan,  Choose from (30,60,90 or 120) days";
        }
        if (Number(req.query.amount) <= 0) {
          error = "please enter some amount";
        }
        if (userStakedAmt > 0) {
          error = `you already have ${userStakedAmt / decimals} token stake`;
        }
        if (Number(await userBal / decimals) < Number(req.query.amount) && Number(await userBal) <= 0) {
          error = `you have ${(await userBal).toString()} tokens which are less to stake! `;
        }
      }
    }

    ApiResponse.successResponseWithData(res, "Resposne From Stake.", {
      stakingResponse: { approvalResponse, stakeResponse, error },
    });

  } catch (err) {
    console.log(err, "Error while Staking.");
    res.status(503).send();
  }
};

/*
  (10.2) unstakeNapaTokens()
  request: 
  params: {
    plan:30 || 60 || 90 || 120,
    address: "0xc30e6da665e55Fc9a935A2D2B4be174281991C5E",
    privateKey:" YOUR_PRIVATE_KEY"
      },
  expected response: {
       "unStakingResponse": {
           "currentReward": 0.21243471748935505,
           "unStakeResponse": {
               "to": "0x652b61A82eC3eba8cA6b3c4B5836aE477F36BD3C",
               "from": "0xE4F3fD84131dEedB822Bd2D457Bb7f406d971440",
               "contractAddress": null,
               "transactionIndex": 15,
               "gasUsed": {
                   "type": "BigNumber",
                   "hex": "0x01cce8"
               },
  }
*/

const unstakeNapaTokens = async (req, res) => {
  try {
    let error = "No Errors";
    let currentReward = 0;
    let unStakeResponse;
    const decimals = 10 ** 18;

    let wallet = new ethers.Wallet((req.query.private_key).toString());
    let walletSigner = wallet.connect(global.ethersProvider);

    const napaStakeCtr = new ethers.Contract(originalNapaStakingAddress, napaStakingAbi.abi, walletSigner);

    const _userDeposit = await napaStakeCtr.UserPlanDetails((req.query.address).toString(), (req.query.plan).toString());

    if (Number(_userDeposit[1].toString()) > 0) {
      const rewardsEarned = (Number((await napaStakeCtr.checkReward(req.query.plan)).toString()) / decimals).toFixed(18);
      console.log("rewards earned ===>", rewardsEarned);
      currentReward = Number(rewardsEarned);
    }

    const date = new Date(Number((_userDeposit[3].toString()) * 1000));
    var currentUnix = Math.round(+new Date() / 1000);

    if (Number(_userDeposit[1].toString()) <= 0) {
      console.log("you don't have any tokens staked for this plan yet");
      error = "you don't have any tokens staked for this plan yet";
    } else if (Number(_userDeposit[3].toString()) > currentUnix) {
      console.log(`Tokens are locked, you can't unstake now, wait till ${date}`);
      error = `Tokens are locked, you can't unstake now, wait till ${date}`
    } else if (Number(_userDeposit[3].toString()) < Number(currentUnix) && Number(_userDeposit[1].toString()) > 0) {
      const treasuryToStakeCtrAllowance = await napaStakeCtr.pendingRewards();
      if (treasuryToStakeCtrAllowance > 0) {
        await napaStakeCtr.UnstakeTokens(req.query.plan).then(async (res: any) => {
          console.log("transaction for Unstake is in progress..");
          unStakeResponse = await res.wait();
          console.log("transaction for Unstake is complete..");
        }).catch((e: any) => {
          console.log(e, "Error while unstake");
        })
      }
    } else {
      console.log("Not Enough Pending Rewards: admin hasn't added rewards yet.");
    }

    ApiResponse.successResponseWithData(res, "Resposne From Stake.", {
      unStakingResponse: { currentReward, unStakeResponse, error },
    });

  } catch (err) {
    console.log(err, "Error while Staking.");
    res.status(503).send();
  }
};


module.exports = {
  transactionHistory,
  nativeTokenWalletBalance,
  customTokenWalletBalance,
  createWallet,
  sendNativeToken,
  sendCustomToken,
  importToken,
  importAccountFromPrivateKey,
  importAccountFromPhrase,
  importNFTs,
  switchNetwork,
  getCurrentNetwork,
  stakeNapaTokens,
  unstakeNapaTokens
};
