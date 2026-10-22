export const PRESENCE_STATUSES = [
  { label: "Available", color: "#44b700" },
  { label: "Busy", color: "#f44336" },
  { label: "Do Not Disturb", color: "#f44336" },
  { label: "Be Right Back", color: "#ff9800" },
  { label: "Appear Away", color: "#ff9800" },
  { label: "Offline", color: "#bdbdbd" },
];

export const getPresenceColor = (status) =>
  PRESENCE_STATUSES.find((s) => s.label === status)?.color || "#bdbdbd";
