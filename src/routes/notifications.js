const express = require("express");
const router = express.Router();
const { checkNotifications } = require("../engines/notificationEngine");

// GET /api/notifications?userId=...
router.get("/", (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId || "anonymous";
    const notification = checkNotifications(userId);

    return res.status(200).json({
      ok: true,
      userId: userId,
      timestamp: new Date().toISOString(),
      notification: notification // Object or null
    });
  } catch (error) {
    console.error("Notification Route Error:", error);
    // Contract-safe fallback
    return res.status(200).json({
      ok: false,
      error: "Internal notification error",
      notification: null
    });
  }
});

module.exports = router;