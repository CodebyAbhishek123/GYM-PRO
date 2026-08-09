import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import exerciseRoutes from "./routes/exercise.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import dietRoutes from "./routes/diet.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import membershipRoutes from "./routes/membership.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import membershipPlanRoutes from "./routes/membershipPlan.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

import errorHandler from "./middleware/error.middleware.js";

const app = express();

/* ==========================================
   CORS Configuration
========================================== */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* ==========================================
   Middlewares
========================================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ==========================================
   Home Route
========================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 GymPro API is Running...",
  });
});

/* ==========================================
   API Routes
========================================== */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/diets", dietRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/membership-plans", membershipPlanRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* ==========================================
   Error Handler
========================================== */

app.use(errorHandler);

export default app;