import express from "express";

import {
  createWorkoutPlan,
  getWorkoutPlans,
  getWorkoutPlanById,
  getCurrentWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  logWorkout,
  getWorkoutLogs,
} from "../controllers/workout.controller.js";

import {
  auth,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/*
==========================================
Workout Plan Routes
==========================================
*/

// Create Workout Plan
router.post(
  "/plan",
  auth,
  authorize("admin", "trainer"),
  createWorkoutPlan
);

// Get All Workout Plans
router.get(
  "/plan",
  auth,
  authorize("admin", "trainer"),
  getWorkoutPlans
);

// Get Current Workout Plan
router.get(
  "/plan/current",
  auth,
  authorize("member"),
  getCurrentWorkoutPlan
);

// Get Workout Plan By ID
router.get(
  "/plan/:id",
  auth,
  authorize("admin", "trainer", "member"),
  getWorkoutPlanById
);

// Update Workout Plan
router.put(
  "/plan/:id",
  auth,
  authorize("admin", "trainer"),
  updateWorkoutPlan
);

// Delete Workout Plan
router.delete(
  "/plan/:id",
  auth,
  authorize("admin"),
  deleteWorkoutPlan
);

/*
==========================================
Workout Log Routes
==========================================
*/

// Log Workout
router.post(
  "/log",
  auth,
  authorize("member"),
  logWorkout
);

// Get Workout Logs
router.get(
  "/logs",
  auth,
  authorize("admin", "trainer", "member"),
  getWorkoutLogs
);

export default router;