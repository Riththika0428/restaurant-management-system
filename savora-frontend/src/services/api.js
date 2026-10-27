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
      message = 'Cannot reach the server. Make sure the API is running on port 5000.';
    } else {
      const body = error.response.data;
      const fieldErrors = Array.isArray(body?.errors) ? body.errors : [];

      if (error.response.status === 422 && fieldErrors.length > 0) {
        message = fieldErrors[0].message;
      } else if (body?.message) {
        message = body.message;
      }
    }

    const normalized = new Error(message);
    normalized.status = error.response?.status;
    normalized.details = error.response?.data?.errors || null;
    return Promise.reject(normalized);
  }
);

export default api;