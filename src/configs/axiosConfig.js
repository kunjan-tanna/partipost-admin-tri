import axios from "axios";
require("dotenv").config();

//NGROK URL
// const axiosInstance = axios.create({
//   baseURL:
//     process.env.API_URL ||
//     "https://c5aa-2405-201-2016-e00f-b0b3-c11-7028-9603.ngrok.io/api/v1AdminRoutes",
// });
// export default axios.create({
//   baseURL: "https://c5aa-2405-201-2016-e00f-b0b3-c11-7028-9603.ngrok.io",
// });

//Live URL
const axiosInstance = axios.create({
  baseURL:
    process.env.API_URL ||
    "https://api.easyconnect.com.sg:8443/api/v1AdminRoutes",
});

// axiosInstance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE'
export default axiosInstance;
