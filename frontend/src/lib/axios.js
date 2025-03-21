import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  // then we would like to send our cookies in every single request, so mark withCredentials as true
  withCredentials: true
})