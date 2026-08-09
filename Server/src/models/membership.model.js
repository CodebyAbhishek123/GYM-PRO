import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    membershipPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
      required: true,
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "paused"],
      default: "active",
    },

    autoRenew: {
      type: Boolean,
      default: false,
    },

    remainingDays: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Membership = mongoose.model("Membership", membershipSchema);

export default Membership;