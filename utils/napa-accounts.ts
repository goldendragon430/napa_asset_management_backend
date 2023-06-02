import axios from "axios";
import { decryptString } from "./encryption";

export const getPhraseByProfileId = async (profileId: string) => {
  const options = {
    method: "GET",
    url: `https://napa-backend-staging.napasociety.io/getPhraseByProfileId?profileId=${profileId}`,
  };
  const response = await axios(options);
  return decryptString(response?.data?.data);
};

export const getPrivateKeyByProfileId = async (profileId: string) => {
  const options = {
    method: "GET",
    url: `https://napa-backend-staging.napasociety.io/getPrivateKeyByProfileId?profileId=${profileId}`,
  };
  const response = await axios(options);
  const activeWalletAC = response?.data?.data?.activeWalletAC
  return decryptString(response?.data?.data[`NWA_${activeWalletAC}_PK`]);
};
