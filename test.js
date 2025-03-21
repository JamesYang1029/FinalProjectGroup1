import { getCryptoScore } from "./data/cryptos.js";

async function fetchCryptoScore() {
    const cryptos = ["Bitcoin", "Ethereum", "Solana"];
    const score = await getCryptoScore(cryptos);
    console.log("Sustainability Score:", score);
  }
  
  fetchCryptoScore();