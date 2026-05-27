const pool =
  require("../config/db");

const createAuditLog =
  async ({
    user_id,
    activity,
    ip_address = null,
    image_path = null,
  }) => {

    try {

      await pool.query(
        `
        INSERT INTO audit_logs
        (
          user_id,
          activity,
          image_path,
          ip_address
        )

        VALUES ($1, $2, $3, $4)
        `,
        [
          user_id,
          activity,
          image_path,
          ip_address,
        ]
      );

    } catch (error) {

      console.log(
        "Audit Log Error:",
        error
      );

    }

  };

module.exports =
  createAuditLog;