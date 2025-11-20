import axios from "axios";
import { configDotenv } from 'dotenv';
configDotenv();

const api = axios.create({
  baseURL: process.env.BACKEND_BASE_URL,
  withCredentials: true 
});

export default api;