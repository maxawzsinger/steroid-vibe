const { parse } = require("@babel/parser");
const generate = require("@babel/generator").default;

function minifyTs(source) {
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["typescript", "jsx", "decorators-legacy"],
    tokens: true,
  });
  return generate(
    ast,
    { compact: true, minified: true, retainLines: false },
    source
  ).code;
}

module.exports = { minifyTs };
