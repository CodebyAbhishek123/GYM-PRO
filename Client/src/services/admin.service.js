import api from "./api";

// Dashboard statistics
export const getAdminDashboard = async () => {
  const response = await api.get("/dashboard/admin");
  return response.data;
};

// Users management
export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (data) => {
  // Creating user is done through register endpoint generally
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Membership enrollments CRUD
export const getAllMemberships = async () => {
  const response = await api.get("/memberships");
  return response.data;
};

export const createMembership = async (data) => {
  const response = await api.post("/memberships", data);
  return response.data;
};

export const updateMembership = async (id, data) => {
  const response = await api.put(`/memberships/${id}`, data);
  return response.data;
};

export const renewMembership = async (id, data) => {
  const response = await api.patch(`/memberships/renew/${id}`, data);
  return response.data;
};

export const deleteMembership = async (id) => {
  const response = await api.delete(`/memberships/${id}`);
  return response.data;
};

// Payments management
export const getAllPayments = async () => {
  const response = await api.get("/payments");
  return response.data;
};

export const recordPayment = async (data) => {
  const response = await api.post("/payments", data);
  return response.data;
};

export const deletePayment = async (id) => {
  const response = await api.delete(`/payments/${id}`);
  return response.data;
};

// Attendance reports
export const getAllAttendance = async () => {
  const response = await api.get("/attendance");
  return response.data;
};

// Membership Plans (CRUD)
export const getMembershipPlans = async () => {
  const response = await api.get("/membership-plans");
  return response.data;
};

export const createMembershipPlan = async (data) => {
  const response = await api.post("/membership-plans", data);
  return response.data;
};

export const updateMembershipPlan = async (id, data) => {
  const response = await api.put(`/membership-plans/${id}`, data);
  return response.data;
};

export const deleteMembershipPlan = async (id) => {
  const response = await api.delete(`/membership-plans/${id}`);
  return response.data;
};
