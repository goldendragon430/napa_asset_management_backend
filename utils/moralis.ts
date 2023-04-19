import Moralis from "moralis";

export const startMoralis = async () => {
  await Moralis.start({
    apiKey: process.env.API_KEY,
  });
};