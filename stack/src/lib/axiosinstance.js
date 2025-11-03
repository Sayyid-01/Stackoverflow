import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
    },
});
axiosInstance.interceptors.request.use(() => {
  if(typeof window !== "undefined"){
    const user = localStorage.getItem("user");
    if(user){
      const token = JSON.parse(user).token;
      if(token){
        return {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    }
  }
})
export default axiosInstance;