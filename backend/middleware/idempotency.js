const crypto = require("crypto");

const idempotencyCache = new Map();
const ASSIGNMENT_SEED = process.env.ASSIGNMENT_SEED

module.exports = function idempotencyMiddleware(req, res, next) {
  const key = req.header("Idempotency-Key");
  if (!key) return next();

  const now = Date.now();
  const cached = idempotencyCache.get(key);

  if (cached && now - cached.timestamp < 5 * 60 * 1000) {
  
    res.set("X-Idempotent", "true");
    res.set("X-Signature", cached.signature);
    return res.status(cached.status).json(cached.body);
  }


  const originalJson = res.json.bind(res);
  res.json = (body) => {
  
    const signature = crypto
      .createHmac("sha256", ASSIGNMENT_SEED)
      .update(JSON.stringify(body))
      .digest("hex");

    // Attach signature header
    res.set("X-Signature", signature);

    // Cache the response
    idempotencyCache.set(key, {
      status: res.statusCode,
      body,
      signature,
      timestamp: Date.now(),
    });

    return originalJson(body);
  };

  next();
};
