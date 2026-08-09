import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    muscleGroup: {
      type: String,
      required: true,
      enum: [
        "Chest",
        "Back",
        "Shoulders",
        "Biceps",
        "Triceps",
        "Legs",
        "Abs",
        "Cardio",
        "Full Body",
      ],
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    equipment: [
      {
        type: String,
      },
    ],

    sets: {
      type: Number,
      default: 4,
    },

    reps: {
      type: String,
      default: "10",
    },

    restTime: {
      type: Number,
      default: 90, // seconds
    },

    caloriesBurned: {
      type: Number,
      default: 0,
    },

    duration: {
      type: Number, // minutes
      default: 0,
    },

    safetyInstructions: {
      type: String,
    },

    commonMistakes: {
      type: String,
    },

    tips: {
      type: String,
    },

    gifUrl: {
      type: String,
      default: "",
    },

    youtubeUrl: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;