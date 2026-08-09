import api from "./api";

// Member dashboard statistics
export const getMemberDashboard = async () => {
  const response = await api.get("/dashboard/member");
  return response.data;
};

// Workout Plan and logging
export const getCurrentWorkoutPlan = async () => {
  const response = await api.get("/workouts/plan/current");
  return response.data;
};

export const logWorkout = async (data) => {
  const response = await api.post("/workouts/log", data);
  return response.data;
};

export const getWorkoutLogs = async () => {
  const response = await api.get("/workouts/logs");
  return response.data;
};

// Diet
export const getMemberDietPlan = async (memberId) => {
  const response = await api.get(`/diets/member/${memberId}`);
  return response.data;
};

// Progress
export const addProgress = async (data) => {
  const response = await api.post("/progress", data);
  return response.data;
};

export const getProgressHistory = async (memberId) => {
  const response = await api.get(`/progress/member/${memberId}`);
  return response.data;
};

export const getLatestProgress = async (memberId) => {
  const response = await api.get(`/progress/latest/${memberId}`);
  return response.data;
};

// Attendance
export const checkIn = async () => {
  const response = await api.post("/attendance/check-in", {});
  return response.data;
};

export const checkOut = async () => {
  const response = await api.post("/attendance/check-out", {});
  return response.data;
};

export const getAttendanceHistory = async (memberId) => {
  const response = await api.get(`/attendance/member/${memberId}`);
  return response.data;
};

// Payments
export const getMemberPayments = async (memberId) => {
  const response = await api.get(`/payments/member/${memberId}`);
  return response.data;
};
