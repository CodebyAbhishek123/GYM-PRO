import express from "express";

import {
  createMembership,
  getMemberships,
  getMembershipById,
  updateMembership,
  deleteMembership,
  renewMembership,
  activeMemberships,
  expiredMemberships,
} from "../controllers/membership.controller.js";

import {
  auth,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/*
==========================================
Membership Management
==========================================
*/

// Create Membership
router.post(
  "/",
  auth,
  authorize("admin"),
  createMembership
);

// Get All Memberships
router.get(
  "/",
  auth,
  authorize("admin", "trainer"),
  getMemberships
);

// Get Active Memberships
router.get(
  "/active",
  auth,
  authorize("admin", "trainer"),
  activeMemberships
);

// Get Expired Memberships
router.get(
  "/expired",
  auth,
  authorize("admin", "trainer"),
  expiredMemberships
);

// Get Membership By ID
router.get(
  "/:id",
  auth,
  authorize("admin", "trainer", "member"),
  getMembershipById
);

// Update Membership
router.put(
  "/:id",
  auth,
  authorize("admin"),
  updateMembership
);

// Renew Membership
router.patch(
  "/renew/:id",
  auth,
  authorize("admin"),
  renewMembership
);

// Delete Membership
router.delete(
  "/:id",
  auth,
  authorize("admin"),
  deleteMembership
);

export default router;