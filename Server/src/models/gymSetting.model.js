import mongoose from "mongoose";

const gymSettingSchema = new mongoose.Schema(
  {
    gymName: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    alternatePhone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "India",
    },

    pincode: {
      type: String,
      default: "",
    },

    openingTime: {
      type: String,
      default: "06:00 AM",
    },

    closingTime: {
      type: String,
      default: "10:00 PM",
    },

    logo: {
      type: String,
      default: "",
    },

    banner: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    instagram: {
      type: String,
      default: "",
    },

    facebook: {
      type: String,
      default: "",
    },

    youtube: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    currency: {
      type: String,
      default: "INR",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const GymSetting = mongoose.model("GymSetting", gymSettingSchema);

export default GymSetting;