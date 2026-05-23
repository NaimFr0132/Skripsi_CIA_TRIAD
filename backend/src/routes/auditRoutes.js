const express = require("express");

const pool = require("../config/db");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/all",
//   authMiddleware,
//   roleMiddleware("superadmin"),
  async (req, res) => {

    try {

      const { date } = req.query;

      let query = `
        SELECT 
          audit_logs.id,
          audit_logs.activity,
          audit_logs.ip_address,
          audit_logs.created_at,
          users.username
        FROM audit_logs
        JOIN users
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

      const result = await pool.query(
        query,
        values
      );

      res.json(result.rows);

    } catch (error) {

      res.status(500).json(error);

    }
  }
);

module.exports = router;