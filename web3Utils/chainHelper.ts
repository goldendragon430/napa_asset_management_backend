import { ethers } from "ethers";

const chainList = [
    { name: "eth", hex: "0x1" },
    { name: "goerli", hex: "0x5" },
    { name: "sepolia", hex: "0xaa36a7" },
    { name: "bsc testnet", hex: "0x61" },
    { name: "bsc", hex: "0x38" },
    { name: "polygon", hex: "0x89" },
    { name: "mumbai", hex: "0x13881" },
    { name: "avalanche", hex: "0xa86a" },
    { name: "avalanche testnet", hex: "0xa869" },
    { name: "fantom", hex: "0xfa" },
    { name: "palm", hex: "0x2a15c308d" },
    { name: "cronos", hex: "0x19" },
    { name: "cronos testnet", hex: "0x152" },
    { name: "arbitrum", hex: "0xa4b1" },
];

export const AllChainId = [
    {
        id: 0,
        name: "Ethereum Mainnet",
        chainId: "1",
        currencySymbol: "ETH",
        rpcURL: "https://eth.getblock.io/acfb8004-9fb8-42c5-a5b2-da8000aaecfa/mainnet/",
        explorerURL: "https://etherscan.io"
    },
    {
        id: 1,
        name: "Goerli test network",
        chainId: "5",
        currencySymbol: "GoerliETH",
        rpcURL: "https://eth.getblock.io/acfb8004-9fb8-42c5-a5b2-da8000aaecfa/goerli/",
        explorerURL: "https://goerli.etherscan.io"
    },
    {
        id: 2,
        name: "Sepolia test network",
        chainId: "11155111",
        currencySymbol: "SepoliaETH",
        rpcURL: "https://eth.getblock.io/acfb8004-9fb8-42c5-a5b2-da8000aaecfa/sepolia/",
        explorerURL: "https://sepolia.etherscan.io"
    },
    {
        id: 3,
        name: "BNB Smart Chain (previously Binance Smart Chain Mainnet)",
        chainId: "56",
        currencySymbol: "BNB",
        rpcURL: "https://bsc.getblock.io/acfb8004-9fb8-42c5-a5b2-da8000aaecfa/mainnet/",
        explorerURL: "https://bscscan.com/"
    },
    {
        id: 4,
        name: "Smart Chain - Testnet",
        chainId: "97",
        currencySymbol: "BNB",
        rpcURL: "https://bsc.getblock.io/acfb8004-9fb8-42c5-a5b2-da8000aaecfa/testnet/",
        explorerURL: "https://testnet.bscscan.com"
    },
    {
        id: 5,
        name: "Polygon Mainnet",
        chainId: "137",
        currencySymbol: "MATIC",
        rpcURL: "https://matic.getblock.io/acfb8004-9fb8-42c5-a5b2-da8000aaecfa/mainnet/",
        explorerURL: "https://polygonscan.com/"
    },
    {
        id: 6,
        name: "Mumbai Testnet",
        chainId: "80001",
        currencySymbol: "MATIC",
        rpcURL: "https://matic.getblock.io/acfb8004-9fb8-42c5-a5b2-da8000aaecfa/testnet/",
        explorerURL: "https://mumbai.polygonscan.com/"
    }
]


export const setProvider = async (chainId: any) => {
    let provider: any;
    try {
        if (Number(chainId) == 0) {
            provider = new ethers.providers.JsonRpcProvider(AllChainId[0].rpcURL)
            console.log(provider, "for ETHEREUM MAIN Network");
        } else if (Number(chainId) == 1) {
            provider = new ethers.providers.JsonRpcProvider(AllChainId[1].rpcURL)
            console.log(provider, "for GOERLI Network");
        } else if (Number(chainId) == 2) {
            provider = new ethers.providers.JsonRpcProvider(AllChainId[2].rpcURL)
            console.log(provider, "for SEPOLIA Network");
        } else if (Number(chainId) == 3) {
            provider = new ethers.providers.JsonRpcProvider(AllChainId[3].rpcURL)
            console.log(provider, "for BNB TEST Network");
        } else if (Number(chainId) == 4) {
            provider = new ethers.providers.JsonRpcProvider(AllChainId[4].rpcURL)
            console.log(provider, "for BNB MAIN Network");
        } else if (Number(chainId) == 5) {
            provider = new ethers.providers.JsonRpcProvider(AllChainId[5].rpcURL)
            console.log(provider, "for POLYGON MAIN Network");
        } else if (Number(chainId) == 6) {
            provider = new ethers.providers.JsonRpcProvider(AllChainId[6].rpcURL)
            console.log(provider, "for MUMBAI TEST Network");
        } else {
            console.log("Sent Wrong Network ID");
            return 0;
        }
    } catch (e: any) {
        console.log(e, "Error while setting the Provider");
        return 0;
    }
    return provider;
}


export const getChain = async (chainId: any) => {
    let chain: any;
    try {
        if (Number(chainId) == 0) {
            chain = chainList[0];
            console.log(chain, "for ETH Network");
        } else if (Number(chainId) == 1) {
            chain = chainList[1];
            console.log(chain, "for GOERLI Network");
        } else if (Number(chainId) == 2) {
            chain = chainList[2];
            console.log(chain, "for SEPOLIA Network");
        } else if (Number(chainId) == 3) {
            chain = chainList[3];
            console.log(chain, "for BNB TEST Network");
        } else if (Number(chainId) == 4) {
            chain = chainList[4];
            console.log(chain, "for BNB MAIN Network");
        } else if (Number(chainId) == 5) {
            chain = chainList[5];
            console.log(chain, "for POLYGON MAIN Network");
        } else if (Number(chainId) == 6) {
            chain = chainList[6];
            console.log(chain, "for MUMBAI TEST Network");
        } else {
            console.log("Sent Wrong Network ID");
            return 0;
        }
    } catch (e: any) {
        console.log(e, "Error while getting the chain")
        return 0;
    }
    return chain;
}