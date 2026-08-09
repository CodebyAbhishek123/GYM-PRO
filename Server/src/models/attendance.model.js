import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    date: {
      type: Date,
      default: Date.now,
    },

    checkIn: {
      type: Date,
    },

    checkOut: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present",
    },

    duration: {
      type: Number,
      default: 0, // Minutes
    },

    notes: {
      type: String,
      default: "",
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isManualEntry: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;