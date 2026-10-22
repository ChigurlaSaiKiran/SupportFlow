export const getTicketStatusColor = (statusName) => {
  if (!statusName) return "default";
  const s = String(statusName).toLowerCase();
  if (s === "open" || s === "new") return "info";
  if (s === "in progress" || s === "inprogress" || s === "pending")
    return "warning";
  if (s === "closed") return "success";
  return "default";
};
