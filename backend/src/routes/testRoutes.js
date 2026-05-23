const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const auditMiddleware = require("../middleware/auditMiddleware");

const router = express.Router();

router.get(
  "/superadmin",
  authMiddleware,
  auditMiddleware("Superadmin membuka dashboard"),
  roleMiddleware("superadmin"),
  (req, res) => {
    res.json({
      message: "Halo Superadmin",
    });
  }
);

router.get(
  "/admin1",
  authMiddleware,
  roleMiddleware("admin1", "superadmin"),
  (req, res) => {
    res.json({
      message: "Halo Admin",
    });
  }
);

module.exports = router;