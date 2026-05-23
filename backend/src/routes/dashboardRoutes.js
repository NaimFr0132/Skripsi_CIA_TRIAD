const express = require("express");

const pool = require("../config/db");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("superadmin"),

  async (req, res) => {

    try {

      const totalUsers = await pool.query(`
        SELECT COUNT(*) FROM users
      `);

      const totalLogsToday = await pool.query(`
        SELECT COUNT(*) 
        FROM audit_logs
        WHERE DATE(created_at) = CURRENT_DATE
      `);

      const totalAdmins = await pool.query(`
        SELECT COUNT(*)
        FROM users
        WHERE role IN ('admin1', 'superadmin')
      `);

      res.json({
        totalUsers:
          totalUsers.rows[0].count,

        totalLogsToday:
          totalLogsToday.rows[0].count,

        totalAdmins:
          totalAdmins.rows[0].count,
      });

    } catch (error) {

      res.status(500).json(error);

    }
  }
);

module.exports = router;