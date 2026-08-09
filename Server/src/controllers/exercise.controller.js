import Exercise from "../models/exercise.model.js";

/*
====================================
Create Exercise
POST /api/exercises
====================================
*/
export const createExercise = async (req, res) => {
  try {
    const exercise = await Exercise.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Exercise created successfully",
      exercise,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
====================================
Get All Exercises
GET /api/exercises
====================================
*/
export const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find()
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: exercises.length,
      exercises,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
====================================
Get Exercise By ID
====================================
*/
export const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    res.status(200).json({
      success: true,
      exercise,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
====================================
Update Exercise
====================================
*/
export const updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exercise updated successfully",
      exercise,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
====================================
Delete Exercise
====================================
*/
export const deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    await exercise.deleteOne();

    res.status(200).json({
      success: true,
      message: "Exercise deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
====================================
Get By Muscle Group
====================================
*/
export const getByMuscleGroup = async (req, res) => {
  try {
    const exercises = await Exercise.find({
      muscleGroup: req.params.group,
    });

    res.status(200).json({
      success: true,
      exercises,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
====================================
Get By Difficulty
====================================
*/
export const getByDifficulty = async (req, res) => {
  try {
    const exercises = await Exercise.find({
      difficulty: req.params.level,
    });

    res.status(200).json({
      success: true,
      exercises,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
====================================
Search Exercise
====================================
*/
export const searchExercise = async (req, res) => {
  try {
    const keyword = req.query.name || "";

    const exercises = await Exercise.find({
      name: {
        $regex: keyword,
        $options: "i",
      },
    });

    res.status(200).json({
      success: true,
      exercises,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};