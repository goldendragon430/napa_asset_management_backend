import { sendNotification } from "../utils/send-notification";
import { napaDB } from "../index";
import ApiResponse from "../utils/api-response";
import { getDeviceToken } from "../utils/napa-accounts";

const webhook = async (req, res) => {
  const { body } = req;
  try {
    console.log(body);
    if (body?.erc20Transfers[0] && body?.confirmed) {      
   
      const senderDeviceToken = await getDeviceToken(body?.erc20Transfers[0]?.from)
      const receiverDeviceToken = await getDeviceToken(body?.erc20Transfers[0]?.to)
      
      sendNotification(senderDeviceToken,`${body?.erc20Transfers[0]?.tokenSymbol} sent`,`Send Transaction ${body?.erc20Transfers[0]?.valueWithDecimals} ${body?.erc20Transfers[0]?.tokenSymbol} is Complete`)

      sendNotification(receiverDeviceToken,`${body?.erc20Transfers[0]?.tokenSymbol} received`,`${body?.erc20Transfers[0]?.valueWithDecimals} ${body?.erc20Transfers[0]?.tokenSymbol} has been received`)

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
