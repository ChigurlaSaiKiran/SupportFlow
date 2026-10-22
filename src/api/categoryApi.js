import API from "./api";

export const getAllCategories = () => API.get("/Categories");
export const getCategoryById = (id) => API.get(`/Categories/${id}`);
export const createCategory = (data) => API.post("/Categories", data);
export const updateCategory = (id, data) => API.put(`/Categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/Categories/${id}`);

export const getCategories = getAllCategories;
