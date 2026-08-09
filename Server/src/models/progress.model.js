import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    weight: Number,

    height: Number,

    bmi: Number,

    bodyFat: Number,

    chest: Number,

    waist: Number,

    arms: Number,

    thighs: Number,

    beforeImage: String,

    afterImage: String,

    notes: String,
  },
  {
    timestamps: true,
  }
);

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;