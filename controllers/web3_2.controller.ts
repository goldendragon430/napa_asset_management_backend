// web3 functions will come in this file
import ApiResponse from "../utils/api-response";
import Moralis from "moralis";
import { ethers, utils } from "ethers";
import commonTokenAbi from "../web3Utils/abis/tokenAbi.json";
import commonNFTAbi from "../web3Utils/abis/nft.json";
import nftABI from "../web3Utils/abis/nft.json";
import { getChain, setProvider } from "../web3Utils/chainHelper";
import { originalNapaStakingAddress, originalNapatokenAddress } from "../web3Utils/addresses";
import napaTokenAbi from "../web3Utils/abis/napaTokenAbi.json"
import napaStakingAbi from "../web3Utils/abis/stakingAbi.json"
import { getPhraseByProfileId, getPrivateKeyByProfileId } from "../utils/napa-accounts";
import { add, remove } from "../utils/streams";

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
// 11. fetch All NFTs for the Wallet
// 12. fetch any specific NFTs for the Wallet.
// 13. fetchSigner - fetch a signer based on account to sign a transaction from NAPA wallet.
// 14. fetchTokenTransactions - fetch all ERC20 transactions related to WALLET
// 15. fetchNFTTransactions - fetch all NFT transactions related to WALLET
// 16. signTransaction - call any contract function by NAPA wallet(without exposing the private key).
// 17. fetchMixedTransactions - combination of 1)normal Transaction, 2) ERC20 Transaction and 3)NFT Transactions.
/*
  (1) transactionHistory()  COMPLETE
  request: 
  params {
        "chainId":"2",
        "account":""
  }
*/

