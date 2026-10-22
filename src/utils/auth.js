/** @deprecated Prefer useAuth() in React components */
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

/** @deprecated Prefer useAuth() in React components */
export const getRole = () => getUser()?.roleName || "";

export const isAdminRole = (role) => role === "Admin";
export const isAgentRole = (role) => role === "Agent";
export const isUserRole = (role) => role === "User";
export const canManageTickets = (role) =>
  isAdminRole(role) || isAgentRole(role);
