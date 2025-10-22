import axios from "axios";
import { validate } from "./ticketingApis";

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const jwt_token = localStorage.getItem("jwt_token");
    if (jwt_token) {
      config.headers["Authorization"] = "Bearer " + jwt_token;
    }
    return config;
  },
  (error) => {
    console.log(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      validate()
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          localStorage.removeItem("jwt_token");
          window.history.pushState({ urlPath: "/" }, "", "/");
          window.location.reload();
        });
    }

    throw error;
  }
);

export default instance;
