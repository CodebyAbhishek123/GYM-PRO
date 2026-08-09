import Progress from "../models/progress.model.js";

/*
==========================================
Add Progress
POST /api/progress
==========================================
*/
export const addProgress = async (req, res) => {
  try {
    const progress = await Progress.create({
      ...req.body,
      memberId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Progress added successfully",
      progress,
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
Get All Progress
GET /api/progress
==========================================
*/
export const getAllProgress = async (req, res) => {
  try {
    const progress = await Progress.find()
      .populate("memberId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: progress.length,
      progress,
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
Get Member Progress
GET /api/progress/member/:id
==========================================
*/
export const getMemberProgress = async (req, res) => {
  try {
    const memberId =
      req.user.role === "member"
        ? req.user._id
        : req.params.id;

    const progress = await Progress.find({
      memberId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      progress,
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
Get Latest Progress
GET /api/progress/latest/:id
==========================================
*/
export const getLatestProgress = async (req, res) => {
  try {
    const memberId =
      req.user.role === "member"
        ? req.user._id
        : req.params.id;

    const progress = await Progress.findOne({
      memberId,
    }).sort({ createdAt: -1 });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "No progress found",
      });
    }

    res.status(200).json({
      success: true,
      progress,
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
Update Progress
PUT /api/progress/:id
==========================================
*/
export const updateProgress = async (req, res) => {
  try {
    const progress = await Progress.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      progress,
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
Delete Progress
DELETE /api/progress/:id
==========================================
*/
export const deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    await progress.deleteOne();

    res.status(200).json({
      success: true,
      message: "Progress deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};