import axios from "../../../configs/axiosConfig";
export const merchantCampaigns = (data, token) => async (dispatch) => {
  const headers = {
    language: "en",
    auth_token: token,
    web_app_version: "1.0.0",
    "Content-Type": "application/json",
  };
  const res = await axios.post("/campaignList", data, {
    headers: headers,
  });

  return res;
};
export const viewMerchantList = (data, token) => async (dispatch) => {
  const headers = {
    language: "en",
    auth_token: token,
    web_app_version: "1.0.0",
    "Content-Type": "application/json",
  };
  const res = await axios.post("/viewMerchantList", data, {
    headers: headers,
  });

  return res;
};
export const viewCampaignDetails = (data, token) => async (dispatch) => {
  const headers = {
    language: "en",
    auth_token: token,
    web_app_version: "1.0.0",
    "Content-Type": "application/json",
  };
  const res = await axios.post("/viewCampaignDetails", data, {
    headers: headers,
  });

  return res;
};
