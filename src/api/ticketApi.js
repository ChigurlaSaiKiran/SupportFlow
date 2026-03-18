//import axios from "axios";
import API from "./api";

// const API = axios.create({
//   baseURL: "https://localhost:7104/api",
// });

// Tickets
export const getAllTickets = () => API.get("/tickets");
export const getTicketById = (id) => API.get(`/tickets/${id}`);
export const createTicket = (data) => API.post("/tickets", data);
export const updateTicket = (id, data) => API.put(`/tickets/${id}`, data);
export const deleteTicket = (id) => API.delete(`/tickets/${id}`);
// Dropdowns
export const getStatuses = () => API.get("/Statuses");
export const getPriorities = () => API.get("/Priorities");
export const getCategories = () => API.get("/Categories");
export const getDepartments = () => API.get("/Departments");
//users
export const getAllusers = () => API.get("/users");
