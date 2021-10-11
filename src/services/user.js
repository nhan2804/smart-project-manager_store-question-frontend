import axios from "config/axios";

export const getProfile = () => {
  return axios.get("/auth/user-profile");
};

export const getUsersInfo = (data) => {
  return axios.post("/user", data)
}
