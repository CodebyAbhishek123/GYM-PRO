import { Routes, Route } from "react-router-dom";

// Auth wrappers
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Admin pages
import AdminDashboard from "../pages/admin/Dashboard";
import ManageMembers from "../pages/admin/ManageMembers";
import ManageTrainers from "../pages/admin/ManageTrainers";
import ManageExercises from "../pages/admin/ManageExercises";
import ManagePlans from "../pages/admin/ManagePlans";
import ManagePayments from "../pages/admin/ManagePayments";
import AttendanceReports from "../pages/admin/AttendanceReports";

// Trainer pages
import TrainerDashboard from "../pages/trainer/Dashboard";
import MyMembers from "../pages/trainer/MyMembers";
import WorkoutPlans from "../pages/trainer/WorkoutPlans";
import DietPlans from "../pages/trainer/DietPlans";
import MemberProgress from "../pages/trainer/MemberProgress";
import TrainerAttendance from "../pages/trainer/TrainerAttendance";

// Member pages
import MemberDashboard from "../pages/member/Dashboard";
import ProfileView from "../pages/member/ProfileView";
import WorkoutPlanView from "../pages/member/WorkoutPlanView";
import WorkoutLogger from "../pages/member/WorkoutLogger";
import DietPlanView from "../pages/member/DietPlanView";
import ProgressView from "../pages/member/ProgressView";
import ExerciseLibrary from "../pages/member/ExerciseLibrary";
import AttendanceView from "../pages/member/AttendanceView";
import MembershipDetails from "../pages/member/MembershipDetails";

// Error page
import NotFound from "../pages/errors/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute role="admin">
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/members"
        element={
          <ProtectedRoute>
            <RoleRoute role="admin">
              <DashboardLayout>
                <ManageMembers />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/trainers"
        element={
          <ProtectedRoute>
            <RoleRoute role="admin">
              <DashboardLayout>
                <ManageTrainers />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exercises"
        element={
          <ProtectedRoute>
            <RoleRoute role="admin">
              <DashboardLayout>
                <ManageExercises />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/plans"
        element={
          <ProtectedRoute>
            <RoleRoute role="admin">
              <DashboardLayout>
                <ManagePlans />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute>
            <RoleRoute role="admin">
              <DashboardLayout>
                <ManagePayments />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute>
            <RoleRoute role="admin">
              <DashboardLayout>
                <AttendanceReports />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Trainer Protected Routes */}
      <Route
        path="/trainer/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute role="trainer">
              <DashboardLayout>
                <TrainerDashboard />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainer/members"
        element={
          <ProtectedRoute>
            <RoleRoute role="trainer">
              <DashboardLayout>
                <MyMembers />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainer/members/:id/progress"
        element={
          <ProtectedRoute>
            <RoleRoute role="trainer">
              <DashboardLayout>
                <MemberProgress />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainer/workouts"
        element={
          <ProtectedRoute>
            <RoleRoute role="trainer">
              <DashboardLayout>
                <WorkoutPlans />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainer/diets"
        element={
          <ProtectedRoute>
            <RoleRoute role="trainer">
              <DashboardLayout>
                <DietPlans />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainer/attendance"
        element={
          <ProtectedRoute>
            <RoleRoute role="trainer">
              <DashboardLayout>
                <TrainerAttendance />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Member Protected Routes */}
      <Route
        path="/member/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute role="member">
              <DashboardLayout>
                <MemberDashboard />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/profile"
        element={
          <ProtectedRoute>
            <RoleRoute role="member">
              <DashboardLayout>
                <ProfileView />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/workout"
        element={
          <ProtectedRoute>
            <RoleRoute role="member">
              <DashboardLayout>
                <WorkoutPlanView />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/log"
        element={
          <ProtectedRoute>
            <RoleRoute role="member">
              <DashboardLayout>
                <WorkoutLogger />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/diet"
        element={
          <ProtectedRoute>
            <RoleRoute role="member">
              <DashboardLayout>
                <DietPlanView />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/progress"
        element={
          <ProtectedRoute>
            <RoleRoute role="member">
              <DashboardLayout>
                <ProgressView />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/exercises"
        element={
          <ProtectedRoute>
            <RoleRoute role="member">
              <DashboardLayout>
                <ExerciseLibrary />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/attendance"
        element={
          <ProtectedRoute>
            <RoleRoute role="member">
              <DashboardLayout>
                <AttendanceView />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/membership"
        element={
          <ProtectedRoute>
            <RoleRoute role="member">
              <DashboardLayout>
                <MembershipDetails />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;