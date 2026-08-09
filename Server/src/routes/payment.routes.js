import express from "express";

import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getMemberPayments,
  pendingPayments,
  completedPayments,
} from "../controllers/payment.controller.js";

import {
  auth,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/*
==========================================
Payment Management
==========================================
*/

// Create Payment
router.post(
  "/",
  auth,
  authorize("admin"),
  createPayment
);

// Get All Payments
router.get(
  "/",
  auth,
  authorize("admin"),
  getPayments
);

// Pending Payments
router.get(
  "/pending",
  auth,
  authorize("admin"),
  pendingPayments
);

// Completed Payments
router.get(
  "/completed",
  auth,
  authorize("admin"),
  completedPayments
);

// Get Member Payment History
router.get(
  "/member/:memberId",
  auth,
  authorize("admin", "trainer", "member"),
  getMemberPayments
);

// Get Payment By ID
router.get(
  "/:id",
  auth,
  authorize("admin", "trainer"),
  getPaymentById
);

// Update Payment
router.put(
  "/:id",
  auth,
  authorize("admin"),
  updatePayment
);

// Delete Payment
router.delete(
  "/:id",
  auth,
  authorize("admin"),
  deletePayment
);

export default router;