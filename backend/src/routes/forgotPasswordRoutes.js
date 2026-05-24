const express =
  require("express");

const router =
  express.Router();

const pool =
  require("../config/db");

const transporter =
  require("../config/mailer");

router.post(
  "/send-otp",
  async (req, res) => {

    try {

      const { email } =
        req.body;

      const user =
        await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

      if (
        user.rows.length === 0
      ) {

        return res.status(404)
          .json({
            message:
              "Email tidak ditemukan",
          });

      }

      const otp =
        Math.floor(
          100000 +
          Math.random() * 900000
        ).toString();

      const expired =
        new Date(
          Date.now() +
          5 * 60 * 1000
        );

      await pool.query(
        `
        UPDATE users
        SET otp_code = $1,
            otp_expired = $2
        WHERE email = $3
        `,
        [
          otp,
          expired,
          email,
        ]
      );

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to: email,

        subject:
          "OTP Reset Password",

        text:
          `Kode OTP Anda: ${otp}`,

      });

      res.json({
        message:
          "OTP berhasil dikirim",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server error",
      });

    }

  }
);

module.exports = router;