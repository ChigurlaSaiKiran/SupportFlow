let onLogout = null;

export const registerLogoutHandler = (handler) => {
  onLogout = handler;
};

export const notifyLogout = () => {
  onLogout?.();
};
