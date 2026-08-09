import express from "express";

import {
  adminDashboard,
  trainerDashboard,
  memberDashboard,
} from "../controllers/dashboard.controller.js";

import {
  auth,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/*
==========================================
Admin Dashboard
==========================================
*/

router.get(
  "/admin",
  auth,
  authorize("admin"),
  adminDashboard
);

/*
==========================================
Trainer Dashboard
==========================================
*/

router.get(
  "/trainer",
  auth,
  authorize("trainer"),
  trainerDashboard
);

/*
==========================================
Member Dashboard
==========================================
*/

router.get(
  "/member",
  auth,
  authorize("member"),
  memberDashboard
);

export default router;