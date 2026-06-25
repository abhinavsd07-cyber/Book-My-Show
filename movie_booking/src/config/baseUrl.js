const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.PROD) {
    return "/api";
  }
  return "http://localhost:5000/api";
};

const BASE_URL = getBaseUrl();
export default BASE_URL;
