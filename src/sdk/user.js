export const getFirstName = (user) => {
  const raw = user?.first_name || user?.name || "";
  return String(raw).trim().split(/\s+/)[0] || "";
};
