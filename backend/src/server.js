const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const auditRoutes = require("./routes/auditRoutes");
const exportRoutes = require("./routes/exportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");
const userRoutes = require("./routes/userRoutes");
const pklPartnerRoutes = require("./routes/pklPartnerRoutes");
const pklRequestRoutes = require("./routes/pklRequestRoutes");
const nilaiRoutes = require("./routes/nilaiRoutes");

const deleteOldLogs = require("./jobs/deleteOldLogs");

const app = express();

const path = require("path");

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "../../ai-service/uploads"
    )
  )
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/school", schoolRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/forgot-password", forgotPasswordRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pkl-partner", pklPartnerRoutes);
app.use("/api/pkl-request", pklRequestRoutes);
app.use("/api/nilai", nilaiRoutes);


app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected",
      time: result.rows[0],
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

deleteOldLogs();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
