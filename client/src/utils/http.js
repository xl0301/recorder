import axios from "axios";

const http = axios.create({
  timeout: 5000,
});
http.interceptors.response.use((req) => {
  return req.data;
});

export default http;
