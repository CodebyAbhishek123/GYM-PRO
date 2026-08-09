import mongoose from "mongoose";

const workoutExerciseSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },

    sets: {
      type: Number,
      required: true,
    },

    reps: {
      type: String,
      required: true,
    },

    weight: {
      type: Number,
      default: 0,
    },

    restTime: {
      type: Number,
      default: 90,
    },

    duration: {
      type: Number,
      default: 0,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const workoutDaySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    exercises: [workoutExerciseSchema],

    isRestDay: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const workoutPlanSchema = new mongoose.Schema(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    weekStartDate: {
      type: Date,
      required: true,
    },

    weekEndDate: {
      type: Date,
      required: true,
    },

    days: [workoutDaySchema],

    notes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);

export default WorkoutPlan;