import WorkoutPlan from "../models/workoutPlan.model.js";
import WorkoutLog from "../models/workoutLog.model.js";

/*
==========================================
Create Workout Plan
POST /api/workouts/plan
==========================================
*/
export const createWorkoutPlan = async (req, res) => {
  try {
    const {
      memberId,
      weekStartDate,
      weekEndDate,
      days,
      notes,
    } = req.body;

    const workoutPlan = await WorkoutPlan.create({
      trainerId: req.user._id,
      memberId,
      weekStartDate,
      weekEndDate,
      days,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Workout plan created successfully",
      workoutPlan,
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
Get All Workout Plans
GET /api/workouts/plan
==========================================
*/
export const getWorkoutPlans = async (req, res) => {
  try {
    const workoutPlans = await WorkoutPlan.find()
      .populate("trainerId", "name email")
      .populate("memberId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: workoutPlans.length,
      workoutPlans,
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
Get Workout Plan By ID
GET /api/workouts/plan/:id
==========================================
*/
export const getWorkoutPlanById = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findById(req.params.id)
      .populate("trainerId", "name email")
      .populate("memberId", "name email")
      .populate("days.exercises.exerciseId");

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    res.status(200).json({
      success: true,
      workoutPlan,
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
Get Current Workout Plan
GET /api/workouts/plan/current
==========================================
*/
export const getCurrentWorkoutPlan = async (req, res) => {
  try {
    const memberId =
      req.user.role === "member"
        ? req.user._id
        : req.query.memberId;

    const today = new Date();

    const workoutPlan = await WorkoutPlan.findOne({
      memberId,
      weekStartDate: { $lte: today },
      weekEndDate: { $gte: today },
      status: "active",
    }).populate("days.exercises.exerciseId");

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: "No active workout plan found",
      });
    }

    res.status(200).json({
      success: true,
      workoutPlan,
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
Update Workout Plan
PUT /api/workouts/plan/:id
==========================================
*/
export const updateWorkoutPlan = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Workout plan updated successfully",
      workoutPlan,
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
Delete Workout Plan
DELETE /api/workouts/plan/:id
==========================================
*/
export const deleteWorkoutPlan = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findById(req.params.id);

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    await workoutPlan.deleteOne();

    res.status(200).json({
      success: true,
      message: "Workout plan deleted successfully",
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
Log Workout
POST /api/workouts/log
==========================================
*/
export const logWorkout = async (req, res) => {
  try {
    const {
      workoutPlanId,
      exerciseId,
      day,
      sets,
      duration,
      notes,
    } = req.body;

    let totalVolume = 0;

    if (sets && sets.length > 0) {
      sets.forEach((set) => {
        totalVolume += (set.weight || 0) * (set.repsCompleted || 0);
      });
    }

    const workoutLog = await WorkoutLog.create({
      memberId: req.user._id,
      workoutPlanId,
      exerciseId,
      day,
      sets,
      duration,
      notes,
      totalVolume,
      status: "completed",
    });

    res.status(201).json({
      success: true,
      message: "Workout logged successfully",
      workoutLog,
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
Get Workout Logs
GET /api/workouts/logs
==========================================
*/
export const getWorkoutLogs = async (req, res) => {
  try {
    const memberId =
      req.user.role === "member"
        ? req.user._id
        : req.query.memberId;

    const logs = await WorkoutLog.find({
      memberId,
    })
      .populate("exerciseId")
      .populate("workoutPlanId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};