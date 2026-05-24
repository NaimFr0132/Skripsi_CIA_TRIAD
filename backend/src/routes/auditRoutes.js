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
          audit_logs.image_path,
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

      const result = await pool.query(query, values);

      res.json(result.rows);
    } catch (error) {
      res.status(500).json(error);
    }
  },
);
router.post("/save-photo-log", async (req, res) => {
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

    await pool.query(
      `
        INSERT INTO audit_logs
        (
          user_id,
          activity,
          image_path,
          ip_address
        )

        VALUES
        (
          $1,
          $2,
          $3,
          $4
        )
        `,
      [user.id, "Admin login dengan snapshot", image_path, req.ip],
    );

    res.json({
      message: "Audit photo log berhasil",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
});
module.exports = router;
