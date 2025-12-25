const crypto = require("crypto");

/**
 * HALO Identity Engine - Phase 3-C Hardened
 * STRICT SECURITY MODE: Fail-Closed
 */

// 1. SECRET MANAGEMENT (Fail-Closed)
// We DO NOT provide a fallback. If env is missing, the engine degrades to anonymous-only.
const SECRET = process.env.HALO_IDENTITY_SECRET; 

// Default TTL: 30 Days in seconds
const DEFAULT_TTL = 30 * 24 * 60 * 60; 
const TTL_SECONDS = parseInt(process.env.HALO_IDENTITY_TTL_SECONDS) || DEFAULT_TTL;

/**
 * Helper: Base64URL Encoding (RFC 4648)
 * Needed to ensure token is URL-safe and compact
 */
function toBase64Url(jsonOrString) {
  const input = typeof jsonOrString === 'string' ? jsonOrString : JSON.stringify(jsonOrString);
  return Buffer.from(input).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Helper: Base64URL Decoding
 */
function fromBase64Url(str) {
  if (typeof str !== 'string') return null;
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  try {
    return Buffer.from(str, 'base64').toString('utf8');
  } catch (e) {
    return null;
  }
}

/**
 * Creates HMAC Signature (Base64Url Encoded)
 */
function sign(data) {
  if (!SECRET) return null; // Hard Fail
  const signature = crypto.createHmac("sha256", SECRET).update(data).digest("base64");
  
  // Enforce Base64Url (RFC 4648)
  return signature
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Generates an Anonymous Context (Safe Fallback)
 */
function createAnonymous() {
  return {
    identityId: "anonymous", // DETERMINISTIC: Fixed ID for non-identified users
    type: "anonymous",
    canPersist: false, // HARD RULE: Anonymous cannot write persistent memory
    isValid: true
  };
}

/**
 * Resolves IdentityContext from Request Headers
 * Implements Phase 3-C: Hardened Token Verification (Exp + Sig + Length Check)
 */
function resolveIdentity(req) {
  // CRITICAL: If no secret is configured, we cannot verify anything.
  // Must fail closed to Anonymous.
  if (!SECRET) {
    // Optional: Log warning here in a real logger
    return createAnonymous();
  }

  const authHeader = req.headers["x-halo-identity"];

  if (!authHeader || typeof authHeader !== "string") {
    return createAnonymous();
  }

  // Token Format: payloadBase64Url.signature
  const parts = authHeader.split(".");
  if (parts.length !== 2) {
    return createAnonymous();
  }

  const [payloadB64, providedSig] = parts;

  // 1. Verify Signature
  const expectedSig = sign(payloadB64);
  if (!expectedSig) return createAnonymous();

  const providedBuf = Buffer.from(providedSig);
  const expectedBuf = Buffer.from(expectedSig);

  // Anti-DoS: Check lengths BEFORE timingSafeEqual to prevent throwing
  if (providedBuf.length !== expectedBuf.length) {
    return createAnonymous();
  }

  if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) {
    return createAnonymous();
  }

  // 2. Decode Payload & Verify Expiry (TTL)
  try {
    const jsonStr = fromBase64Url(payloadB64);
    if (!jsonStr) return createAnonymous();
    
    const payload = JSON.parse(jsonStr);

    // Check Expiry
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) {
      // Token Expired
      return createAnonymous();
    }

    // Check Subject
    if (!payload.sub) {
      return createAnonymous();
    }

    // Success: Return Issued Identity
    return {
      identityId: payload.sub,
      type: "issued",
      canPersist: true, // Issued identities allowed to persist
      isValid: true
    };

  } catch (err) {
    // Malformed JSON or other parsing error
    return createAnonymous();
  }
}

/**
 * Issues a new Identity Token
 * Format: Base64Url(JSON).Signature
 */
function issueIdentity() {
  // Fail Closed: If no secret, we cannot issue secure tokens.
  if (!SECRET) {
    return null; 
  }

  const now = Math.floor(Date.now() / 1000);
  const userId = "user_" + crypto.randomUUID();
  
  const payload = {
    sub: userId,
    iat: now,
    exp: now + TTL_SECONDS
  };

  const payloadB64 = toBase64Url(payload);
  const signature = sign(payloadB64);

  if (!signature) return null;

  return `${payloadB64}.${signature}`;
}

module.exports = {
  resolveIdentity,
  issueIdentity
};