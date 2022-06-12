import axios from "axios";

//LIVE URL
export default axios.create({
  baseURL: "https://api.easyconnect.com.sg:8443/api/v1AdminRoutes/",
});

// //NGROK URL
// export default axios.create({
//   baseURL: "https://c5aa-2405-201-2016-e00f-b0b3-c11-7028-9603.ngrok.io",
// });
