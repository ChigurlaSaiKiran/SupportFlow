import API from "./api";

export const getAllAttendance = () => API.get("/attendance");
export const getMyAttendance = (userId) => API.get(`/attendance/my/${userId}`);
export const getTodayAttendance = (userId) =>
  API.get(`/attendance/today/${userId}`);
export const doCheckIn = () => API.post("/attendance/checkin");
export const doCheckOut = () => API.post("/attendance/checkout");
