import axios from "axios";
import { decryptString } from "./encryption";

export const getPhraseByProfileId = async (profileId: string) => {
  const options = {
    method: "GET",
    url: `${process.env.API_URL}/getPhraseByProfileId?profileId=${profileId}`,
  };
  const response = await axios(options);
  return decryptString(response?.data?.data);
};

export const getPrivateKeyByProfileId = async (profileId: string) => {
  const options = {
    method: "GET",
    url: `${process.env.API_URL}/getPrivateKeyByProfileId?profileId=${profileId}`,
  };
  const response = await axios(options);
  const activeWalletAC = response?.data?.data?.activeWalletAC
  return decryptString(response?.data?.data[`NWA_${activeWalletAC}_PK`]);
};

export const getDeviceToken = async (address: string) => {
  const options = {
    method: "GET",
    url: `${process.env.API_URL}/getDeviceToken?address=${address}`,
  };
  const response = await axios(options);
  const deviceToken = response?.data?.data?.deviceToken
  return deviceToken
};
