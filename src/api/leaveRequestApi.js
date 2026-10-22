import API from "./api";

const getAllLeaveRequests = () => API.get("/leaverequests");
const getMyLeaveRequests = (userId) => API.get(`/leaverequests/my/${userId}`);
const getPendingRequests = () => API.get("/leaverequests/pending");
const getLeaveRequestById = (id) => API.get(`/leaverequests/${id}`);
const createLeaveRequest = (data) => API.post("/leaverequests", data);
const approveLeaveRequest = (id, data) =>
  API.put(`/leaverequests/${id}/approve`, data);
const deleteLeaveRequest = (id) => API.delete(`/leaverequests/${id}`);

export {
  getAllLeaveRequests,
  getMyLeaveRequests,
  getPendingRequests,
  getLeaveRequestById,
  createLeaveRequest,
  approveLeaveRequest,
  deleteLeaveRequest,
};
