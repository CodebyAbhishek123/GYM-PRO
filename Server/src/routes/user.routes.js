import express from "express";

import {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
} from "../controllers/user.controller.js";

import {
  auth,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/*
========================================
Member / Trainer / Admin
========================================
*/

// Get Logged-in User Profile
router.get(
  "/profile",
  auth,
  authorize("admin", "trainer", "member"),
  getProfile
);

// Update Logged-in User Profile
router.put(
  "/profile",
  auth,
  authorize("admin", "trainer", "member"),
  updateProfile
);

/*
========================================
Admin Only
========================================
*/

// Get All Users
router.get(
  "/",
  auth,
  authorize("admin"),
  getAllUsers
);

// Get User By Id
router.get(
  "/:id",
  auth,
  authorize("admin"),
  getUserById
);

// Update User
router.put(
  "/:id",
  auth,
  authorize("admin"),
  updateUser
);

// Delete User
router.delete(
  "/:id",
  auth,
  authorize("admin"),
  deleteUser
);

// Block User
router.patch(
  "/block/:id",
  auth,
  authorize("admin"),
  blockUser
);

// Unblock User
router.patch(
  "/unblock/:id",
  auth,
  authorize("admin"),
  unblockUser
);

export default router;