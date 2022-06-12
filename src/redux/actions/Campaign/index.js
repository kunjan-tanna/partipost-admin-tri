import axios from "../../../configs/axiosConfig";
export const getCategory = () => async (dispatch) => {
  const res = await axios.get("/getCategory");

  return res;
};
export const getTaskList = () => async (dispatch) => {
  const res = await axios.get("/getTaskList");
  if (res) {
    dispatch({ type: "TASK_LIST", payload: res.data.data });
  }

  return res;
};
export const createCampaign = (data, token) => async (dispatch) => {
  const headers = {
    language: "en",
    auth_token: token,
    web_app_version: "1.0.0",
    "Content-Type": "application/json",
  };
  const res = await axios.post("/createCampaign", data, {
    headers: headers,
  });

  return res;
};
export const createCampaignTask = (data, token) => async (dispatch) => {
  const headers = {
    language: "en",
    auth_token: token,
    web_app_version: "1.0.0",
    "Content-Type": "application/json",
  };
  const res = await axios.post("/createCampaignTask", data, {
    headers: headers,
  });

  return res;
};
