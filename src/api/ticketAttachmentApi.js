// import axios from "axios";
import API from "./api";
// const API = axios.create({
//   baseURL: "https://localhost:7104/api",
// });

// Ticket Attachments
// GET ALL
export const getAllTicketAttachments = () => API.get("/ticketattachments");
// GET BY ID
// export const getTicketAttachmentById = (id) =>
//   API.get(`/ticketattachments/${id}`);
export const getAttachmentsByTicketId = (ticketId) => {
  return API.get(`/ticketattachments/${ticketId}`);
};

//export const getAttachmentsByTicketId = async (ticketId) => {
//   return await axios.get(`/ticketattachments/${ticketId}`);
//};

// CREATE (if normal create exists)
export const createTicketAttachment = (data) =>
  API.post("/ticketattachments", data);
// UPDATE
export const updateTicketAttachment = (id, data) =>
  API.put(`/ticketattachments/${id}`, data);
// DELETE
export const deleteTicketAttachment = (id) =>
  API.delete(`/ticketattachments/${id}`);
// ==============================
// 🔥 FILE UPLOAD (IMPORTANT)
// ==============================
export const uploadTicketAttachment = (formData) =>
  API.post("/ticketattachments/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
// ==============================
// 🔥 BULK DELETE (If You Created Backend)
// ==============================
export const bulkDeleteTicketAttachments = (ids) =>
  API.post("/TicketAttachment/bulk-delete", ids);
