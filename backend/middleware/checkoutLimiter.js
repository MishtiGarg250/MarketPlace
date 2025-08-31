const rateLimit = require('express-rate-limit');

// 7 requests per minute per IP
const checkoutLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 7,
  message: { msg: 'Too many checkout requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = checkoutLimiter;
