import express from "express";

import {
  createDietPlan,
  getDietPlans,
  getDietPlanById,
  updateDietPlan,
  deleteDietPlan,
  getMemberDietPlan,
} from "../controllers/diet.controller.js";

import {
  auth,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/*
==========================================
Diet Plans
==========================================
*/

// Create Diet Plan
router.post(
  "/",
  auth,
  authorize("admin", "trainer"),
  createDietPlan
);

// Get All Diet Plans
router.get(
  "/",
  auth,
  authorize("admin", "trainer"),
  getDietPlans
);

// Get Member Active Diet Plan
router.get(
  "/member/:memberId",
  auth,
  authorize("admin", "trainer", "member"),
  getMemberDietPlan
);

// Get Diet Plan By ID
router.get(
  "/:id",
  auth,
  authorize("admin", "trainer", "member"),
  getDietPlanById
);

// Update Diet Plan
router.put(
  "/:id",
  auth,
  authorize("admin", "trainer"),
  updateDietPlan
);

// Delete Diet Plan
router.delete(
  "/:id",
  auth,
  authorize("admin"),
  deleteDietPlan
);

export default router;