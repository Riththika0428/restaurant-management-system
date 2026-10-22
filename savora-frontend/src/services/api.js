import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Something went wrong. Please try again.';

    if (error.code === 'ECONNABORTED') {
      message = 'The request timed out. Please try again.';
    } else if (!error.response) {
      message = 'Cannot reach the server. Check your connection.';
    } else if (error.response.data?.message) {
      message = error.response.data.message;
    }

    const normalized = new Error(message);
    normalized.status = error.response?.status;
    normalized.details = error.response?.data?.errors || null;
    return Promise.reject(normalized);
  }
);

export default api;