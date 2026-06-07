const pool = require("../config/db");

const createAktivitasPembelajaran = async (
  aktivitas,
  deskripsi,
) => {
  try {
    await pool.query(
      `
      INSERT INTO aktivitas_pembelajaran
      (
        aktivitas,
        deskripsi
      )

      VALUES
      (
        $1,
        $2
      )
      `,
      [aktivitas, deskripsi],
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports =
  createAktivitasPembelajaran;