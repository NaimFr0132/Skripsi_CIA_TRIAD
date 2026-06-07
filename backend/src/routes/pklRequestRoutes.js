const express = require("express");

const pool = require("../config/db");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const createAuditLog = require("../utils/createAuditLog");

const createAktivitasPembelajaran = require("../utils/createAktivitasPembelajaran");

const router = express.Router();

router.use(authMiddleware);
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        pkl_requests.*,
        pkl_partners.nama_perusahaan,
        users.nama_lengkap AS siswa_nama

      FROM pkl_requests

      JOIN pkl_partners
      ON pkl_requests.partner_id = pkl_partners.id

      JOIN users
      ON pkl_requests.siswa_id = users.id

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

    const existingRequest = await pool.query(
      `
      SELECT *
      FROM pkl_requests
      WHERE siswa_id = $1
      AND status IN ('Menunggu', 'Disetujui')
      `,
      [req.user.id],
    );

    if (existingRequest.rows.length > 0) {
      return res.status(400).json({
        message: "Anda masih memiliki pengajuan PKL aktif",
      });
    }

    await pool.query(
      `
      INSERT INTO pkl_requests
      (
        siswa_id,
        siswa_nama,
        partner_id,
        status
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4
      )
      `,
      [req.user.id, req.user.username, partner_id, "Menunggu"],
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
    console.log("USER LOGIN:", req.user);
    await createAktivitasPembelajaran(
      "Pengajuan PKL",
      `${req.user.username} mengajukan PKL`,
    );

    res.json({
      message: "Pengajuan PKL berhasil dibuat",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Gagal membuat pengajuan PKL",
    });
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

    if (requestData.rows.length === 0) {
      return res.status(404).json({
        message: "Pengajuan tidak ditemukan",
      });
    }

    const request = requestData.rows[0];

    if (request.status === "Disetujui") {
      return res.status(400).json({
        message: "Pengajuan sudah disetujui sebelumnya",
      });
    }

    const existingApproved = await pool.query(
      `
      SELECT *
      FROM pkl_requests
      WHERE siswa_id = $1
      AND status = 'Disetujui'
      `,
      [request.siswa_id],
    );

    if (existingApproved.rows.length > 0) {
      return res.status(400).json({
        message: "Siswa sudah diterima di tempat PKL lain",
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

    if (partnerData.rows.length === 0) {
      return res.status(404).json({
        message: "Mitra PKL tidak ditemukan",
      });
    }

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

    await pool.query(
      `
      UPDATE users
      SET partner_pkl_id = $1
      WHERE id = $2
      `,
      [request.partner_id, request.siswa_id],
    );

    await createAuditLog({
      user_id: req.user.id,

      role: req.user.role,

      action: "APPROVE_PKL_REQUEST",

      description: `Menyetujui PKL siswa ${request.siswa_nama}`,

      severity: "high",

      status: "success",

      ip_address: req.ip,

      user_agent: req.headers["user-agent"],
    });

    await createAktivitasPembelajaran(
      "Validasi PKL",
      `${request.siswa_nama} disetujui PKL`,
    );

    res.json({
      message: "Pengajuan disetujui",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Gagal menyetujui pengajuan PKL",
    });
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

    if (requestData.rows.length === 0) {
      return res.status(404).json({
        message: "Pengajuan tidak ditemukan",
      });
    }

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
      user_id: req.user.id,
      role: req.user.role,
      action: "REJECT_PKL_REQUEST",
      description: `Menolak PKL siswa ${request.siswa_nama}`,
      severity: "high",
      status: "success",
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
    });

    await createAktivitasPembelajaran(
      "Validasi PKL",
      `${request.siswa_nama} ditolak PKL`,
    );

    res.json({
      message: "Pengajuan ditolak",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Gagal menolak pengajuan PKL",
    });
  }
});

router.get("/student", async (req, res) => {
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

      WHERE pkl_requests.siswa_id = $1

      ORDER BY pkl_requests.id DESC
      `,
      [req.user.id],
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
});

module.exports = router;