const transactionHistory = async (req, res) => {
  try {

    const chainData = await getChain(req.query.chainId);
    const hex = String(chainData?.hex);
    const response = await Moralis.EvmApi.transaction.getWalletTransactions({
      chain: hex.toString(),
      address: (req.query.account).toString(),
    });
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
      "chainId":2,
      "profileId":''
      }
*/

const nativeTokenWalletBalance = async (req, res) => {
  try {
    const pk = await getPrivateKeyByProfileId(req.query.profileId);
    const wallet = new ethers.Wallet(pk);
    const publicKey = wallet.address;

    const chainData = await getChain(req.query.chainId);
    const hex = String(chainData?.hex);

    const response = await Moralis.EvmApi.balance.getNativeBalance({
      "chain": hex.toString(),
      "address": publicKey.toString()
    });
    console.log(
      response,
      `Balance of ${response}`
    );

    ApiResponse.successResponseWithData(res, "Native Balance fetched successfully", {
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
      "profileId":''
      }
*/

const customTokenWalletBalance = async (req, res) => {
  try {
    const pk = await getPrivateKeyByProfileId(req.query.profileId);
    const wallet = new ethers.Wallet(pk);
    const publicKey = wallet.address;

    const chainData = await getChain(req.query.chainId);
    const hex = String(chainData?.hex);

    // fetching balance for all tokens. 
    let tokens: Array<string> = []

    tokens = req.query.tokenAddresses.split(',');

    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      "chain": hex,
      "tokenAddresses": tokens,
      "address": (publicKey).toString()
    });


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
  params: { }
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
      "profileId":'',
      "amount":0.001,
      "chianId":2
      "receiver_address":0xFee897E3a3F12a1550E73b8437C20301325Cc98F  (TO_ACCOUNT)
      }
*/

// https://open.spotify.com/track/0ubShTPmg2yVtGzaNUGMOR?si=db148f503a554d48

const sendNativeToken = async (req, res) => {
  try {
    const pk = await getPrivateKeyByProfileId(req.query.profileId);
    const _wallet = new ethers.Wallet(pk);
    const publicKey = _wallet.address;

    const wallet = new ethers.Wallet((pk).toString());
    const _provider = await setProvider(req.query.chainId);
    const walletSigner = wallet.connect(_provider);

    if (_provider) {
      _provider.getGasPrice().then(async (currentGasPrice: any) => {
        const gas_price = ethers.utils.hexlify((currentGasPrice));
        const gas_limit: any = 100000;
        const tx = {
          from: publicKey,
          to: req.query.receiver_address,
          value: ethers.utils.parseEther(req.query.amount),
          nonce: _provider.getTransactionCount(
            publicKey,
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
      "profileId":'',
      "amount":0.001,
      "receiver_address":0x13c8c779899b5EA05236923203A2DbAbBC485AC0  (FROM_ACCOUNT),
      "contract_address":0xFee897E3a3F12a1550E73b8437C20301325Cc98F  (TO_ACCOUNT)
      "chainId":2,
      }
*/

const sendCustomToken = async (req, res) => {
  try {
    const pk = await getPrivateKeyByProfileId(req.query.profileId);
    const wallet = new ethers.Wallet((pk).toString());
    const _provider = await setProvider(req.query.chainId);
    const walletSigner = wallet.connect(_provider);

    try {
      const contract = new ethers.Contract(
        (req.query.contract_address).toString(),
        commonTokenAbi.abi,
        walletSigner
      )

      const numberOfTokens = ethers.utils.parseUnits(req.query.amount, 18)
      console.log(`numberOfTokens: ${numberOfTokens}`)

      // Send tokens
      contract.transfer((req.query.receiver_address).toString(), (numberOfTokens).toString()).then((transferResult: any) => {
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
  NOTE: imports multiple tokens
  request: 
  params: {
      "chainId":2,
      "contracts":0xE4F3fD84131dEedB822Bd2D457Bb7f406d971440,0xE4F3fD84131dEedB822Bd2D457Bb7f406d971440
      }
}
*/

const importTokens = async (req, res) => {
  try {
    const chainData = await getChain(req.query.chainId);
    const sortedAddresses = req.query.contracts.split(",");

    const response = await Moralis.EvmApi.token.getTokenMetadata({
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
      "profileId":''
      }
*/

const importAccountFromPrivateKey = async (req, res) => {
  try {
    const pk = (req.query.privateKey).toString();
    const wallet = new ethers.Wallet(pk);
    wallet.getAddress().then(async (response: any) => {
      console.log("publicKey: '", await response, "'");
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
  (7) importAccountFromPhrase()  COMPLETE
  request: 
  params: {
      "profileId":''
      },
*/

const importAccountFromPhrase = async (req, res) => {
  try {
    const pk = (req.query.phrase).toString();
    const hdNode = utils.HDNode.fromMnemonic(pk);

    const firstAccount = hdNode.derivePath(`m/44'/60'/0'/0/0`); // This returns a new HDNode
    const secondAccount = hdNode.derivePath(`m/44'/60'/0'/0/1`);
    const thirdAccount = hdNode.derivePath(`m/44'/60'/0'/0/2`);
    const fourthAccount = hdNode.derivePath(`m/44'/60'/0'/0/3`);
    const fifthAccount = hdNode.derivePath(`m/44'/60'/0'/0/3`);

    console.log("First Account", firstAccount);
    console.log("Second Account ", secondAccount);
    console.log("Third Account", thirdAccount);
    console.log("Fourth Account", fourthAccount);
    console.log("fifth Account", fifthAccount);

    ApiResponse.successResponseWithData(res, "Wallet successfully imported By Phrase ", {
      tokenData: { firstAccount, secondAccount, thirdAccount, fourthAccount, fifthAccount },
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
      "contract":0x7bBBa86B912C40a92eca40369B5813cf87153251,
      "chainId":2,
      "tokenId":68
      }
*/
// Belephant
const importNFTs = async (req, res) => {
  try {
    let _res;
    const pk = await getPrivateKeyByProfileId(req.query.profileId);
    const _wallet = new ethers.Wallet(pk);
    const publicKey = _wallet.address;
    const chainData = await getChain(req.query.chainId);

    const contractAddress = (req.query.contract).toString();
    const tokenId = (req.query.tokenId).toString();
    const provider = await setProvider(req.query.chainId);

    console.log(String(chainData?.hex))

    const response = await Moralis.EvmApi.nft.getNFTTokenIdOwners({
      "chain": String(chainData.hex),
      "format": "decimal",
      "mediaItems": false,
      "address": contractAddress,
      "tokenId": tokenId
    });

    const _ctr = new ethers.Contract(contractAddress, nftABI.abi, provider);
    const owner = await _ctr.ownerOf(tokenId);
    console.log(await owner, publicKey, "ownerownerownerownerownerownerowner")
    if (owner.toString() === publicKey.toString()) {
      _res = response;
    } else {
      _res = "NFT can’t be added as the ownership details do not match. Make sure you have entered correct information.";
    }

    console.log(await _res, "NFT data....!");

    ApiResponse.successResponseWithData(res, "NFT imported Successfully ", {
      tokenData: { _res },
    });
  } catch (error) {
    console.log(error, "Error while Importing an NFT");
    res.status(503).send();
  }
};

/*
  (10.1) stakeTokens() COMPLETE
  request: 
  params: {
    profileId: ''
    amount:10,
    chainId: 2,
    plan:30 || 60 || 90 || 120,
      }
*/

const stakeNapaTokens = async (req, res) => {
  try {
    const pk = await getPrivateKeyByProfileId(req.query.profileId);
    const _wallet = new ethers.Wallet(pk);
    const publicKey = _wallet.address;

    let error;
    let approvalResponse;
    let stakeResponse;
    const decimals = 10 ** 18;
    const amtInWei = req.query.amount * decimals;

    const wallet = new ethers.Wallet((pk).toString());
    const _provider = await setProvider(req.query.chainId);
    const walletSigner = wallet.connect(_provider);

    const napaTokenCtr = new ethers.Contract(originalNapatokenAddress, napaTokenAbi.abi, walletSigner);
    const napaStakeCtr = new ethers.Contract(originalNapaStakingAddress, napaStakingAbi.abi, walletSigner);

    const userDeposit = await napaStakeCtr.UserPlanDetails((publicKey).toString(), (req.query.plan).toString());
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

      const userBal: number = await napaTokenCtr.balanceOf((publicKey).toString());

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
  (10.2) unstakeNapaTokens() COMPLETE
  request: 
  params: {
    profileId:''
    chainId:2,
    amount:'',
    plan:30 || 60 || 90 || 120,
  }
*/


const unstakeNapaTokens = async (req, res) => {
  try {
    const pk = await getPrivateKeyByProfileId(req.query.profileId);
    const _wallet = new ethers.Wallet(pk);
    const publicKey = _wallet.address;

    let error = "No Errors";
    let currentReward = 0;
    let unStakeResponse;
    const decimals = 10 ** 18;

    const wallet = new ethers.Wallet((req.query.private_key).toString());
    const _provider = await setProvider(req.query.chainId);
    const walletSigner = wallet.connect(_provider);

    const napaStakeCtr = new ethers.Contract(originalNapaStakingAddress, napaStakingAbi.abi, walletSigner);

    const _userDeposit = await napaStakeCtr.UserPlanDetails((publicKey).toString(), (req.query.plan).toString());

    if (Number(_userDeposit[1].toString()) > 0) {
      const rewardsEarned = (Number((await napaStakeCtr.checkReward(req.query.plan)).toString()) / decimals).toFixed(18);
      console.log("rewards earned ===>", rewardsEarned);
      currentReward = Number(rewardsEarned);
    }

    const date = new Date(Number((_userDeposit[3].toString()) * 1000));
    const currentUnix = Math.round(+new Date() / 1000);

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
      "profileId":'',
      index:2
    }
*/
const fetchAccountsByIndex = async (req, res) => {
  try {
    const pk = await getPhraseByProfileId(req.query.profileId)
    const hdNode = utils.HDNode.fromMnemonic(pk);

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



/* 11. fetch All NFTs for the Wallet COMPLETE
request: 
params: {
      "chainId":2,
      "profileId":''
    }
*/
const getAllNFTsOfUser = async (req, res) => {
  try {
    // const pk = await getPrivateKeyByProfileId(req.query.profileId);
    // const wallet = new ethers.Wallet(pk);
    // const publicKey = wallet.address;
    const publicKey = req.query.address

    const chainData = await getChain(req.query.chainId);
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      "chain": (chainData.hex).toString(),
      "format": "decimal",
      "mediaItems": true,
      "address": (publicKey).toString()
    });

    ApiResponse.successResponseWithData(res, "All NFTs rerlated to this account are fetched.", {
      tokenData: { response },
    });
  } catch (error) {
    console.log(error, "Error while Importing Account");
    res.status(503).send();
  }
};


/* 12. fetch any specific NFTs for the Wallet.  COMPLETE
request: 
params: {
      "chainId":2,
      "tokenAddresses":0x1cb0a69aA6201230aAc01528044537d0F9D718F3,
      "profileId":''
    }
*/

const getSpecificNFTsOfUser = async (req, res) => {
  try {
    // const pk = await getPrivateKeyByProfileId(req.query.profileId);
    // const wallet = new ethers.Wallet(pk);
    // const publicKey = wallet.address;
    const publicKey = req.query.address

    const chainData = await getChain(req.query.chainId);
    let tokens: Array<string> = []
    tokens = req.query.tokenAddresses.split(',');

    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      "chain": (chainData.hex).toString(),
      "format": "decimal",
      "tokenAddresses": tokens,
      "mediaItems": true,
      "address": publicKey.toString()
    });

    ApiResponse.successResponseWithData(res, "All NFTs related to this account are fetched.", {
      tokenData: { response },
    });
  } catch (error) {
    console.log(error, "Error while Importing Account");
    res.status(503).send();
  }
};

/*
  (13) fetchTokenTransfers()  COMPLETE
  request: 
  params {
        "chainId":"2",
        "account":""
  }
*/

const fetchTokenTransfers = async (req, res) => {
  try {
    const chainData = await getChain(req.query.chainId);
    const hex = String(chainData?.hex);

    const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
      chain: hex.toString(),
      address: (req.query.account).toString(),
    });
    ApiResponse.successResponseWithData(
      res,
      "Transactions for ERC20 Tokens fetched successfully",
      { TransactionHistory: response }
    );
  } catch (error) {
    console.log(error, "Error while Fetching transactions for ERC20 Tokens");
    res.status(503).json({
      error,
      message: error.message
    });
  }
}
/*
  (14) fetchNFTTransfers()  COMPLETE
  request: 
  params {
        "chainId":"2",
        "account":""
  }
*/
const fetchNFTTransfers = async (req, res) => {
  try {
    const chainData = await getChain(req.query.chainId);
    const hex = String(chainData?.hex);

    const response = await Moralis.EvmApi.nft.getWalletNFTTransfers({
      "chain": hex.toString(),
      "format": "decimal",
      "direction": "both",
      "address": (req.query.account).toString()
    });

    ApiResponse.successResponseWithData(
      res,
      "Transactions for NFTs fetched successfully",
      { TransactionHistory: response }
    );
  } catch (error) {
    console.log(error, "Error while Fetching transactions for NFTs");
    res.status(503).json({
      error,
      message: error.message
    });
  }
}

/*
  (15) fetchAllMixedTransactions()  COMPLETE
  request: 
  params {
        "chainId":"2",
        "account":""
  }
*/
const fetchAllMixedTransactions = async (req, res) => {
  try {
    const chainData = await getChain(req.query.chainId);
    const hex = String(chainData?.hex);

    const allTransactions = [];

    const nftResponse = await Moralis.EvmApi.nft.getWalletNFTTransfers({
      "chain": hex.toString(),
      "format": "decimal",
      "direction": "both",
      "address": (req.query.account).toString()
    });

    const tokenResponse = await Moralis.EvmApi.token.getWalletTokenTransfers({
      chain: hex.toString(),
      address: (req.query.account).toString(),
    });

    const nativeResponse = await Moralis.EvmApi.transaction.getWalletTransactions({
      chain: hex.toString(),
      address: (req.query.account).toString(),
    });

    let count = 0;
    nftResponse.result.map((data) => {
      allTransactions.push(data)
      count += 1
    })
    tokenResponse.result.map((data) => {
      allTransactions.push(data)
      count += 1
    })
    nativeResponse.result.map((data) => {
      allTransactions.push(data)
      count += 1
    })

    allTransactions.sort(function (x, y) {
      return y.blockTimestamp - x.blockTimestamp;
    })

    console.log(count, "Response");

    ApiResponse.successResponseWithData(
      res,
      "All Transactions",
      { TransactionHistory: allTransactions }
    );
  } catch (error) {
    console.log(error, "Error while Fetching transactions for NFTs");
    res.status(503).json({
      error,
      message: error.message
    });
  }
}


// params: 
//1. callData  => (includes all details regardiing the function call) -> will explain later.
//2. profileId => ("9fd87b56-5394-4724-a140-d48c82ea27a2")

const signTransaction = async (req, res) => {
  try {
    //getting signer
    const pk = await getPrivateKeyByProfileId(req.query.profileId);
    const _provider = await setProvider(req.query.chainId);
    const wallet = new ethers.Wallet((pk).toString());
    const signer = wallet.connect(_provider);
    //
    const convertedABI = JSON.parse(req.body.params.callData.abi);
    const convertedContractAddress = JSON.parse(req.body.params.callData.contractAddress);
    const functionName = JSON.parse(req.body.params.callData.funcionName);
    const allParams = JSON.parse(req.body.params.callData.allParams);

    console.log(convertedContractAddress, allParams, functionName, ".......params......");

    const contract = new ethers.Contract(
      (convertedContractAddress).toString(),
      convertedABI.abi,
      signer
    )

    const transactionResponse = await contract[functionName](...allParams);
    console.log(await transactionResponse, "transaction confirmation")

    ApiResponse.successResponseWithData(res, "transaction processed!", {
      transactionSuccess: { transactionResponse },
    });
  } catch (error) {
    console.log(error, "Error while fetching signer");
    res.status(503).send();
  }
};

const addStreamAddress = async (req, res) => {
  try {
    console.log("Add Stream Address Api Pending");
    await add(req.query.address)
    console.log("Add Stream Address Api successfully");
    ApiResponse.successResponse(
      res,
      "Add Stream Address successfully",
    );
  } catch (error) {
    console.log(error, "Error while Adding Stream Address");
    res.status(503).json({
      error,
      message: error.message
    });
  }
}

const removeStreamAddress = async (req, res) => {
  try {
    console.log("Remove Stream Address Api Pending");
    await remove(req.query.address)
    console.log("Remove Stream Address Api successfully");
    ApiResponse.successResponse(
      res,
      "Remove Stream Address successfully",
    );
  } catch (error) {
    console.log(error, "Error while Removing Stream Address");
    res.status(503).json({
      error,
      message: error.message
    });
  }
}

// params: 
//1. callData  => (includes all details regardiing the function call) -> will explain later.
//2. profileId => ("9fd87b56-5394-4724-a140-d48c82ea27a2")

const getGasFees = async (req, res) => {
  try {
    //getting signer
    const pk = await getPrivateKeyByProfileId(req.body.params.callData.profileId);
    const _provider = await setProvider(2);
    const wallet = new ethers.Wallet((pk).toString());
    const signer = wallet.connect(_provider);
    //
    const convertedABI = JSON.parse(req.body.params.callData.abi);
    const convertedContractAddress = JSON.parse(req.body.params.callData.contractAddress);
    const functionName = JSON.parse(req.body.params.callData.funcionName);
    const allParams = JSON.parse(req.body.params.callData.allParams);

    console.log(convertedContractAddress, allParams, functionName, ".......params......");

    const contract = new ethers.Contract(
      (convertedContractAddress).toString(),
      convertedABI.abi,
      signer
    )
    let gasPrice;
    let gasFees;
    let gasFeesInEther;

    try {
      const gasEstimate = await contract.estimateGas[functionName](...allParams);
      gasPrice = await signer.getGasPrice();
      gasFees = gasEstimate.mul(gasPrice);
      gasFeesInEther = ethers.utils.formatEther(gasFees);
      console.log(gasPrice, gasFees, gasFeesInEther, "gasPrice,gasFees,gasFeesInEther");
    } catch (error) {
      console.error('Error:', error);
    }

    ApiResponse.successResponseWithData(res, "gasFees Fetched", {
      transactionSuccess: { GasPrice: gasPrice, GasFees: gasFees, GasFeesInEther: gasFeesInEther },
    });
  } catch (error) {
    console.log(error, "Error while fetching signer");
    res.status(503).send();
  }
};


/*
  (22) sendNFT() COMPLETE
  request: 
  params: {
      "chainId":2,
      "profileId":'',
      "nftId":1,
      "contract_address":0xFee897E3a3F12a1550E73b8437C20301325Cc98F 
      "receiver_address": receivers wallet address
      }
*/

const sendNFT = async (req, res) => {
  try {
    const pk = await getPrivateKeyByProfileId(req.query.profileId);
    const wallet = new ethers.Wallet((pk).toString());
    const _provider = await setProvider(req.query.chainId);
    const walletSigner = wallet.connect(_provider);
    const publicKey = wallet.address;
    let errors = "No Errors!"
    console.log("_+_+__+_++_+_", req.query.receiver_address, publicKey, req.query.contract_address, req.query.nftId, "_+_+__+_++_+_")
    try {
      //NFT contract
      const contract = new ethers.Contract(
        (req.query.contract_address).toString(),
        commonNFTAbi.abi,
        walletSigner
      )
      const collectionName = await contract.name();
      console.log(collectionName, "collectionName");
      const owner = await contract.ownerOf((req.query.nftId).toString());
      console.log(owner, "OWNER");
      if (owner.toString() != (publicKey).toString()) {
        errors = "You're not the Owner of this NFT";
      }
      // Send an NFT
      if (owner.toString() == (publicKey).toString()) {
        contract.transferFrom((publicKey).toString()
          , (req.query.receiver_address).toString()
          , (req.query.nftId)).then((transferResult: any) => {
            console.log(transferResult, "NFT sending response");
            ApiResponse.successResponseWithData(
              res,
              `NFT of Collection "${collectionName}" with Id ${(req.query.tokenId).toString()} sent successfully to ${req.query.receiver_address}.`,
              { CustomTokenSend: transferResult, errors }
            );
          })
      } else {
        ApiResponse.successResponseWithData(
          res,
          errors,
          { CustomTokenSend: errors }
        );
      }
    }
    catch (error) {
      console.log(error, "failed to send!!")
    }
  } catch (error) {
    console.log(error, "Unknown Error while Sending an NFT");
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
  fetchAccountsByIndex,
  getAllNFTsOfUser,
  getSpecificNFTsOfUser,
  fetchTokenTransfers,
  fetchNFTTransfers,
  signTransaction,
  fetchAllMixedTransactions,
  addStreamAddress,
  removeStreamAddress,
  getGasFees,
  sendNFT
};