import express from "express";

import {
  createExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
  getByMuscleGroup,
  getByDifficulty,
  searchExercise,
} from "../controllers/exercise.controller.js";

import {
  auth,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/*
==========================================
Public / Logged-in Users
==========================================
*/

// Get All Exercises
router.get("/", auth, getAllExercises);

// Search Exercise
router.get("/search", auth, searchExercise);

// Get By Muscle Group
router.get("/muscle/:group", auth, getByMuscleGroup);

// Get By Difficulty
router.get("/difficulty/:level", auth, getByDifficulty);

// Get Single Exercise
router.get("/:id", auth, getExerciseById);

/*
==========================================
Admin & Trainer
==========================================
*/

// Create Exercise
router.post(
  "/",
  auth,
  authorize("admin", "trainer"),
  createExercise
);

// Update Exercise
router.put(
  "/:id",
  auth,
  authorize("admin", "trainer"),
  updateExercise
);

/*
==========================================
Admin Only
==========================================
*/

// Delete Exercise
router.delete(
  "/:id",
  auth,
  authorize("admin"),
  deleteExercise
);

export default router;