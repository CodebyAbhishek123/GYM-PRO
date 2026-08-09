import User from "../models/user.model.js";
import Membership from "../models/membership.model.js";
import Payment from "../models/payment.model.js";
import Attendance from "../models/attendance.model.js";
import WorkoutPlan from "../models/workoutPlan.model.js";
import DietPlan from "../models/dietPlan.model.js";
import Progress from "../models/progress.model.js";

/*
==========================================
Admin Dashboard
GET /api/dashboard/admin
==========================================
*/

export const adminDashboard = async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({
      role: "member",
    });

    const totalTrainers = await User.countDocuments({
      role: "trainer",
    });

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    const activeMemberships = await Membership.countDocuments({
      status: "active",
    });

    const expiredMemberships = await Membership.countDocuments({
      status: "expired",
    });

    const totalRevenue = await Payment.aggregate([
      {
        $match: {
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAttendance = await Attendance.countDocuments({
      date: {
        $gte: today,
      },
    });

    const recentPayments = await Payment.find()
      .populate("memberId", "name")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    res.status(200).json({
      success: true,

      statistics: {
        totalMembers,
        totalTrainers,
        totalAdmins,
        activeMemberships,
        expiredMemberships,
        totalRevenue:
          totalRevenue.length > 0
            ? totalRevenue[0].revenue
            : 0,
        todayAttendance,
      },

      recentPayments,
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
Trainer Dashboard
GET /api/dashboard/trainer
==========================================
*/

export const trainerDashboard = async (req, res) => {

  try {

    const trainerId = req.user._id;

    const workoutPlans = await WorkoutPlan.countDocuments({
      trainerId,
    });

    const dietPlans = await DietPlan.countDocuments({
      trainerId,
    });

    const assignedMembers = await WorkoutPlan.distinct(
      "memberId",
      {
        trainerId,
      }
    );

    res.status(200).json({
      success: true,

      statistics: {
        assignedMembers: assignedMembers.length,
        workoutPlans,
        dietPlans,
      },
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
Member Dashboard
GET /api/dashboard/member
==========================================
*/

export const memberDashboard = async (req, res) => {

  try {

    const memberId = req.user._id;

    const membership = await Membership.findOne({
      memberId,
      status: "active",
    }).populate("membershipPlanId");

    const workout = await WorkoutPlan.findOne({
      memberId,
      status: "active",
    });

    const diet = await DietPlan.findOne({
      memberId,
      status: "active",
    });

    const latestProgress = await Progress.findOne({
      memberId,
    }).sort({
      createdAt: -1,
    });

    const attendance = await Attendance.find({
      memberId,
    })
      .sort({
        createdAt: -1,
      })
      .limit(10);

    res.status(200).json({
      success: true,

      membership,

      workout,

      diet,

      latestProgress,

      attendance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};