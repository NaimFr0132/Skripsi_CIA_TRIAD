const express = require("express");

const pool = require("../config/db");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const createAuditLog = require("../utils/createAuditLog");

const router = express.Router();

router.get(
  "/all",

  // authMiddleware,
  // roleMiddleware("superadmin"),

  async (req, res) => {
    try {
      const { date } = req.query;

      let query = `
        SELECT 
          audit_logs.id,
          users.username,
          audit_logs.role,
          audit_logs.action,
          audit_logs.description,
          audit_logs.severity,
          audit_logs.status,
          audit_logs.ip_address,
          audit_logs.user_agent,
          audit_logs.snapshot_image,
          audit_logs.created_at

        FROM audit_logs

        LEFT JOIN users
        ON audit_logs.user_id = users.id
      `;

      let values = [];

      if (date) {
        query += `
          WHERE DATE(audit_logs.created_at) = $1
        `;

        values.push(date);
      }

      query += `
        ORDER BY audit_logs.id DESC
      `;

      const result = await pool.query(query, values);

      res.json(result.rows);
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  },
);

router.post(
  "/save-photo-log",

  async (req, res) => {
    try {
      console.log(req.body);

      const { username, image_path } = req.body;

      const userResult = await pool.query(
        `
          SELECT *
          FROM users
          WHERE username = $1
          `,
        [username],
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          message: "User tidak ditemukan",
        });
      }

      const user = userResult.rows[0];

      await createAuditLog({
        user_id: user.id,

        role: user.role,

        action: "LOGIN_SUCCESS",

        description: "Admin login dengan snapshot",

        severity: "medium",

        status: "success",

        ip_address: req.ip,

        snapshot_image: image_path.replace(/\\/g, "/"),

        user_agent: req.headers["user-agent"],
      });

      res.json({
        message: "Audit photo log berhasil",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  },
);

module.exports = router;
