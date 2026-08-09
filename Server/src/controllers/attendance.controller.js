import Attendance from "../models/attendance.model.js";

/*
==========================================
Member Check-In
POST /api/attendance/check-in
==========================================
*/
export const checkIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      memberId: req.user._id,
      date: { $gte: today },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "You have already checked in today.",
      });
    }

    const attendance = await Attendance.create({
      memberId: req.user._id,
      checkIn: new Date(),
      status: "present",
    });

    res.status(201).json({
      success: true,
      message: "Check-in successful",
      attendance,
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
Member Check-Out
POST /api/attendance/check-out
==========================================
*/
export const checkOut = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({
      memberId: req.user._id,
      checkOut: null,
    }).sort({ createdAt: -1 });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No active check-in found.",
      });
    }

    attendance.checkOut = new Date();

    attendance.duration = Math.floor(
      (attendance.checkOut - attendance.checkIn) / 60000
    );

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Check-out successful",
      attendance,
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
Get All Attendance
==========================================
*/
export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("memberId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
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
Get Member Attendance
==========================================
*/
export const getMemberAttendance = async (req, res) => {
  try {
    const memberId =
      req.user.role === "member"
        ? req.user._id
        : req.params.id;

    const attendance = await Attendance.find({
      memberId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      attendance,
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
Today's Attendance
==========================================
*/
export const todayAttendance = async (req, res) => {
  try {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({
      date: { $gte: today },
    }).populate("memberId", "name email");

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
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
Delete Attendance
==========================================
*/
export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found.",
      });
    }

    await attendance.deleteOne();

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};