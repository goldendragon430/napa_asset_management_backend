import { napaDB } from "../index";
import { decryptString } from "./encryption";

export const getPhraseByProfileId = async (profileId: string) => {
  const sql = `SELECT napaWalletAccountPhrase FROM napa_accounts WHERE profileId = "${profileId}"`;
  const [napaAccount] = await napaDB.execute(sql);
  return decryptString(napaAccount[0]?.napaWalletAccountPhrase);
};
