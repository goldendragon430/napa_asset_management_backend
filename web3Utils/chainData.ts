const chainList = {
    "eth": "0x1",
    "goerli": "0x5",
    "sepolia": "0xaa36a7",
    "polygon": "0x89",
    "mumbai": "0x13881",
    "bsc": "0x38",
    "bsc testnet": "0x61",
    "avalanche": "0xa86a",
    "avalanche testnet": "0xa869",
    "fantom": "0xfa",
    "palm": "0x2a15c308d",
    "cronos": "0x19",
    "cronos testnet": "0x152",
    "arbitrum": "0xa4b1",
};

export const AllChainId = [
    {
        id: 0,
        name: "Mumbai Testnet",
        chainId: "80001",
        currencySymbol: "MATIC",
        rpcURL: "https://rpc-mumbai.maticvigil.com",
        explorerURL: "https://mumbai.polygonscan.com/"
    },
    {
        id: 1,
        name: "Ethereum Mainnet",
        chainId: "1",
        currencySymbol: "ETH",
        rpcURL: "https://mainnet.infura.io/v3/",
        explorerURL: "https://etherscan.io"
    },
    {
        id: 2,
        name: "BNB Smart Chain (Mainnet)",
        chainId: "56",
        currencySymbol: "BNB",
        rpcURL: "https://bsc-dataseed.binance.org/",
        explorerURL: "https://bscscan.com/"
    },
    {
        id: 3,
        name: "Goerli test network",
        chainId: "5",
        currencySymbol: "BNB",
        rpcURL: "https://goerli.infura.io/v3/",
        explorerURL: "https://goerli.etherscan.io"
    },
    {
        id: 4,
        name: "Sepolia test network",
        chainId: "11155111",
        currencySymbol: "SepoliaETH",
        rpcURL: "https://sepolia.infura.io/v3/",
        explorerURL: "https://sepolia.etherscan.io"
    }
]


export const AllChainIdNew = [
    {
        id: 1,
        name: "BNB Smart Chain (previously Binance Smart Chain Mainnet)",
        chainId: "56",
        currencySymbol: "BNB",
        rpcURL: "https://bsc.getblock.io/acfb8004-9fb8-42c5-a5b2-da8000aaecfa/mainnet/",
        explorerURL: "https://bscscan.com/"
    },
    {
        id: 2,
        name: "Smart Chain - Testnet",
        chainId: "97",
        currencySymbol: "BNB",
        rpcURL: "https://bsc.getblock.io/acfb8004-9fb8-42c5-a5b2-da8000aaecfa/testnet/",
        explorerURL: "https://testnet.bscscan.com"
    },
    {
        id: 3,
        name: "Polygon Mainnet",
        chainId: "137",
        currencySymbol: "MATIC",
        rpcURL: "https://matic.getblock.io/acfb8004-9fb8-42c5-a5b2-da8000aaecfa/mainnet/",
        explorerURL: "https://polygonscan.com/"
    },
    {
        id: 4,
        name: "Mumbai Testnet",
        chainId: "80001",
        currencySymbol: "MATIC",
        rpcURL: "https://matic.getblock.io/acfb8004-9fb8-42c5-a5b2-da8000aaecfa/testnet/",
        explorerURL: "https://mumbai.polygonscan.com/"
    },
    {
        id: 5,
        name: "Ethereum Mainnet",
        chainId: "1",
        currencySymbol: "ETH",
        rpcURL: "https://eth.getblock.io/acfb8004-9fb8-42c5-a5b2-da8000aaecfa/mainnet/",
        explorerURL: "https://etherscan.io"
    },
    {
        id: 6,
        name: "Goerli test network",
        chainId: "5",
        currencySymbol: "GoerliETH",
        rpcURL: "https://eth.getblock.io/acfb8004-9fb8-42c5-a5b2-da8000aaecfa/goerli/",
        explorerURL: "https://goerli.etherscan.io"
    },
    {
        id: 7,
        name: "Sepolia test network",
        chainId: "11155111",
        currencySymbol: "SepoliaETH",
        rpcURL: "https://eth.getblock.io/acfb8004-9fb8-42c5-a5b2-da8000aaecfa/sepolia/",
        explorerURL: "https://sepolia.etherscan.io"
    }
]