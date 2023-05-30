import { napaDB } from "../index";
import { decryptString } from "./encryption";

export const getPhraseByProfileId = async (profileId: string) => {
  const sql = `SELECT napaWalletAccountPhrase FROM napa_accounts WHERE profileId = "${profileId}"`;
  const [napaAccount] = await napaDB.execute(sql);
  return decryptString(napaAccount[0]?.napaWalletAccountPhrase);
};

export const getPrivateKeyByProfileId = async (profileId: string) => {
  const sql = `SELECT * FROM napa_accounts WHERE profileId = "${profileId}"`;
  const [napaAccount] = await napaDB.execute(sql);
  const activeWalletAC = napaAccount[0]?.activeWalletAC
  return decryptString(napaAccount[0][`NWA_${activeWalletAC}_PK`]);
};
