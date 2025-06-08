let enc = null;

try {
  const { Tiktoken } = require("js-tiktoken/lite");
  const o200k_base = require("js-tiktoken/ranks/o200k_base");
  enc = new Tiktoken(o200k_base);
  console.log("js-tiktoken loaded successfully");
} catch (error) {
  console.error("Failed to load js-tiktoken:", error.message);
  console.log("Token counting will use fallback estimation");
}

const tokens =
  enc.encode(`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

`).length;

console.log("tokens length: ", tokens);

function getO3DollarValue(numTokens) {
  const dollarCostPerMillionInputTokens = 10;
  const ONE_MILLION = 1000000;

  return (numTokens / ONE_MILLION) * dollarCostPerMillionInputTokens;
}

function getTokens(str) {
  return enc.encode(str).length;
}

module.exports = {
  getO3DollarValue,
  getTokens,
};
