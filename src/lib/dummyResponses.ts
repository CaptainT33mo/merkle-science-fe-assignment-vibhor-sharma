export interface DummyResponse {
  id: string;
  title: string;
  content: string;
  keywords: string[];
}

export const dummyResponses: DummyResponse[] = [
  {
    id: "1",
    title: "Blockchain Fundamentals",
    keywords: ["blockchain", "fundamentals", "basics", "what is"],
    content: `# Blockchain Fundamentals

Blockchain is a **distributed ledger technology** that enables secure, transparent, and tamper-proof record-keeping across a network of computers.

## Key Components

### 1. Blocks
- Each block contains a batch of transactions
- Blocks are linked together in chronological order
- Each block has a unique cryptographic hash

### 2. Consensus Mechanisms
- **Proof of Work (PoW)**: Miners solve complex mathematical puzzles
- **Proof of Stake (PoS)**: Validators are chosen based on their stake
- **Delegated Proof of Stake (DPoS)**: Stakeholders vote for delegates

### 3. Cryptography
- **Public Key Cryptography**: Ensures secure transactions
- **Hash Functions**: Create unique digital fingerprints
- **Digital Signatures**: Verify transaction authenticity

## Benefits

✅ **Decentralization**: No single point of control
✅ **Transparency**: All transactions are publicly visible
✅ **Immutability**: Once recorded, data cannot be altered
✅ **Security**: Cryptographic protection against fraud

The blockchain revolution is just beginning, and its potential applications are virtually limitless!`
  },
  {
    id: "2",
    title: "Cryptocurrency Trading Basics",
    keywords: ["crypto", "trading", "investment", "buy", "sell"],
    content: `# Cryptocurrency Trading Basics

Trading cryptocurrencies can be both exciting and challenging. Here's a comprehensive guide to get you started.

## Getting Started

### 1. Choose a Reliable Exchange
- **Binance**: Largest global exchange
- **Coinbase**: User-friendly for beginners
- **Kraken**: Known for security
- **Gemini**: Regulated and compliant

### 2. Essential Trading Concepts

#### Market Orders
- **Market Buy/Sell**: Execute immediately at current price
- **Limit Buy/Sell**: Set your desired price
- **Stop Loss**: Automatically sell if price drops below threshold

#### Technical Analysis
- **Support/Resistance Levels**: Key price points
- **Moving Averages**: Trend identification
- **RSI (Relative Strength Index)**: Overbought/oversold conditions
- **MACD**: Momentum indicators

## Risk Management

⚠️ **Never invest more than you can afford to lose**
⚠️ **Diversify your portfolio**
⚠️ **Use stop-loss orders**
⚠️ **Keep your private keys secure**

Remember: **Patience and discipline are key to successful trading!**`
  },
  {
    id: "3",
    title: "Smart Contracts Explained",
    keywords: ["smart contract", "ethereum", "defi", "automation"],
    content: `# Smart Contracts Explained

Smart contracts are **self-executing contracts** with the terms of the agreement directly written into code.

## What Are Smart Contracts?

Smart contracts are programs that run on blockchain networks (primarily Ethereum) and automatically execute when predetermined conditions are met.

### Key Characteristics

🔒 **Autonomous**: Execute automatically without intermediaries
🔒 **Trustless**: No need to trust a third party
🔒 **Transparent**: Code is visible to all parties
🔒 **Immutable**: Cannot be changed once deployed

## How They Work

### 1. Contract Creation
\`\`\`solidity
contract SimpleContract {
    address public owner;
    uint public balance;
    
    constructor() {
        owner = msg.sender;
    }
    
    function deposit() public payable {
        balance += msg.value;
    }
}
\`\`\`

### 2. Execution Process
1. **Deployment**: Contract is deployed to blockchain
2. **Trigger**: Conditions are met (time, event, etc.)
3. **Execution**: Code runs automatically
4. **Result**: Actions are performed (transfer, update, etc.)

## Popular Use Cases

### DeFi (Decentralized Finance)
- **Lending Platforms**: Aave, Compound
- **DEXs (Decentralized Exchanges)**: Uniswap, SushiSwap
- **Yield Farming**: Automated yield optimization

### NFTs (Non-Fungible Tokens)
- **Digital Art**: CryptoPunks, Bored Ape Yacht Club
- **Gaming**: Axie Infinity, Decentraland
- **Real Estate**: Fractional ownership

Smart contracts are revolutionizing how we think about agreements and automation!`
  },
  {
    id: "4",
    title: "DeFi Protocols Overview",
    keywords: ["defi", "protocols", "yield", "liquidity", "staking"],
    content: `# DeFi Protocols Overview

Decentralized Finance (DeFi) has revolutionized traditional financial services by removing intermediaries and enabling permissionless access to financial products.

## Major DeFi Categories

### 1. Lending & Borrowing

#### Aave
- **Features**: Variable and stable interest rates
- **Collateral**: Multiple assets supported
- **APY**: 1-10% on deposits, 2-15% on borrowing

#### Compound
- **Features**: Algorithmic interest rates
- **Governance**: COMP token holders vote on changes
- **Integration**: Widely adopted by other protocols

### 2. Decentralized Exchanges (DEXs)

#### Uniswap
- **Type**: Automated Market Maker (AMM)
- **Version**: Currently v4 with concentrated liquidity
- **Fees**: 0.05%, 0.3%, 1% fee tiers

#### SushiSwap
- **Features**: Yield farming rewards
- **Cross-chain**: Available on multiple blockchains
- **Innovation**: Constant feature additions

## Risk Factors

### Smart Contract Risk
- **Code Bugs**: Vulnerabilities in contract code
- **Oracle Failures**: Price feed manipulation
- **Governance Attacks**: Malicious proposals

### Market Risk
- **Impermanent Loss**: AMM liquidity provider risk
- **Volatility**: Crypto market fluctuations
- **Liquidity**: Sudden withdrawal of funds

DeFi is democratizing finance and creating new opportunities for everyone!`
  },
  {
    id: "5",
    title: "NFT Market Analysis",
    keywords: ["nft", "market", "trends", "art", "collectibles"],
    content: `# NFT Market Analysis

Non-Fungible Tokens (NFTs) have exploded in popularity, creating new opportunities for artists, collectors, and investors.

## Market Overview

### Current Trends
- **Trading Volume**: $2-5 billion monthly
- **Active Collections**: 10,000+ unique projects
- **Market Leaders**: Ethereum, Solana, Polygon
- **Growth Rate**: 200%+ year-over-year

## Popular NFT Categories

### 1. Digital Art
#### High-Value Sales
- **Beeple's "Everydays"**: $69 million
- **CryptoPunk #7523**: $11.8 million
- **Bored Ape #8817**: $3.4 million

#### Emerging Artists
- **Generative Art**: Algorithmic creations
- **AI-Generated**: Machine learning art
- **Interactive**: Dynamic NFTs

### 2. Gaming NFTs
#### Popular Games
- **Axie Infinity**: Play-to-earn gaming
- **The Sandbox**: Virtual real estate
- **Decentraland**: Metaverse platform

#### Gaming Benefits
- **True Ownership**: Players own their assets
- **Interoperability**: Use across games
- **Monetization**: Earn from gameplay

## Market Dynamics

### Price Factors
- **Rarity**: Scarcity drives value
- **Utility**: Real-world benefits
- **Community**: Strong social following
- **Artist Fame**: Celebrity involvement

### Trading Strategies
- **Flipping**: Quick buy and sell
- **Long-term Holding**: Investment approach
- **Floor Sweeping**: Buy at floor price
- **Rare Hunting**: Seek unique traits

The NFT market continues to evolve rapidly, offering both opportunities and challenges for participants!`
  }
];

