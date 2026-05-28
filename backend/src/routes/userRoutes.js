const express = require("express");

const bcrypt = require("bcrypt");

const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const createAuditLog = require("../utils/createAuditLog");
const router = express.Router();
router.use(authMiddleware);

router.use(roleMiddleware("superadmin"));
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query(
      `
          SELECT
            id,
            username,
            role,
            email,
            nama_lengkap,
            kelas,
            nisn,
            is_active,
            created_at

          FROM users

          ORDER BY id ASC
          `,
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
});

router.post("/create-admin", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `
        INSERT INTO users
        (
          username,
          password,
          role,
          email
        )

        VALUES
        (
          $1,
          $2,
          $3,
          $4
        )
        `,
      [username, hashedPassword, "admin", email],
    );

    await createAuditLog({
      user_id: req.user.id,

      role: req.user.role,

      action: "CREATE_ADMIN",

      description: `Menambahkan admin ${username}`,

      severity: "medium",

      status: "success",

      ip_address: req.ip,

      user_agent: req.headers["user-agent"],
    });

    res.json({
      message: "Admin berhasil dibuat",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { username } = req.body;

    await pool.query(
      `
      UPDATE users
      SET username = $1
      WHERE id = $2
      `,
      [username, id],
    );

    await createAuditLog({
      user_id: req.user.id,

      role: req.user.role,

      action: "UPDATE_USER",

      description: `Mengupdate user ${username}`,

      severity: "medium",

      status: "success",

      ip_address: req.ip,

      user_agent: req.headers["user-agent"],
    });

    res.json({
      message: "Admin berhasil diupdate",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await pool.query(
      `
          SELECT *
          FROM users
          WHERE id = $1
          `,
      [id],
    );

    const deletedUser = userResult.rows[0];

    await pool.query(
      `
        DELETE FROM users
        WHERE id = $1
        `,
      [id],
    );

    await createAuditLog({
      user_id: req.user.id,

      role: req.user.role,

      action: "DELETE_USER",

      description: `Menghapus user ${deletedUser.username}`,

      severity: "high",

      status: "success",

      ip_address: req.ip,

      user_agent: req.headers["user-agent"],
    });

    res.json({
      message: "User berhasil dihapus",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
});

router.post("/create-student", async (req, res) => {
  try {
    const {
      username,

      password,

      nama_lengkap,

      kelas,

      nisn,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `
      INSERT INTO users
      (
        username,
        password,
        role,
        nama_lengkap,
        kelas,
        nisn
      )

      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
      `,
      [username, hashedPassword, "siswa", nama_lengkap, kelas, nisn],
    );

    await createAuditLog({
      user_id: req.user.id,

      role: req.user.role,

      action: "CREATE_STUDENT",

      description: `Menambahkan siswa ${username}`,

      severity: "medium",

      status: "success",

      ip_address: req.ip,

      user_agent: req.headers["user-agent"],
    });

    res.json({
      message: "Siswa berhasil ditambahkan",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
});

router.put("/toggle-active/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await pool.query(
      `
          SELECT *
          FROM users
          WHERE id = $1
          `,
      [id],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const user = userResult.rows[0];

    const newStatus = !user.is_active;

    await pool.query(
      `
        UPDATE users
        SET is_active = $1
        WHERE id = $2
        `,
      [newStatus, id],
    );

    await createAuditLog({
      user_id: req.user.id,

      role: req.user.role,

      action: "TOGGLE_USER_STATUS",

      description: `${req.user.username || req.user.role} mengubah status akun ${user.username} menjadi ${newStatus ? "aktif" : "nonaktif"}`,

      severity: "high",

      status: "success",

      ip_address: req.ip,

      user_agent: req.headers["user-agent"],
    });

    res.json({
      message: `Status user berhasil diubah menjadi ${newStatus ? "aktif" : "nonaktif"}`,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
});

module.exports = router;
