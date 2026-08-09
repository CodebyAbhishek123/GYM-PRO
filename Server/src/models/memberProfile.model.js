import mongoose from "mongoose";

const measurementSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    weight: Number,
    bmi: Number,
    bodyFat: Number,
    chest: Number,
    waist: Number,
    arms: Number,
    thighs: Number,
  },
  { _id: false }
);

const memberProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    membershipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
    },

    membershipPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
    },

    membershipStart: Date,

    membershipEnd: Date,

    membershipStatus: {
      type: String,
      enum: ["active", "expired", "pending"],
      default: "pending",
    },

    goal: {
      type: String,
      enum: [
        "muscle_gain",
        "weight_loss",
        "fat_loss",
        "maintenance",
      ],
    },

    height: Number,

    weight: Number,

    bmi: Number,

    bodyFat: Number,

    chest: Number,

    waist: Number,

    arms: Number,

    thighs: Number,

    measurements: [measurementSchema],
  },
  {
    timestamps: true,
  }
);

const MemberProfile = mongoose.model(
  "MemberProfile",
  memberProfileSchema
);

export default MemberProfile;