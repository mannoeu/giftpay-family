export const getFirstName = (username) => {
  const raw = username || "";
  return String(raw).trim().split(/\s+/)[0] || "";
};
