import { API_BASE_URL } from "../config";

export const getFileUrl = (filePath) => {
  if (!filePath) return "";
  if (filePath.startsWith("http")) return filePath;
  const cleanPath = filePath.replace(/^\/+/, "");
  return `${API_BASE_URL}/${cleanPath}`;
};
