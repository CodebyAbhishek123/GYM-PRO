import express from "express";

import {
  addProgress,
  getAllProgress,
  getMemberProgress,
  getLatestProgress,
  updateProgress,
  deleteProgress,
} from "../controllers/progress.controller.js";

import {
  auth,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/*
==========================================
Progress Tracking
==========================================
*/

// Add Progress
router.post(
  "/",
  auth,
  authorize("member"),
  addProgress
);

// Get All Progress
router.get(
  "/",
  auth,
  authorize("admin", "trainer"),
  getAllProgress
);

// Get Member Progress
router.get(
  "/member/:id",
  auth,
  authorize("admin", "trainer", "member"),
  getMemberProgress
);

// Get Latest Progress
router.get(
  "/latest/:id",
  auth,
  authorize("admin", "trainer", "member"),
  getLatestProgress
);

// Update Progress
router.put(
  "/:id",
  auth,
  authorize("member"),
  updateProgress
);

// Delete Progress
router.delete(
  "/:id",
  auth,
  authorize("admin"),
  deleteProgress
);

export default router;