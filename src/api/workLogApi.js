import API from "./api";

export const getAllWorkLogs = () => API.get("/worklogs");
export const getMyWorkLogs = (userId) => API.get(`/worklogs/my/${userId}`);
export const getPendingApprovals = () => API.get("/worklogs/pending");
export const getWorkLogById = (id) => API.get(`/worklogs/${id}`);
export const createWorkLog = (data) => API.post("/worklogs", data);
export const updateWorkLog = (id, data) => API.put(`/worklogs/${id}`, data);
export const approveWorkLog = (id, data) =>
  API.put(`/worklogs/${id}/approve`, data);
export const deleteWorkLog = (id) => API.delete(`/worklogs/${id}`);
