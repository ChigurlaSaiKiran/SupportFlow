import API from "./api";

export const getDepartments = async () => {
  const response = await API.get("/departments");
  return response.data;
};

export const getDepartmentById = async (id) => {
  const response = await API.get(`/departments/${id}`);
  return response.data;
};

export const createDepartment = async (department) => {
  const response = await API.post("/departments", department);
  return response.data;
};

export const updateDepartment = async (id, department) => {
  const response = await API.put(`/departments/${id}`, department);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await API.delete(`/departments/${id}`);
  return response.data;
};
//  import axios from "axios";
// const API_URL = "https://localhost:7104/api/departments"; // your backend API

// export const getDepartments = async () => {
//   const response = await API.get(API_URL);
//   return response.data;
// };

// export const getDepartmentById = async (id) => {
//   const response = await API.get(`${API_URL}/${id}`);
//   return response.data;
// };

// export const createDepartment = async (department) => {
//   const response = await API.post(API_URL, department);
//   return response.data;
// };

// export const updateDepartment = async (id, department) => {
//   console.log("UPDATE URL:", `${API_URL}/${id}`); // Add this line
//   const response = await API.put(`${API_URL}/${id}`, department);
//   return response.data;
// };

// export const deleteDepartment = async (id) => {
//   const response = await API.delete(`${API_URL}/${id}`);
//   return response.data;
// };
