import api from "./api";

export const getAllExercises = async () => {
  const response = await api.get("/exercises");
  return response.data;
};

export const getExerciseById = async (id) => {
  const response = await api.get(`/exercises/${id}`);
  return response.data;
};

export const createExercise = async (data) => {
  const response = await api.post("/exercises", data);
  return response.data;
};

export const updateExercise = async (id, data) => {
  const response = await api.put(`/exercises/${id}`, data);
  return response.data;
};

export const deleteExercise = async (id) => {
  const response = await api.delete(`/exercises/${id}`);
  return response.data;
};

export const searchExercises = async (keyword) => {
  const response = await api.get(`/exercises/search?name=${keyword}`);
  return response.data;
};
