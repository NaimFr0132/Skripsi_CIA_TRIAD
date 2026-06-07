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
        SELECT COUNT(*)
        FROM users
      `);

      const totalLogsToday = await pool.query(`
        SELECT COUNT(*)
        FROM audit_logs
        WHERE DATE(created_at) = CURRENT_DATE
      `);

      const totalAdmins = await pool.query(`
        SELECT COUNT(*)
        FROM users
        WHERE role IN ('admin', 'superadmin')
      `);

      res.json({
        totalUsers: totalUsers.rows[0].count,
        totalLogsToday: totalLogsToday.rows[0].count,
        totalAdmins: totalAdmins.rows[0].count,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  }
);

router.get(
  "/recent-activity",
  authMiddleware,
  roleMiddleware("admin", "superadmin"),
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          action,
          description,
          created_at
        FROM audit_logs
        ORDER BY created_at DESC
        LIMIT 5
      `);

      res.json(result.rows);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Gagal mengambil aktivitas",
      });
    }
  }
);

router.get(
  "/admin-stats",
  authMiddleware,
  roleMiddleware("admin", "superadmin"),

  async (req, res) => {
    try {
      const totalSiswa = await pool.query(`
        SELECT COUNT(*)
        FROM users
        WHERE role = 'siswa'
      `);

      const totalPengajuan = await pool.query(`
        SELECT COUNT(*)
        FROM pkl_requests
      `);

      const totalMenunggu = await pool.query(`
        SELECT COUNT(*)
        FROM pkl_requests
        WHERE status = 'Menunggu'
      `);

      const totalDisetujui = await pool.query(`
        SELECT COUNT(*)
        FROM pkl_requests
        WHERE status = 'Disetujui'
      `);

      res.json({
        totalSiswa: totalSiswa.rows[0].count,
        totalPengajuan: totalPengajuan.rows[0].count,
        totalMenunggu: totalMenunggu.rows[0].count,
        totalDisetujui: totalDisetujui.rows[0].count,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  }
);

router.get(
  "/aktivitas-pembelajaran",
  authMiddleware,
  roleMiddleware("admin", "superadmin"),
  async (req, res) => {
    try {

      const result =
        await pool.query(`
          SELECT *
          FROM aktivitas_pembelajaran
          ORDER BY created_at DESC
          LIMIT 5
        `);

      res.json(result.rows);

    } catch (error) {

      console.log(error);

      res.status(500).json(error);

    }
  }
);

module.exports = router;