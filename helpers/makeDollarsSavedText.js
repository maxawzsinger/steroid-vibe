function makeDollarsSavedText(updatedDollarsSaved) {
  return `US$${updatedDollarsSaved.toFixed(2)} saved this session`;
}

module.exports = { makeDollarsSavedText };
