import pool from "./db/db.js";
import app from "./app.js";
import "./jobs/cleanupPasswordResetOtp.job.js"
import { devError, devLog } from "./utils/logger.js";


const port = process.env.PORT || 8080;

process.on("unhandledRejection", (error) => {
  devError("Unhandled Rejection", error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  devError("Uncaught Exception", error);
  process.exit(1);
});

const startServer = async () => {
  try {
    // DB connection test
    await pool.query("SELECT 1");
    devLog("✅ MySQL connected");

    // start server only after DB is confirmed
    app.listen(port, () => {
      devLog(`⚙️ Server running at http://localhost:${port}`);
    });
  } catch (error) {
    devError("❌ MySQL connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
