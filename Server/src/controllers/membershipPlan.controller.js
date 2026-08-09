import MembershipPlan from "../models/membershipPlan.model.js";

/*
==========================================
Create Membership Plan
POST /api/membership-plans
==========================================
*/
export const createPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.create(req.body);
    res.status(201).json({
      success: true,
      message: "Membership plan created successfully",
      plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
Get All Membership Plans
GET /api/membership-plans
==========================================
*/
export const getPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: plans.length,
      plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
Get Plan By ID
GET /api/membership-plans/:id
==========================================
*/
export const getPlanById = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found",
      });
    }
    res.status(200).json({
      success: true,
      plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
Update Membership Plan
PUT /api/membership-plans/:id
==========================================
*/
export const updatePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Membership plan updated successfully",
      plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
Delete Membership Plan
DELETE /api/membership-plans/:id
==========================================
*/
export const deletePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found",
      });
    }
    await plan.deleteOne();
    res.status(200).json({
      success: true,
      message: "Membership plan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
