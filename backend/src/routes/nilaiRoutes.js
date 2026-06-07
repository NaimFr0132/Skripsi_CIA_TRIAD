const express = require("express");

const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const createAuditLog = require("../utils/createAuditLog");
const createAktivitasPembelajaran = require("../utils/createAktivitasPembelajaran");
const router = express.Router();

router.use(authMiddleware);

router.post(
  "/create",
  roleMiddleware("admin", "superadmin"),
  async (req, res) => {
    try {
      const { siswa_id, mata_pelajaran, nilai_akhir, kompetensi, semester } =
        req.body;

      const existingNilai = await pool.query(
        `
        SELECT *
        FROM nilai_siswa
        WHERE siswa_id = $1
        AND mata_pelajaran = $2
        AND semester = $3
        `,
        [siswa_id, mata_pelajaran, semester],
      );

      if (existingNilai.rows.length > 0) {
        return res.status(400).json({
          message: "Nilai mata pelajaran ini sudah ada pada semester tersebut",
        });
      }

      await pool.query(
        `
        INSERT INTO nilai_siswa
        (
          siswa_id,
          mata_pelajaran,
          nilai_akhir,
          kompetensi,
          semester
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
        [siswa_id, mata_pelajaran, nilai_akhir, kompetensi, semester],
      );
      await createAktivitasPembelajaran(
        "Input Nilai",
        `${mata_pelajaran} berhasil ditambahkan`,
      );

      await createAuditLog({
        user_id: req.user.id,

        role: req.user.role,

        action: "CREATE_NILAI",

        description: `Menambahkan nilai ${mata_pelajaran}`,

        severity: "medium",

        status: "success",

        ip_address: req.ip,

        user_agent: req.headers["user-agent"],
      });

      res.json({
        message: "Nilai berhasil disimpan",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Gagal menyimpan nilai",
      });
    }
  },
);

router.get(
  "/students",
  roleMiddleware("admin", "superadmin"),
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          id,
          username,
          nama_lengkap,
          kelas,
          semester
        FROM users
        WHERE role = 'siswa'
        ORDER BY nama_lengkap ASC
        `,
      );

      res.json(result.rows);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Gagal mengambil data siswa",
      });
    }
  },
);

router.get(
  "/rapor/:siswaId",
  roleMiddleware("admin", "superadmin"),
  async (req, res) => {
    try {
      const { siswaId } = req.params;

      const result = await pool.query(
        `
        SELECT *
        FROM nilai_siswa
        WHERE siswa_id = $1
        ORDER BY semester DESC
        `,
        [siswaId],
      );

      res.json(result.rows);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Gagal mengambil rapor",
      });
    }
  },
);

router.get("/my-rapor", roleMiddleware("siswa"), async (req, res) => {
  try {
    console.log("===== MY RAPOR =====");
    console.log(req.user);

    const userId = req.user.id;

    const result = await pool.query(
      `
        SELECT
          mata_pelajaran,
          nilai_akhir,
          kompetensi,
          semester,
          created_at
        FROM nilai_siswa
        WHERE siswa_id = $1
        ORDER BY semester DESC,
        mata_pelajaran ASC
        `,
      [userId],
    );

    const rataRata =
      result.rows.length > 0
        ? (
            result.rows.reduce(
              (total, item) => total + Number(item.nilai_akhir),
              0,
            ) / result.rows.length
          ).toFixed(2)
        : 0;

    res.json({
      user_id: userId,
      jumlah_nilai: result.rows.length,
      nilai: result.rows,
      rata_rata: rataRata,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Gagal mengambil rapor",
    });
  }
});

router.get("/all", roleMiddleware("admin", "superadmin"), async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT
        n.id,
        n.siswa_id,
        u.nama_lengkap,
        u.kelas,
        n.mata_pelajaran,
        n.nilai_akhir,
        n.kompetensi,
        n.semester

      FROM nilai_siswa n

      JOIN users u
      ON n.siswa_id = u.id

      ORDER BY n.id DESC
      `);

    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Gagal mengambil data nilai",
    });
  }
});

router.put(
  "/update/:id",
  roleMiddleware("admin", "superadmin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const { mata_pelajaran, nilai_akhir, kompetensi } = req.body;

      await pool.query(
        `
        UPDATE nilai_siswa
        SET
          mata_pelajaran = $1,
          nilai_akhir = $2,
          kompetensi = $3
        WHERE id = $4
        `,
        [mata_pelajaran, nilai_akhir, kompetensi, id],
      );

      await createAuditLog({
        user_id: req.user.id,

        role: req.user.role,

        action: "UPDATE_NILAI",

        description: `Mengubah nilai ${mata_pelajaran}`,

        severity: "medium",

        status: "success",

        ip_address: req.ip,

        user_agent: req.headers["user-agent"],
      });

      res.json({
        message: "Nilai berhasil diperbarui",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Gagal update nilai",
      });
    }
  },
);

router.delete(
  "/delete/:id",
  roleMiddleware("admin", "superadmin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const nilaiData = await pool.query(
        `
        SELECT *
        FROM nilai_siswa
        WHERE id = $1
        `,
        [id],
      );

      if (nilaiData.rows.length === 0) {
        return res.status(404).json({
          message: "Data nilai tidak ditemukan",
        });
      }

      const nilai = nilaiData.rows[0];

      await pool.query(
        `
        DELETE FROM nilai_siswa
        WHERE id = $1
        `,
        [id],
      );

      await createAuditLog({
        user_id: req.user.id,

        role: req.user.role,

        action: "DELETE_NILAI",

        description: `Menghapus nilai ${nilai.mata_pelajaran}`,

        severity: "high",

        status: "success",

        ip_address: req.ip,

        user_agent: req.headers["user-agent"],
      });

      res.json({
        message: "Nilai berhasil dihapus",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Gagal menghapus nilai",
      });
    }
  },
);

module.exports = router;
