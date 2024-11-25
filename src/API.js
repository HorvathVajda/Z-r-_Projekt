import axios from "axios";

// Alap URL a backendhez
const API = axios.create({
  baseURL: "http://localhost:5000/api", // A backend elérhetősége
  headers: {
    "Content-Type": "application/json",
  },
});

// Regisztráció
export const register = (userData) => API.post("/auth/register", userData);

// Bejelentkezés
export const login = (loginData) => API.post("/auth/login", loginData);

export default API;
