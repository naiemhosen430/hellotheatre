import axios from "axios";
import { getCookie } from "cookies-next";

// Get token from cookies
const token = getCookie("accesstoken");

// Get the base URL from environment variables
const apiBaseURL = process.env.SERVER_URL;

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "https://api-hellotheatre.onrender.com",
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

export default axiosInstance;
