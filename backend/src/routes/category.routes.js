import { Router } from "express";
import { getCategories } from "../controllers/category.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router()

router.route("/").get(getCategories)

// PROTECTED ROUTES (Admin / Professor)

// Create category
// router.post(
//   "/",
//   requireAuth,
//   requireRole("ADMIN"),
//   createCategory
// );

// Update category (rename / activate / deactivate)
// router.patch(
//   "/:id",
//   requireAuth,
//   requireRole("ADMIN"),
//   updateCategory
// );

export default router;