import API from "./api";

export const getDepartments = () => API.get("/departments");
export const getDepartmentById = (id) => API.get(`/departments/${id}`);
export const createDepartment = (data) => API.post("/departments", data);
export const updateDepartment = (id, data) => API.put(`/departments/${id}`, data);
export const deleteDepartment = (id) => API.delete(`/departments/${id}`);
