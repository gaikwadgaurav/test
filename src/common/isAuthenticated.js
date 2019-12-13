export const isAuthenticated = () => {
  return JSON.parse(localStorage.getItem("userData"));
};

export const isAuthenticatedToken = () => {
  return JSON.parse(localStorage.getItem("token"));
};
