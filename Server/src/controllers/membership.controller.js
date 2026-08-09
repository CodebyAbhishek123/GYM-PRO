import Membership from "../models/membership.model.js";

/*
==========================================
Create Membership
POST /api/memberships
==========================================
*/

export const createMembership = async (req, res) => {
  try {
    const membership = await Membership.create(req.body);

    res.status(201).json({
      success: true,
      message: "Membership created successfully",
      membership,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
Get All Memberships
GET /api/memberships
==========================================
*/

export const getMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find()
      .populate("memberId", "name email")
      .populate("membershipPlanId", "name duration price")
      .populate("paymentId");

    res.status(200).json({
      success: true,
      count: memberships.length,
      memberships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
Get Membership By ID
==========================================
*/

export const getMembershipById = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id)
      .populate("memberId", "name email")
      .populate("membershipPlanId")
      .populate("paymentId");

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    res.status(200).json({
      success: true,
      membership,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
Update Membership
==========================================
*/

export const updateMembership = async (req, res) => {
  try {
    const membership = await Membership.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Membership updated successfully",
      membership,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
Delete Membership
==========================================
*/

export const deleteMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    await membership.deleteOne();

    res.status(200).json({
      success: true,
      message: "Membership deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
Renew Membership
==========================================
*/

export const renewMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    membership.status = "active";
    membership.endDate = req.body.endDate;

    await membership.save();

    res.status(200).json({
      success: true,
      message: "Membership renewed successfully",
      membership,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
Active Memberships
==========================================
*/

export const activeMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find({
      status: "active",
    });

    res.status(200).json({
      success: true,
      memberships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
Expired Memberships
==========================================
*/

export const expiredMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find({
      status: "expired",
    });

    res.status(200).json({
      success: true,
      memberships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};