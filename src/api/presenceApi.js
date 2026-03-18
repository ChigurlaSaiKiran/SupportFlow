import API from "./api";

export const getMyStatus = () => API.get("/presence/status");

export const updateMyStatus = (status) =>
  API.put("/presence/status", { status });
