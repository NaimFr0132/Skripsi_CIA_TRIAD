const express = require("express");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const pool = require("../config/db");

const createAuditLog = require("../utils/createAuditLog");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password, role, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
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

          RETURNING *
          `,
      [username, hashedPassword, role, email],
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      `
          SELECT *
          FROM users
          WHERE username = $1
          `,
      [username],
    );

    if (result.rows.length === 0) {
      await createAuditLog({
        user_id: null,

        role: "unknown",

        action: "LOGIN_FAILED",

        description: `Login gagal. Username ${username} tidak ditemukan`,

        severity: "high",

        status: "failed",

        ip_address: req.ip,

        user_agent: req.headers["user-agent"],
      });

      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      await createAuditLog({
        user_id: user.id,

        role: user.role,

        action: "LOGIN_BLOCKED",

        description: `${user.username} mencoba login tetapi akun nonaktif`,

        severity: "high",

        status: "blocked",

        ip_address: req.ip,

        user_agent: req.headers["user-agent"],
      });

      return res.status(403).json({
        message: "Akun dinonaktifkan",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      await createAuditLog({
        user_id: user.id,

        role: user.role,

        action: "LOGIN_FAILED",

        description: `${user.username} gagal login. Password salah`,

        severity: "high",

        status: "failed",

        ip_address: req.ip,

        user_agent: req.headers["user-agent"],
      });

      return res.status(401).json({
        message: "Password salah",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    await createAuditLog({
      user_id: user.id,

      role: user.role,

      action: "LOGIN_SUCCESS",

      description: `${user.username} login ke sistem`,

      severity: "low",

      status: "success",

      ip_address: req.ip,

      user_agent: req.headers["user-agent"],
    });

    res.json({
      message: "Login berhasil",

      token,

      role: user.role,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
});

router.put(
  "/toggle-active/:id",
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const userResult =
        await pool.query(
          `
          SELECT *
          FROM users
          WHERE id = $1
          `,
          [id]
        );

      if (
        userResult.rows.length === 0
      ) {

        return res.status(404)
          .json({
            message:
              "User tidak ditemukan",
          });

      }

      const user =
        userResult.rows[0];

      const newStatus =
        !user.is_active;

      await pool.query(
        `
        UPDATE users
        SET is_active = $1
        WHERE id = $2
        `,
        [
          newStatus,
          id,
        ]
      );

      await createAuditLog({

        user_id:
          req.user.id,

        role:
          req.user.role,

        action:
          "TOGGLE_USER_STATUS",

        description:
          `${req.user.role} mengubah status akun ${user.username} menjadi ${newStatus ? "aktif" : "nonaktif"}`,

        severity:
          "high",

        status:
          "success",

        ip_address:
          req.ip,

        user_agent:
          req.headers["user-agent"],

      });

      res.json({

        message:
          `Status user berhasil diubah menjadi ${newStatus ? "aktif" : "nonaktif"}`,

      });

    } catch (error) {

      console.log(error);

      res.status(500)
        .json(error);

    }

  }
);

module.exports = router;
