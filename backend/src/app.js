import express from "express";
import { helmetMiddleware } from "./middlewares/security/hemet.middleware.js";
import { corsMiddleware } from "./middlewares/security/cors.middleware.js";
import { globalRateLimiter } from "./middlewares/security/globalRateLimit.middleware.js";
import { hppProtection } from "./middlewares/security/hpp.middleware.js";
import { enforceContentType } from "./middlewares/security/contentType.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { methodGuard } from "./middlewares/security/method.middleware.js";
import { queryLimitGuard } from "./middlewares/security/queryLimit.middleware.js";
import { noCache } from "./middlewares/security/cacheControl.middleware.js";
import { safeRedirectGuard } from "./middlewares/security/redirect.middleware.js";
import { JSON_LIMIT } from "./constants.js";
import cookieParser from "cookie-parser";

const app = express();

// hide fingerprint
app.disable("x-powered-by");

// core http security
app.use(helmetMiddleware);
app.use(corsMiddleware);

// parsing
app.use(cookieParser());
app.use(express.json({ limit: JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: JSON_LIMIT }));

// request sanity checks
app.use(methodGuard);
app.use(queryLimitGuard);
app.use(hppProtection);
app.use(enforceContentType);

// abuse prevention
app.use(globalRateLimiter);

// response safety
app.use(noCache);
app.use(safeRedirectGuard);

// routes import
import authRoutes from "./routes/auth.routes.js";
import noticeRoutes from "./routes/noticeBoardNotice.routes.js";
import categoryRoutes from "./routes/category.routes.js";

app.use("/api/v1/noticeboard/notices", noticeRoutes);
app.use("/api/v1/noticeboard/categories", categoryRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(errorMiddleware);

export default app;
