import mongoose from "mongoose";

const membershipPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      default: "",
    },

    duration: {
      type: Number,
      required: true, // Duration in months
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    features: [
      {
        type: String,
      },
    ],

    maxTrainerSessions: {
      type: Number,
      default: 0,
    },

    freezeDays: {
      type: Number,
      default: 0,
    },

    accessHours: {
      type: String,
      default: "24/7",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const MembershipPlan = mongoose.model(
  "MembershipPlan",
  membershipPlanSchema
);

export default MembershipPlan;