/* eslint-disable @typescript-eslint/no-var-requires */
const Moralis = require("moralis").default;
// const { EvmChain } = require("@moralisweb3/common-evm-utils");

export const add = async (addr: string) => {
  // const options = {
  //     chains: [EvmChain.SEPOLIA, EvmChain.GOERLI],
  //     description: "Listen to Transfers",
  //     tag: "transfers",
  //     includeContractLogs: false,
  //     includeNativeTxs: true,
  //     webhookUrl: "https://e6d0-2400-adc1-447-9f00-1aa0-31e1-168d-768b.ngrok-free.app/webhook"
  // }
  // const newStream = await Moralis.Streams.add(options)
  // const { id } = newStream.toJSON();
  // console.log(id,"id")
  // // const address = "0xa1D66BF3b8A08f40c5A61936Bb9C931201c97641"
  // const address = addr;
  // await Moralis.Streams.addAddress({ address, id })
  // console.log("Ind 1")
  try {
    // const address = ["0xa1D66BF3b8A08f40c5A61936Bb9C931201c97641"];
    const address = [addr];
    await Moralis.Streams.addAddress({
      address,
      id: "4f416c83-f7ff-4756-8874-e284f48ed469",
    });
  } catch (e) {
    console.error(e);
  }
};

export const remove = async (addr: string) => {
  try {
    const address = [addr];

    const response = Moralis.Streams.deleteAddress({
      id: "4f416c83-f7ff-4756-8874-e284f48ed469",
      address: address,
    });

    console.log(response.raw);
  } catch (e) {
    console.error(e);
  }
};
