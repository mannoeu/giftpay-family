import { api } from "@/services/api";

export const getProfile = () => {
  return api.get("/main/user/details");
};

export const updateProfile = ({ data }) => {
  return api.patch("/main/user/details", data);
};
