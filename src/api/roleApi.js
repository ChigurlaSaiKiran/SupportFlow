import API from "./api";

export const getRoles = async () => {
  const res = await API.get("/role");
  return res.data;
};

export const getRoleById = async (id) => {
  const res = await API.get(`/role/${id}`);
  return res.data;
};

export const createRole = async (data) => {
  return await API.post("/role", data);
};

export const updateRole = async (id, data) => {
  return await API.put(`/role/${id}`, data);
};

export const deleteRole = async (id) => {
  return await API.delete(`/role/${id}`);
};
