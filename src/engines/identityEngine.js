const crypto = require("crypto");

// Fallback secret ONLY for dev/test if env is missing. 
// In prod, HALO_IDENTITY_SECRET must be set.
const SECRET = process.env.HALO_IDENTITY_SECRET || "dev-secret-do-not-use-in-prod-halo-core";

function sign(data) {
  return crypto.createHmac("sha256", SECRET).update(data).digest("hex");
}

/**
 * Resolves IdentityContext from Request Headers
 * Implements Phase 3-A: Identity Boundary
 */
function resolveIdentity(req) {
  const authHeader = req.headers["x-halo-identity"];
  
  // Default: Anonymous (Transient)
  const anonymousContext = {
    identityId: "anonymous_" + crypto.randomUUID().substring(0, 8),
    type: "anonymous",
    canPersist: false, // HARD RULE: Anonymous cannot write persistent memory
    isValid: true
  };

  if (!authHeader || typeof authHeader !== "string") {
    return anonymousContext;
  }

  const [id, signature] = authHeader.split(".");
  if (!id || !signature) {
    return anonymousContext;
  }

  // Verify Signature
  const expectedSignature = sign(id);
  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return {
      identityId: id,
      type: "issued",
      canPersist: true, // Issued identities allowed to persist
      isValid: true
    };
  }

  // If signature fails, degrade to anonymous immediately (Fail-Closed)
  return anonymousContext;
}

/**
 * Issues a new Identity Token
 * Used when a user needs to upgrade from anonymous or fresh start
 */
function issueIdentity() {
  const newId = "user_" + crypto.randomUUID();
  const signature = sign(newId);
  return `${newId}.${signature}`;
}

module.exports = {
  resolveIdentity,
  issueIdentity
};