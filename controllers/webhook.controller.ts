import ApiResponse from "../utils/api-response";

const webhook = async (req, res) => {
  const { body } = req;
  try {
    console.log(body);
    if (body?.erc20Transfers[0]) {
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
    return res.status(400).json();
  }
};

module.exports = { webhook };
