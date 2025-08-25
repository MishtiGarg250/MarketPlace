const crypto = require('crypto');

const signResponse = (responseBody) => {
  const seed = process.env.ASSIGNMENT_SEED;
  return crypto.createHmac('sha256', seed).update(JSON.stringify(responseBody)).digest('hex');
};

module.exports = signResponse;
