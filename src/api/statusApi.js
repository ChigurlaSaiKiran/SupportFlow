import API from "./api";

export const getAllStatuses = () => API.get("/Statuses");
export const getStatusById = (id) => API.get(`/Statuses/${id}`);
export const createStatus = (data) => API.post("/Statuses", data);
export const updateStatus = (id, data) => API.put(`/Statuses/${id}`, data);
export const deleteStatus = (id) => API.delete(`/Statuses/${id}`);

// Aliases used by ticket forms
export const getStatuses = getAllStatuses;
