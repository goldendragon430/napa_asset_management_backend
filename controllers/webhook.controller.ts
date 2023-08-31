import { sendNotification } from "../utils/send-notification";
import { napaDB } from "../index";
import ApiResponse from "../utils/api-response";

const webhook = async (req, res) => {
  const { body } = req;
  try {
    console.log(body);
    if (body?.erc20Transfers[0]) {
      console.log("body?.erc20Transfers[0]", body?.erc20Transfers[0]);
      
      const getSenderProfileId = `SELECT profileId FROM napa_accounts WHERE NWA_1_AC = "${body?.erc20Transfers[0]?.from}" OR NWA_2_AC = "${body?.erc20Transfers[0]?.from}" OR NWA_3_AC = "${body?.erc20Transfers[0]?.from}" OR NWA_4_AC = "${body?.erc20Transfers[0]?.from}" OR NWA_5_AC = "${body?.erc20Transfers[0]?.from}"`;
      const [senderProfileId] = await napaDB.query(getSenderProfileId)
      const getSenderDeviceToken = `SELECT deviceToken FROM users WHERE profileId = "${senderProfileId[0]?.profileId}"`
      const [senderDeviceToken] = await napaDB.query(getSenderDeviceToken)      

      const getReceiverProfileId = `SELECT profileId FROM napa_accounts WHERE NWA_1_AC = "${body?.erc20Transfers[0]?.to}" OR NWA_2_AC = "${body?.erc20Transfers[0]?.to}" OR NWA_3_AC = "${body?.erc20Transfers[0]?.to}" OR NWA_4_AC = "${body?.erc20Transfers[0]?.to}" OR NWA_5_AC = "${body?.erc20Transfers[0]?.to}"`;
      const [receiverProfileId] = await napaDB.query(getReceiverProfileId)
      const getReceiverDeviceToken = `SELECT deviceToken FROM users WHERE profileId = "${receiverProfileId[0]?.profileId}"`
      const [receiverDeviceToken] = await napaDB.query(getReceiverDeviceToken)

      console.log("senderInfo====>>>", senderProfileId[0]?.profileId, senderDeviceToken[0]?.deviceToken);
      console.log("receiverInfo====>>>", receiverProfileId[0]?.profileId, receiverDeviceToken[0]?.deviceToken);
      

      sendNotification(senderDeviceToken[0]?.deviceToken,`${body?.erc20Transfers[0]?.tokenSymbol} sent`,`Send Transaction ${body?.erc20Transfers[0]?.value / 10 ** 18} ${body?.erc20Transfers[0]?.tokenSymbol} is Complete`)

      sendNotification(receiverDeviceToken[0]?.deviceToken,`${body?.erc20Transfers[0]?.tokenSymbol} received`,`${body?.erc20Transfers[0]?.value / 10 ** 18} ${body?.erc20Transfers[0]?.tokenSymbol} has been received`)

      // @ts-ignore
      global.SocketService.handleStreamingERC20TransfersToAccount({
        accountId: body?.erc20Transfers[0]?.to,
        streamResponse: body,
      });
      // @ts-ignore
      global.SocketService.handleStreamingERC20TransfersFromAccount({
        accountId: body?.erc20Transfers[0]?.from,
        streamResponse: body,
      });
    }
    return ApiResponse.successResponse(
      res,
      "Stream address added successfully."
    );
  } catch (e) {
    console.log("token error",e);
    
    return res.status(400).json();
  }
};

module.exports = { webhook };
