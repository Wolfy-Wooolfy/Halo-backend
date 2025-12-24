const crypto = require("crypto");

function base64urlEncode(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, "utf-8");
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64urlDecodeToString(input) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64").toString("utf-8");
}

function hmacSha256(secret, data) {
  return crypto.createHmac("sha256", secret).update(data).digest();
}

function getSecret() {
  const secret = process.env.HALO_IDENTITY_SECRET;
  if (!secret || typeof secret !== "string" || secret.trim().length < 16) {
    return null;
  }
  return secret.trim();
}

function issueIdentityToken({ ttlSeconds = 60 * 60 * 24 * 30 } = {}) {
  const secret = getSecret();
  if (!secret) {
    return null;
  }

  const identityId = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    identity_id: identityId,
    iat: now,
    exp: now + ttlSeconds
  };

  const payloadStr = JSON.stringify(payload);
  const payloadB64 = base64urlEncode(payloadStr);
  const sig = hmacSha256(secret, payloadB64);
  const sigB64 = base64urlEncode(sig);

  return `${payloadB64}.${sigB64}`;
}

function verifyIdentityToken(token) {
  const secret = getSecret();
  if (!secret) {
    return { ok: false, reason: "SECRET_MISSING" };
  }

  if (!token || typeof token !== "string") {
    return { ok: false, reason: "TOKEN_MISSING" };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { ok: false, reason: "TOKEN_FORMAT" };
  }

  const [payloadB64, sigB64] = parts;

  let payloadStr;
  try {
    payloadStr = base64urlDecodeToString(payloadB64);
  } catch (e) {
    return { ok: false, reason: "PAYLOAD_DECODE" };
  }

  let payload;
  try {
    payload = JSON.parse(payloadStr);
  } catch (e) {
    return { ok: false, reason: "PAYLOAD_JSON" };
  }

  if (!payload || typeof payload !== "object") {
    return { ok: false, reason: "PAYLOAD_INVALID" };
  }

  const identityId = payload.identity_id;
  const exp = payload.exp;

  if (!identityId || typeof identityId !== "string") {
    return { ok: false, reason: "IDENTITY_MISSING" };
  }

  if (!exp || typeof exp !== "number") {
    return { ok: false, reason: "EXP_MISSING" };
  }

  const now = Math.floor(Date.now() / 1000);
  if (now >= exp) {
    return { ok: false, reason: "TOKEN_EXPIRED" };
  }

  const expectedSig = hmacSha256(secret, payloadB64);
  const expectedSigB64 = base64urlEncode(expectedSig);

  const a = Buffer.from(expectedSigB64, "utf-8");
  const b = Buffer.from(sigB64, "utf-8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, reason: "SIG_MISMATCH" };
  }

  return {
    ok: true,
    identity: {
      identity_id: identityId,
      identity_type: "issued"
    }
  };
}

function resolveIdentityContext(req) {
  const headerToken =
    req && req.headers ? req.headers["x-halo-identity"] || req.headers["X-HALO-IDENTITY"] : null;

  const token = Array.isArray(headerToken) ? headerToken[0] : headerToken;

  const verified = verifyIdentityToken(token);
  if (verified.ok) {
    return {
      identity_id: verified.identity.identity_id,
      identity_type: "issued",
      can_persist: true,
      token: token
    };
  }

  const issuedToken = issueIdentityToken();
  return {
    identity_id: "anonymous",
    identity_type: "anonymous",
    can_persist: false,
    token: null,
    issued_token: issuedToken || null,
    issued_token_reason: issuedToken ? null : "SECRET_MISSING"
  };
}

module.exports = {
  resolveIdentityContext,
  verifyIdentityToken,
  issueIdentityToken
};
