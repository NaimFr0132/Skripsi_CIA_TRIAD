const pool = require("../config/db");

const auditMiddleware = (activity) => {
  return async (req, res, next) => {
    try {
      await pool.query(
        `
        INSERT INTO audit_logs 
        (user_id, activity, ip_address)
        VALUES ($1, $2, $3)
        `,
        [
          req.user.id,
          activity,
          req.ip,
        ]
      );

      next();
    } catch (error) {
      console.log(error);
      next();
    }
  };
};

module.exports = auditMiddleware;