import axios from "../../../configs/axiosConfig";

export const login = (user) => async (dispatch) => {
  // console.log("USERR", user);
  const headers = {
    language: "en",
    auth_token:
      "@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#FKDFJSDLFJSDLFJSDLFJSDQY",
    web_app_version: "1.0.0",
    "Content-Type": "application/json",
  };
  const res = await axios.post("/login", user, {
    headers: headers,
  });
  return res;
};
//Forgot the Password
export const forgotPass = (user) => async (dispatch) => {
  // console.log("USERR", user);
  const headers = {
    language: "en",
    auth_token:
      "@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#FKDFJSDLFJSDLFJSDLFJSDQY",
    web_app_version: "1.0.0",
    "Content-Type": "application/json",
  };
  const res = await axios.post("/forgot_password", user, {
    headers: headers,
  });
  return res;
};
//Reset the Passord
export const resetPass = (data) => async (dispatch) => {
  // console.log("USERR", user);
  const headers = {
    language: "en",
    auth_token:
      "@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#FKDFJSDLFJSDLFJSDLFJSDQY",
    web_app_version: "1.0.0",
    "Content-Type": "application/json",
  };
  const res = await axios.post("/reset_password", data, {
    headers: headers,
  });
  return res;
};
//Logout the user

export const logout = (data, token) => async (dispatch) => {
  const headers = {
    language: "en",
    auth_token: token,
    web_app_version: "1.0.0",
    "Content-Type": "application/json",
  };
  const res = await axios.post("/logout", data, {
    headers: headers,
  });

  return res;
};
export const NotificationCount = (data, token) => async (dispatch) => {
  const headers = {
    language: "en",
    auth_token: token,
    web_app_version: "1.0.0",
    "Content-Type": "application/json",
  };
  const res = await axios.post("/getReadNotificationCount", data, {
    headers: headers,
  });

  return res;
};
