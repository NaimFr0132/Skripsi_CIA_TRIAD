const express = require("express");

const pool = require("../config/db");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const createAuditLog = require("../utils/createAuditLog");

const router = express.Router();

router.use(authMiddleware);

router.get("/all", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM pkl_partners
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Gagal mengambil data mitra PKL",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM pkl_partners
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Partner tidak ditemukan",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Gagal mengambil data partner",
    });
  }
});

router.post(
  "/create",
  roleMiddleware("superadmin"),
  async (req, res) => {
    try {
      const {
        nama_perusahaan,
        alamat,
        kuota,
        kontak,
        bidang_industri,
      } = req.body;

      if (
        !nama_perusahaan ||
        !alamat ||
        !kuota ||
        !kontak ||
        !bidang_industri
      ) {
        return res.status(400).json({
          message: "Semua field wajib diisi",
        });
      }

      await pool.query(
        `
        INSERT INTO pkl_partners
        (
          nama_perusahaan,
          alamat,
          kuota,
          kontak,
          bidang_industri
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5
        )
        `,
        [
          nama_perusahaan,
          alamat,
          Number(kuota),
          kontak,
          bidang_industri,
        ]
      );

      await createAuditLog({
        user_id: req.user.id,
        role: req.user.role,
        action: "CREATE_PKL_PARTNER",
        description: `Menambahkan mitra PKL ${nama_perusahaan}`,
        severity: "medium",
        status: "success",
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
      });

      res.json({
        message: "Mitra PKL berhasil ditambahkan",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Gagal menambahkan mitra PKL",
      });
    }
  }
);

router.delete(
  "/delete/:id",
  roleMiddleware("superadmin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const partnerData = await pool.query(
        `
        SELECT *
        FROM pkl_partners
        WHERE id = $1
        `,
        [id]
      );

      if (partnerData.rows.length === 0) {
        return res.status(404).json({
          message: "Mitra PKL tidak ditemukan",
        });
      }

      const partner = partnerData.rows[0];

      await pool.query(
        `
        DELETE FROM pkl_partners
        WHERE id = $1
        `,
        [id]
      );

      await createAuditLog({
        user_id: req.user.id,
        role: req.user.role,
        action: "DELETE_PKL_PARTNER",
        description: `Menghapus mitra PKL ${partner.nama_perusahaan}`,
        severity: "high",
        status: "success",
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
      });

      res.json({
        message: "Mitra PKL berhasil dihapus",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Gagal menghapus mitra PKL",
      });
    }
  }
);

router.put(
  "/update/:id",
  roleMiddleware("superadmin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nama_perusahaan,
        alamat,
        kuota,
        kontak,
        bidang_industri,
      } = req.body;

      const partnerData = await pool.query(
        `
        SELECT *
        FROM pkl_partners
        WHERE id = $1
        `,
        [id]
      );

      if (partnerData.rows.length === 0) {
        return res.status(404).json({
          message: "Mitra PKL tidak ditemukan",
        });
      }

      const partner = partnerData.rows[0];

      await pool.query(
        `
        UPDATE pkl_partners
        SET
          nama_perusahaan = $1,
          alamat = $2,
          kuota = $3,
          kontak = $4,
          bidang_industri = $5
        WHERE id = $6
        `,
        [
          nama_perusahaan,
          alamat,
          Number(kuota),
          kontak,
          bidang_industri,
          id,
        ]
      );

      await createAuditLog({
        user_id: req.user.id,
        role: req.user.role,
        action: "UPDATE_PKL_PARTNER",
        description: `Mengubah data mitra PKL ${nama_perusahaan}`,
        severity: "medium",
        status: "success",
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
      });

      res.json({
        message: "Data mitra PKL berhasil diperbarui",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Gagal memperbarui data mitra PKL",
      });
    }
  }
);
module.exports = router;