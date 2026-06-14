import axios from "axios";

const API = axios.create({
  baseURL: "https://bookmyshow-server-json.onrender.com",
});

export default API;
