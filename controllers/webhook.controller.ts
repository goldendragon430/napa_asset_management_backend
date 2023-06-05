import ApiResponse from "../utils/api-response";

const webhook = async (req, res) => {
  const { body } = req;
  try {
    console.log(body);
    console.log("body?.txs[0]?.toAddress", body?.erc20Transfers[0]?.to);
    
    // @ts-ignore
    global.SocketService.handleStreaming({
      accountId: body?.erc20Transfers[0]?.to,
      streamResponse: body,
    });
    return ApiResponse.successResponse(res, "Stream address added successfully.");
  } catch (e) {
    return res.status(400).json();
  }
};

module.exports = { webhook };
