const express =
  require("express");

const pool =
  require("../config/db");

const authMiddleware =
  require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");

const router =
  express.Router();

router.get(
  "/all",
  authMiddleware,
  roleMiddleware(
    "superadmin"
  ),

  async (req, res) => {

    try {

      const result =
        await pool.query(
          `
          SELECT
            id,
            username,
            role,
            email,
            created_at

          FROM users

          ORDER BY id ASC
          `
        );

      res.json(
        result.rows
      );

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