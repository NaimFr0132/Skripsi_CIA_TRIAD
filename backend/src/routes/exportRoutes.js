const express = require("express");

const ExcelJS = require("exceljs");

const pool = require("../config/db");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/audit/download",
  authMiddleware,
  roleMiddleware("superadmin"),
  async (req, res) => {

    try {

      const result = await pool.query(`
        SELECT 
          audit_logs.id,
          users.username,
          audit_logs.activity,
          audit_logs.ip_address,
          audit_logs.created_at
        FROM audit_logs
        JOIN users
        ON audit_logs.user_id = users.id
        ORDER BY audit_logs.created_at DESC
      `);

      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet("Audit Log");

      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "User", key: "username", width: 20 },
        { header: "Activity", key: "activity", width: 40 },
        { header: "IP Address", key: "ip_address", width: 20 },
        { header: "Tanggal", key: "created_at", width: 30 },
      ];

      result.rows.forEach((row) => {
        worksheet.addRow(row);
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=audit-log.xlsx"
      );

      await workbook.xlsx.write(res);

      res.end();

    } catch (error) {

      res.status(500).json(error);

    }
  }
);

module.exports = router;