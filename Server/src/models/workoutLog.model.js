import mongoose from "mongoose";

const setSchema = new mongoose.Schema(
  {
    setNumber: {
      type: Number,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    repsCompleted: {
      type: Number,
      required: true,
    },

    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const workoutLogSchema = new mongoose.Schema(
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

    workoutPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutPlan",
    },

    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },

    day: {
      type: String,
      required: true,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
    },

    date: {
      type: Date,
      default: Date.now,
    },

    sets: [setSchema],

    duration: {
      type: Number,
      default: 0,
    },

    caloriesBurned: {
      type: Number,
      default: 0,
    },

    totalVolume: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["in_progress", "completed", "skipped"],
      default: "in_progress",
    },
  },
  {
    timestamps: true,
  }
);

const WorkoutLog = mongoose.model("WorkoutLog", workoutLogSchema);

export default WorkoutLog;