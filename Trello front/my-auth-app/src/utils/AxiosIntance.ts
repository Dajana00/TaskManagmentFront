import axios from "axios";



export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Postavljen je token u header", token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(
          process.env.REACT_APP_API_URL + "/auth/refresh",
          JSON.stringify(refreshToken), 
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        
        const accessToken = response.data.accessToken;
        localStorage.setItem("accessToken",accessToken);
        localStorage.setItem("refreshToken",response.data.refreshToken);
        console.log("Osvejeni token: ",accessToken);
        console.log("refresh token",refreshToken);
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return axios.request(error.config);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
