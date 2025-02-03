import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL; // Backend URL

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Login function
export const login = async (credentials) => {
  return await api.post("/login", credentials);
};

// Fetch posts
export const getPosts = async () => {
  return await api.get("/posts");
};
