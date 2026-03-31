import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const fetchProfile = (username) => {
  return API.get(`/profile/${username}`);
};