const EXTS = new Set([".js", ".jsx", ".ts", ".tsx"]);

const isTsx = (file) => EXTS.has(path.extname(file));

module.exports = { isTsx };
