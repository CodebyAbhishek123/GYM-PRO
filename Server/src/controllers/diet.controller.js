import DietPlan from "../models/dietPlan.model.js";

/*
==========================================
Create Diet Plan
POST /api/diets
==========================================
*/
export const createDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.create({
      ...req.body,
      trainerId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Diet plan created successfully",
      dietPlan,
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
Get All Diet Plans
GET /api/diets
==========================================
*/
export const getDietPlans = async (req, res) => {
  try {
    const dietPlans = await DietPlan.find()
      .populate("trainerId", "name email")
      .populate("memberId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: dietPlans.length,
      dietPlans,
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
Get Diet Plan By ID
GET /api/diets/:id
==========================================
*/
export const getDietPlanById = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id)
      .populate("trainerId", "name email")
      .populate("memberId", "name email");

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: "Diet plan not found",
      });
    }

    res.status(200).json({
      success: true,
      dietPlan,
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
Update Diet Plan
PUT /api/diets/:id
==========================================
*/
export const updateDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: "Diet plan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Diet plan updated successfully",
      dietPlan,
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
Delete Diet Plan
DELETE /api/diets/:id
==========================================
*/
export const deleteDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id);

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: "Diet plan not found",
      });
    }

    await dietPlan.deleteOne();

    res.status(200).json({
      success: true,
      message: "Diet plan deleted successfully",
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
Get Member Diet Plan
GET /api/diets/member/:memberId
==========================================
*/
export const getMemberDietPlan = async (req, res) => {
  try {
    const memberId =
      req.user.role === "member"
        ? req.user._id
        : req.params.memberId;

    const dietPlan = await DietPlan.findOne({
      memberId,
      status: "active",
    })
      .populate("trainerId", "name")
      .populate("memberId", "name");

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: "No active diet plan found",
      });
    }

    res.status(200).json({
      success: true,
      dietPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};