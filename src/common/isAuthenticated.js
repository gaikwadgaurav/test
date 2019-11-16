export const isAuthenticated = () => {
  return JSON.parse(localStorage.getItem("userData"));
};
