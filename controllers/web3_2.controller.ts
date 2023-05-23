// web3 functions will come in this file

import ApiResponse from "../utils/api-response";
import Moralis from "moralis";
import { ethers, utils } from "ethers";
import commonTokenAbi from "../web3Utils/abis/tokenAbi.json";
import commonNftAbi from "../web3Utils/abis/nftAbi.json";
import { AllChainId, getChain, setProvider } from "../web3Utils/chainHelper";
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
  (1) transactionHistory()  COMPLETE
  request: 
  params {
        "chainId":"0x5",
        "walletAddress":"0xE4F3fD84131dEedB822Bd2D457Bb7f406d971440"
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
      message: error.message
    });
  }
};


/*
  (2.1) nativeTokenWalletBalance()  COMPLETE
  request: 
  params: {
      "chainId":11155111,
      "walletAddress":0xE4F3fD84131dEedB822Bd2D457Bb7f406d971440
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
  (2.2) customTokenWalletBalance() for one or more tokens  COMPLETE
  request: 
  params: {
      "chainId":5,
      "tokenAddresses":0x816A6295C4be3c76a4fd5102c9f9A7D407e43981
      "walletAddress":0xE4F3fD84131dEedB822Bd2D457Bb7f406d971440
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
  (3) createWallet()  COMPLETE
  request: 
  params: {
      "chainId":5,
      "tokenAddresses":0x816A6295C4be3c76a4fd5102c9f9A7D407e43981
      "walletAddress":0xE4F3fD84131dEedB822Bd2D457Bb7f406d971440
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
      public_key: response.address,
      private_key: response._signingKey().privateKey,
      mnemonic: response._mnemonic().phrase
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
  (4) sendNativeToken() COMPLETE
  request: 
  params: {
      "private_key":YOUR_WALLET_PRIVATE_KEY,
      "send_token_amount":0.001,
      "send_account":0x13c8c779899b5EA05236923203A2DbAbBC485AC0  (FROM_ACCOUNT),
      "to_address":0xFee897E3a3F12a1550E73b8437C20301325Cc98F  (TO_ACCOUNT)
      }
*/

// https://open.spotify.com/track/0ubShTPmg2yVtGzaNUGMOR?si=db148f503a554d48

const sendNativeToken = async (req, res) => {
  try {
    const wallet = new ethers.Wallet((req.query.private_key).toString());
    const _provider = await setProvider(req.query.chainId, wallet);
    let walletSigner = wallet.connect(_provider);

    if (_provider) {
      _provider.getGasPrice().then(async (currentGasPrice: any) => {
        const gas_price = ethers.utils.hexlify((currentGasPrice));
        const gas_limit: any = 100000;
        const tx = {
          from: req.query.send_account,
          to: req.query.to_address,
          value: ethers.utils.parseEther(req.query.send_token_amount),
          nonce: _provider.getTransactionCount(
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
    } else {
      console.log("couldn't get the provider");
    }
  } catch (error) {
    console.log(error, "Unknown Error while Sending Tokens");
    res.status(503).send();
  }
};

/*
  (4) sendCustomToken() COMPLETE
  request: 
  params: {
      "private_key":YOUR_WALLET_PRIVATE_KEY,
      "send_token_amount":0.001,
      "send_account":0x13c8c779899b5EA05236923203A2DbAbBC485AC0  (FROM_ACCOUNT),
      "to_address":0xFee897E3a3F12a1550E73b8437C20301325Cc98F  (TO_ACCOUNT)
      }
*/

const sendCustomToken = async (req, res) => {
  try {
    const wallet = new ethers.Wallet((req.query.private_key).toString());
    const _provider = await setProvider(req.query.chainId, wallet);
    let walletSigner = wallet.connect(_provider);

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
  (5) importToken() COMPLETE
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

const importTokens = async (req, res) => {
  try {
    let response;
    const chainData = await getChain(req.query.chainId);
    const sortedAddresses = req.query.contracts.split(",");

    response = await Moralis.EvmApi.token.getTokenMetadata({
      "chain": String(chainData?.hex),
      "addresses": sortedAddresses
    });

    ApiResponse.successResponseWithData(res, "Tokens Imported successfully", {
      tokenData: { response },
    });

  } catch (error) {
    console.log(error, "Error while Importing Token");
    res.status(503).send();
  }
};

/*
  (6) importAccountFromPrivateKey() COMPLETE
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
  (7) importAccountFromPhrase() COMPLETE
  request: 
  params: {
      "contract_address":0x7bBBa86B912C40a92eca40369B5813cf87153251,
      "private_key":YOUR_PRIVATE_KEY,
      "tknId":68
      }
}
*/

const importNFTs = async (req, res) => {
  try {
    const wallet = new ethers.Wallet((req.query.private_key).toString());
    const _provider = await setProvider(req.query.chainId, wallet);
    let walletSigner = wallet.connect(_provider);

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
  (10.1) stakeTokens() COMPLETE
  request: 
  params: {
    plan:30 || 60 || 90 || 120,
    address: "0xaBcDsaskjis786sadgsa7d65asdsaasas",
    amount:10,
    privateKey:" YOUR_PRIVATE_KEY"
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
    const _provider = await setProvider(req.query.chainId, wallet);
    let walletSigner = wallet.connect(_provider);

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
      }
  }
*/


const unstakeNapaTokens = async (req, res) => {
  try {
    let error = "No Errors";
    let currentReward = 0;
    let unStakeResponse;
    const decimals = 10 ** 18;

    const wallet = new ethers.Wallet((req.query.private_key).toString());
    const _provider = await setProvider(req.query.chainId, wallet);
    let walletSigner = wallet.connect(_provider);

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


/*(10.3) fetchAccountsByIndex() COMPLETE
request: 
params: {
  plan:30 || 60 || 90 || 120,
  address: "0xc30e6da665e55Fc9a935A2D2B4be174281991C5E",
  privateKey:" YOUR_PRIVATE_KEY"
    }
}
*/


const fetchAccountsByIndex = async (req, res) => {
  try {
    const hdNode = utils.HDNode.fromMnemonic(req.query.phrase);

    const desiredAccount = hdNode.derivePath(`m/44'/60'/0'/0/${req.query.index}`);
    console.log("First Account", desiredAccount);

    ApiResponse.successResponseWithData(res, "Account successfully imported By Phrase and Index.", {
      tokenData: { desiredAccount },
    });
  } catch (error) {
    console.log(error, "Error while Importing Account");
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
  importTokens,
  importAccountFromPrivateKey,
  importAccountFromPhrase,
  importNFTs,
  stakeNapaTokens,
  unstakeNapaTokens,
  fetchAccountsByIndex
};
