import { api } from "@/services/api";

export const login = ({ username, password }) => {
  return api.post("/login/token/", { username, password });
};

export const changePassword = ({ password }) => {
  return api.post("/main/user/change_password", { password });
};
