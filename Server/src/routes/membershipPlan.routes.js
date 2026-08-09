import express from "express";
import {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan
} from "../controllers/membershipPlan.controller.js";
import { auth, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", auth, authorize("admin"), createPlan);
router.get("/", getPlans); // Public or authenticated
router.get("/:id", getPlanById);
router.put("/:id", auth, authorize("admin"), updatePlan);
router.delete("/:id", auth, authorize("admin"), deletePlan);

export default router;
