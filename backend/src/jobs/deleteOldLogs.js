const cron = require("node-cron");

const pool = require("../config/db");

const deleteOldLogs = () => {

  cron.schedule("0 0 * * *", async () => {

    try {

      await pool.query(`
        DELETE FROM audit_logs
        WHERE created_at < NOW() - INTERVAL '3 months'
      `);

      console.log("Audit log lama berhasil dihapus");

    } catch (error) {

      console.log(error);

    }

  });

};

module.exports = deleteOldLogs;