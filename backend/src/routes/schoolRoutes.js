const express = require("express");

const pool = require("../config/db");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const auditMiddleware = require("../middleware/auditMiddleware");

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("admin1", "superadmin"),
  auditMiddleware("Menambahkan data sekolah"),
  async (req, res) => {
    try {
      const { title, description } = req.body;

      const result = await pool.query(
        `
        INSERT INTO school_data
        (title, description, created_by)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [
          title,
          description,
          req.user.id,
        ]
      );

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.get(
  "/all",
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT * FROM school_data
        ORDER BY id DESC
        `
      );

      res.json(result.rows);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

module.exports = router;