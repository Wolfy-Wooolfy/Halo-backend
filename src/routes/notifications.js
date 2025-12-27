const express = require("express");
const router = express.Router();
const { checkNotifications } = require("../engines/notificationEngine");
const { resolveIdentity } = require("../engines/identityEngine");

// GET /api/notifications
router.get("/", async (req, res) => {
  try {
    const identityContext = resolveIdentity(req);
    
    // FAIL-CLOSED
    if (identityContext.type !== "issued") {
      return res.status(403).json({
        ok: false,
        error: "IDENTITY_REQUIRED",
        notification: null
      });
    }

    // Pipeline: Identity -> Memory IO (via load inside engine)
    const notification = await checkNotifications(identityContext);

    return res.status(200).json({
      ok: true,
      timestamp: new Date().toISOString(),
      notification: notification
    });
  } catch (error) {
    console.error("Notification Route Error:", error);
    return res.status(200).json({
      ok: false,
      error: "Internal notification error",
      notification: null
    });
  }
});

module.exports = router;