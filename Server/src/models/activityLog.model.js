import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userRole: {
      type: String,
      enum: ["admin", "trainer", "member"],
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    module: {
      type: String,
      enum: [
        "User",
        "Membership",
        "Workout",
        "Exercise",
        "Diet",
        "Attendance",
        "Payment",
        "Progress",
        "Notification",
        "Appointment",
        "Gym",
        "Authentication",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    targetModel: {
      type: String,
      default: "",
    },

    ipAddress: {
      type: String,
      default: "",
    },

    device: {
      type: String,
      default: "",
    },

    browser: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  {
    timestamps: true,
  }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
