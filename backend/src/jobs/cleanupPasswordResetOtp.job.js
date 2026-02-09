import cron from "node-cron";
import pool from "../db/db.js";
import {
  PASSWORD_RESET_OTP_RETENTION_DAYS,
  PASSWORD_RESET_OTP_CLEANUP_CRON,
} from "../constants.js";
import { devError, devLog } from "../utils/logger.js";

// Disable job during tests
if (process.env.NODE_ENV === "test") {
  devLog("🧪 OTP cleanup job disabled in test environment");
} else {
  cron.schedule(PASSWORD_RESET_OTP_CLEANUP_CRON, async () => {
    try {
      const [result] = await pool.query(
        `DELETE FROM password_reset_otp
        WHERE expires_at < NOW() - INTERVAL ? DAY`,
        [PASSWORD_RESET_OTP_RETENTION_DAYS]
      );

      devLog(`🧹 Password reset OTP cleanup: ${result.affectedRows} rows deleted`);
    } catch (error) {
      devError("❌ Password reset OTP cleanup job failed:", error);
    }
  });
}
