// web3 functions will come in this file

import ApiResponse from "../utils/api-response";

const walletBalance = async (req, res) => {
  try {
    ApiResponse.successResponseWithData(
      res,
      "Wallet Balance Get Successfully",
      { address: req.params.walletId }
    );
  } catch (error) {
    res.status(503).send();
  }
};

module.exports = { walletBalance };
