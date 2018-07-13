import RpcClient from "./client/RpcClient";

const service = "Localization";

export const getPhraseBook = async moduleName => {
  // console.debug("### -> getPhraseBook", moduleName);
  try {
    const response = await RpcClient.request(service, "GetPhraseBook", {
      module: moduleName
    });
    return response;
  } catch (err) {
    console.debug("### <- getPhraseBook error", err);
  }
  return null;
};
