const crypto = require('crypto');

const generateSKU = (productName) => {
  const seed = process.env.ASSIGNMENT_SEED;
  return crypto.createHash('md5').update(productName + seed).digest('hex').slice(0,8).toUpperCase();
};

module.exports = generateSKU;
