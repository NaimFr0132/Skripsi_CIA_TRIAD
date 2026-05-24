const express =
  require("express");

const bcrypt =
  require("bcrypt");

const pool =
  require("../config/db");

const router =
  express.Router();

router.get(
  "/all",
  async (req, res) => {

    try {

      const result =
        await pool.query(
          `
          SELECT
            id,
            username,
            role,
            email

          FROM users

          ORDER BY id ASC
          `
        );

      res.json(
        result.rows
      );

    } catch (error) {

      console.log(error);

      res.status(500)
        .json(error);

    }

  }
);

router.post(
  "/create-admin",
  async (req, res) => {

    try {

      const {
        username,
        password,
        email
      } = req.body;

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

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
        [
          username,
          hashedPassword,
          "admin1",
          email
        ]
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
          1,
          `Menambahkan admin ${username}`,
          req.ip
        ]
      );

      res.json({
        message:
          "Admin berhasil dibuat"
      });

    } catch (error) {

      console.log(error);

      res.status(500)
        .json(error);

    }

  }
);

router.delete(
  "/delete/:id",
  async (req, res) => {

    try {

      const {
        id
      } = req.params;

      const userResult =
        await pool.query(
          `
          SELECT *
          FROM users
          WHERE id = $1
          `,
          [id]
        );

      const deletedUser =
        userResult.rows[0];

      await pool.query(
        `
        DELETE FROM users
        WHERE id = $1
        `,
        [id]
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
          1,
          `Menghapus user ${deletedUser.username}`,
          req.ip
        ]
      );

      res.json({
        message:
          "User berhasil dihapus"
      });

    } catch (error) {

      console.log(error);

      res.status(500)
        .json(error);

    }

  }
);

module.exports = router;