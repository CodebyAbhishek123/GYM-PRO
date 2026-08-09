import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    mealType: {
      type: String,
      enum: [
        "breakfast",
        "lunch",
        "dinner",
        "pre_workout",
        "post_workout",
        "snack",
      ],
      required: true,
    },

    foods: [
      {
        type: String,
      },
    ],

    time: {
      type: String,
    },

    calories: {
      type: Number,
      default: 0,
    },

    protein: {
      type: Number,
      default: 0,
    },

    carbohydrates: {
      type: Number,
      default: 0,
    },

    fats: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const dietPlanSchema = new mongoose.Schema(
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

    goal: {
      type: String,
      enum: [
        "muscle_gain",
        "weight_loss",
        "fat_loss",
        "maintenance",
      ],
      required: true,
    },

    meals: [mealSchema],

    dailyCalories: {
      type: Number,
      default: 0,
    },

    protein: {
      type: Number,
      default: 0,
    },

    carbohydrates: {
      type: Number,
      default: 0,
    },

    fats: {
      type: Number,
      default: 0,
    },

    waterIntake: {
      type: Number,
      default: 3,
    },

    restrictions: {
      type: String,
      default: "",
    },

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

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);

export default DietPlan;