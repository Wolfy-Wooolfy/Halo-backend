const express = require("express");
const router = express.Router();
const { handleMindScan, getMindScanPrompt } = require("../core/mindscanController");
const { resolveIdentity } = require("../engines/identityEngine");

// FAIL-CLOSED IDENTITY GATE
const enforceIdentity = (req, res, next) => {
  const identityContext = resolveIdentity(req);
  if (identityContext.type !== "issued") {
    return res.status(403).json({
      ok: false,
      error: "IDENTITY_REQUIRED",
      message: "MindScan requires a server-issued identity token."
    });
  }
  req.identityContext = identityContext;
  next();
};

// GET /api/mindscan
router.get("/", enforceIdentity, getMindScanPrompt);

// POST /api/mindscan
router.post("/", enforceIdentity, handleMindScan);

module.exports = router;