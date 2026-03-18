import API from "./api";

// const API = axios.create({
//   baseURL: "https://localhost:7104/api",
// });

// Categories Category
export const getAllCategories = () => API.get("/Categories");
export const getCategoryById = (id) => API.get(`/Categories/${id}`);
export const createCategory = (data) => API.post("/Categories", data);
export const updateCategory = (id, data) => API.put(`/Categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/Categories/${id}`);
