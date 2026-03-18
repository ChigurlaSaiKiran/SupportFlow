// import axios from "axios";
import API from "./api";
// const API = axios.create({
//   baseURL: "https://localhost:7104/api/",
// });

// Users
export const getAllusers = () => API.get("/users");
export const getuserById = (id) => API.get(`/users/${id}`);
export const createuser = (data) => API.post(`/users`, data);
export const updateuser = (id, data) => API.put(`/users/${id}`, data);
export const deleteuser = (id) => API.delete(`/users/${id}`);