export function getRandomDummyResponse(): DummyResponse {
  const randomIndex = Math.floor(Math.random() * dummyResponses.length);
  return dummyResponses[randomIndex];
}

export function getDummyResponseByKeywords(userMessage: string): DummyResponse {
  const lowerMessage = userMessage.toLowerCase();

  // Find the best matching response based on keywords
  let bestMatch = dummyResponses[0];
  let bestScore = 0;

  for (const response of dummyResponses) {
    let score = 0;
    for (const keyword of response.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = response;
    }
  }

  return bestMatch;
}

export function streamDummyResponse(
  response: DummyResponse,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  speed: number = 50, // milliseconds per character
  onStreamStart?: (timeoutId: NodeJS.Timeout) => void
) {
  const content = response.content;
  let index = 0;
  let currentTimeoutId: NodeJS.Timeout | null = null;

  const streamNextChunk = () => {
    if (index < content.length) {
      // Send chunks of 1-10 characters to simulate realistic streaming
      const chunkSize = Math.floor(Math.random() * 10) + 1;
      const chunk = content.slice(index, index + chunkSize);
      onChunk(chunk);
      index += chunkSize;

      currentTimeoutId = setTimeout(streamNextChunk, speed);

      // Call the callback with the current timeout ID (this will be updated on each call)
      if (onStreamStart) {
        onStreamStart(currentTimeoutId);
      }
    } else {
      onComplete();
    }
  };

  streamNextChunk();
}
