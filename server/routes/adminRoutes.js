const express = require("express");
const router = express.Router();
const { getAnalytics, verifyTicket } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.get("/analytics", protect, adminOnly, getAnalytics);
router.post("/verify-ticket/:bookingId", protect, adminOnly, verifyTicket);

module.exports = router;
