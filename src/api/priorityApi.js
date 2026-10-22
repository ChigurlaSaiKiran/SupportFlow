import API from "./api";

export const getAllPriorities = () => API.get("/Priorities");
export const getPriorityById = (id) => API.get(`/Priorities/${id}`);
export const createPriority = (data) => API.post("/Priorities", data);
export const updatePriority = (id, data) => API.put(`/Priorities/${id}`, data);
export const deletePriority = (id) => API.delete(`/Priorities/${id}`);

export const getPriorities = getAllPriorities;
