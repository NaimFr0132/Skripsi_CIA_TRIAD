const express = require("express");

const pool = require("../config/db");

const authMiddleware =
  require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");

const createAuditLog =
  require("../utils/createAuditLog");

const router =
  express.Router();

router.use(authMiddleware);

router.use(
  roleMiddleware("superadmin")
);
router.get("/all", async (req, res) => {

  try {

    const result =
      await pool.query(
        `
        SELECT *
        FROM pkl_partners
        ORDER BY id DESC
        `
      );

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json(error);

  }

});

router.post("/create", async (req, res) => {

  try {

    const {
      nama_perusahaan,
      alamat,
      kuota,
      kontak,
      bidang_industri,
    } = req.body;

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
        kuota,
        kontak,
        bidang_industri,
      ]
    );

    await createAuditLog({

      user_id: 1,

      activity:
        `Menambahkan mitra PKL ${nama_perusahaan}`,

      ip_address:
        req.ip,

    });

    res.json({
      message:
        "Mitra PKL berhasil ditambahkan",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json(error);

  }

});

router.delete("/delete/:id", async (req, res) => {

  try {

    const { id } =
      req.params;

    const partnerData =
      await pool.query(
        `
        SELECT *
        FROM pkl_partners
        WHERE id = $1
        `,
        [id]
      );

    const partner =
      partnerData.rows[0];

    await pool.query(
      `
      DELETE FROM pkl_partners
      WHERE id = $1
      `,
      [id]
    );

    await createAuditLog({

      user_id: 1,

      activity:
        `Menghapus mitra PKL ${partner.nama_perusahaan}`,

      ip_address:
        req.ip,

    });

    res.json({
      message:
        "Mitra PKL berhasil dihapus",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json(error);

  }

});

module.exports = router;