import api from "./api";

// Trainer dashboard statistics
export const getTrainerDashboard = async () => {
  const response = await api.get("/dashboard/trainer");
  return response.data;
};

// Workout Plan management
export const createWorkoutPlan = async (data) => {
  const response = await api.post("/workouts/plan", data);
  return response.data;
};

export const getWorkoutPlans = async () => {
  const response = await api.get("/workouts/plan");
  return response.data;
};

export const updateWorkoutPlan = async (id, data) => {
  const response = await api.put(`/workouts/plan/${id}`, data);
  return response.data;
};

export const deleteWorkoutPlan = async (id) => {
  const response = await api.delete(`/workouts/plan/${id}`);
  return response.data;
};

// Diet Plan management
export const createDietPlan = async (data) => {
  const response = await api.post("/diets", data);
  return response.data;
};

export const getDietPlans = async () => {
  const response = await api.get("/diets");
  return response.data;
};

export const updateDietPlan = async (id, data) => {
  const response = await api.put(`/diets/${id}`, data);
  return response.data;
};

export const deleteDietPlan = async (id) => {
  const response = await api.delete(`/diets/${id}`);
  return response.data;
};

// Member progress and logs
export const getMemberProgress = async (memberId) => {
  const response = await api.get(`/progress/member/${memberId}`);
  return response.data;
};

export const getMemberWorkoutLogs = async (memberId) => {
  const response = await api.get(`/workouts/logs?memberId=${memberId}`);
  return response.data;
};
