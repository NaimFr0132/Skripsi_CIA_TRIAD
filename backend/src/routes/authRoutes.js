const express = require("express");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const pool = require("../config/db");

const router = express.Router();

router.post(
  "/register",
  async (req, res) => {

    try {

      const {
        username,
        password,
        role,
        email
      } = req.body;

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const result =
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

          RETURNING *
          `,
          [
            username,
            hashedPassword,
            role,
            email
          ]
        );

      res.json(
        result.rows[0]
      );

    } catch (error) {

      res.status(500)
        .json(error);

    }

  }
);

router.post(
  "/login",
  async (req, res) => {

    try {

      const {
        username,
        password
      } = req.body;

      const result =
        await pool.query(
          `
          SELECT *
          FROM users
          WHERE username = $1
          `,
          [username]
        );

      if (
        result.rows.length === 0
      ) {

        return res.status(404)
          .json({
            message:
              "User tidak ditemukan",
          });

      }

      const user =
        result.rows[0];

      const validPassword =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!validPassword) {

        return res.status(401)
          .json({
            message:
              "Password salah",
          });

      }

      const token =
        jwt.sign(
          {
            id: user.id,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );

      await pool.query(
        `
        INSERT INTO audit_logs
        (
          user_id,
          activity,
          ip_address
        )

        VALUES
        (
          $1,
          $2,
          $3
        )
        `,
        [
          user.id,
          "Login ke sistem",
          req.ip,
        ]
      );

      res.json({

        message:
          "Login berhasil",

        token,

        role:
          user.role,

      });

    } catch (error) {

      console.log(error);

      res.status(500)
        .json(error);

    }

  }
);

module.exports = router;