// import axios from "axios";
import API from "./api";
// const API = axios.create({
//   baseURL: "https://localhost:7104/api",
// });

// Statuses
export const getAllStatuses = () => API.get("/Statuses");
export const getStatusById = (id) => API.get(`/Statuses/${id}`);
export const createStatus = (data) => API.post("/Statuses", data);
export const updateStatus = (id, data) => API.put(`/Statuses/${id}`, data);
export const deleteStatus = (id) => API.delete(`/Statuses/${id}`);
