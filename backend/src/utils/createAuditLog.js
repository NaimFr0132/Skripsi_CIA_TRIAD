const pool =
  require("../config/db");

const createAuditLog =
  async ({
    user_id = null,
    role = null,
    action,
    description = null,
    severity = "low",
    status = "success",
    ip_address = null,
    user_agent = null,
    snapshot_image = null,
  }) => {

    try {

      await pool.query(
        `
        INSERT INTO audit_logs
        (
          user_id,
          role,
          action,
          description,
          severity,
          status,
          ip_address,
          user_agent,
          snapshot_image
        )

        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        `,
        [
          user_id,
          role,
          action,
          description,
          severity,
          status,
          ip_address,
          user_agent,
          snapshot_image,
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