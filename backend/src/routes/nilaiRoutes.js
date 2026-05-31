const express = require("express");

const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/create",
  roleMiddleware("admin", "superadmin"),
  async (req, res) => {
    try {
      const {
        siswa_id,
        mata_pelajaran,
        nilai_akhir,
        kompetensi,
        semester,
      } = req.body;

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
        [
          siswa_id,
          mata_pelajaran,
          nilai_akhir,
          kompetensi,
          semester,
        ]
      );

      res.json({
        message: "Nilai berhasil disimpan",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Gagal menyimpan nilai",
      });
    }
  }
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
        `
      );

      res.json(result.rows);
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  }
);

router.get(
  "/rapor/:siswaId",
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
        [siswaId]
      );

      res.json(result.rows);
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  }
);

module.exports = router;