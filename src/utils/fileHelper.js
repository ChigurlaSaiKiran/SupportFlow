// export const getFileUrl = (path) => {
//   if (!path) return "";

//   if (path.startsWith("http")) return path;

//   return `https://localhost:7104${path}`;
// };

// export const getFileUrl = (filePath) => {
//   const baseUrl = "https://localhost:7104";
//   return `${baseUrl}/${filePath}`;
// };

export const getFileUrl = (filePath) => {
  if (!filePath) return "";

  const baseUrl = "https://localhost:7104";

  //   return filePath.startsWith("http") ? filePath : `${baseUrl}/${filePath}`;

  if (filePath.startsWith("http")) return filePath;

  // Remove starting slash if exists
  const cleanPath = filePath.replace(/^\/+/, "");

  return `${baseUrl}/${cleanPath}`;
  //return `${baseUrl}/${filePath.replace(/^\/+/, "")}`;
};
