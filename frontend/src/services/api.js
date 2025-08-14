import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:4000/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

// interceptors for error handling / auth (placeholder)
api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Return structured error
    const msg = err?.response?.data?.error || err.message;
    return Promise.reject(new Error(msg));
  }
);

export const fetchExecutions = (params) =>
  api.get("/executions", { params }).then((r) => r.data);
export const fetchSummary = (params) =>
  api.get("/executions/summary", { params }).then((r) => r.data);
export const fetchChartData = (params) =>
  api.get("/executions/chart-data", { params }).then((r) => r.data);
export default api;
