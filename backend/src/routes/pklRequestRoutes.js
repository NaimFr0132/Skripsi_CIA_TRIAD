const express = require("express");

const pool = require("../config/db");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const createAuditLog = require("../utils/createAuditLog");

const router = express.Router();

router.use(authMiddleware);
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT
          pkl_requests.*,
          pkl_partners.nama_perusahaan

        FROM pkl_requests

        JOIN pkl_partners
        ON pkl_requests.partner_id =
        pkl_partners.id

        ORDER BY pkl_requests.id DESC
        `,
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
});

router.use("/create", roleMiddleware("siswa"));

router.use("/student", roleMiddleware("siswa"));

router.use("/approve", roleMiddleware("admin", "superadmin"));

router.use("/reject", roleMiddleware("admin", "superadmin"));

router.post("/create", async (req, res) => {
  try {
    const { partner_id } = req.body;

    await pool.query(
      `
      INSERT INTO pkl_requests
      [
        req.user.id,
        req.user.username,
        partner_id,
      ]

      VALUES
      (
        $1,
        $2
      )
      `,
      [siswa_nama, partner_id],
    );

    await createAuditLog({
      user_id: req.user.id,

      role: req.user.role,

      action: "CREATE_PKL_REQUEST",

      description: `${req.user.username} mengajukan PKL`,

      severity: "medium",

      status: "success",

      ip_address: req.ip,

      user_agent: req.headers["user-agent"],
    });

    res.json({
      message: "Pengajuan PKL berhasil dibuat",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
});

router.put("/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const requestData = await pool.query(
      `
          SELECT *
          FROM pkl_requests
          WHERE id = $1
          `,
      [id],
    );

    const request = requestData.rows[0];

    const existingApproved = await pool.query(
      `
          SELECT *
          FROM pkl_requests
          WHERE siswa_nama = $1
          AND status = 'Disetujui'
          `,
      [request.siswa_nama],
    );

    if (existingApproved.rows.length > 0) {
      return res.status(400).json({
        message: "Siswa sudah diterima di tempat PKL lain",
      });
    }

    if (!request) {
      return res.status(404).json({
        message: "Pengajuan tidak ditemukan",
      });
    }

    const partnerData = await pool.query(
      `
          SELECT *
          FROM pkl_partners
          WHERE id = $1
          `,
      [request.partner_id],
    );

    const partner = partnerData.rows[0];

    if (partner.kuota <= 0) {
      return res.status(400).json({
        message: "Kuota PKL sudah penuh",
      });
    }

    await pool.query(
      `
        UPDATE pkl_requests
        SET status = 'Disetujui'
        WHERE id = $1
        `,
      [id],
    );

    await pool.query(
      `
        UPDATE pkl_partners
        SET kuota = kuota - 1
        WHERE id = $1
        `,
      [request.partner_id],
    );

    await createAuditLog({
      user_id: 1,

      activity: `Menyetujui PKL siswa ${request.siswa_nama}`,

      ip_address: req.ip,
    });

    res.json({
      message: "Pengajuan disetujui",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
});

router.put("/reject/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const requestData = await pool.query(
      `
        SELECT *
        FROM pkl_requests
        WHERE id = $1
        `,
      [id],
    );

    const request = requestData.rows[0];

    await pool.query(
      `
      UPDATE pkl_requests
      SET status = 'Ditolak'
      WHERE id = $1
      `,
      [id],
    );

    await createAuditLog({
      user_id: 1,

      activity: `Menolak PKL siswa ${request.siswa_nama}`,

      ip_address: req.ip,
    });

    res.json({
      message: "Pengajuan ditolak",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
});

router.get("/student/:nama", async (req, res) => {
  try {
    const { nama } = req.params;

    const result = await pool.query(
      `
          SELECT
            pkl_requests.*,
            pkl_partners.nama_perusahaan

          FROM pkl_requests

          JOIN pkl_partners
          ON pkl_requests.partner_id =
          pkl_partners.id

          WHERE siswa_nama = $1

          ORDER BY pkl_requests.id DESC
          `,
      [nama],
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
});

module.exports = router;
