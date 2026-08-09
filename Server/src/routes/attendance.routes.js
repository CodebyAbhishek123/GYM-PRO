import express from "express";

import {
  checkIn,
  checkOut,
  getAllAttendance,
  getMemberAttendance,
  todayAttendance,
  deleteAttendance,
} from "../controllers/attendance.controller.js";

import {
  auth,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/*
==========================================
Member Attendance
==========================================
*/

// Check In
router.post(
  "/check-in",
  auth,
  authorize("member"),
  checkIn
);

// Check Out
router.post(
  "/check-out",
  auth,
  authorize("member"),
  checkOut
);

/*
==========================================
Admin & Trainer
==========================================
*/

// Get All Attendance
router.get(
  "/",
  auth,
  authorize("admin", "trainer"),
  getAllAttendance
);

// Today's Attendance
router.get(
  "/today",
  auth,
  authorize("admin", "trainer"),
  todayAttendance
);

/*
==========================================
Member Attendance History
==========================================
*/

router.get(
  "/member/:id",
  auth,
  authorize("admin", "trainer", "member"),
  getMemberAttendance
);

/*
==========================================
Admin
==========================================
*/

router.delete(
  "/:id",
  auth,
  authorize("admin"),
  deleteAttendance
);

export default router;