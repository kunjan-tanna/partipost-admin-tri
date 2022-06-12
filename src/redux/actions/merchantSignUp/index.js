import axios from "../../../configs/axiosConfig";

//Register the Merchant Account
export const merchantSignUp = (data) => async (dispatch) => {
  const headers = {
    language: "en",
    auth_token:
      "@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#FKDFJSDLFJSDLFJSDLFJSDQY",
    web_app_version: "1.0.0",
    "Content-Type": "application/json",
  };
  const res = await axios.post("/merchantSignup", data, {
    headers: headers,
  });
  return res;
};

export const SignUpWithGoogleOrFacebook = (id) => async (dispatch) => {
  // console.log("GOOOGGG", id);
  const headers = {
    language: "en",
    auth_token:
      "@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#FKDFJSDLFJSDLFJSDLFJSDQY",
    web_app_version: "1.0.0",
    "Content-Type": "application/json",
  };
  const res = await axios.post("/loginWithGoogleOrFacebook", id, {
    headers: headers,
  });
  return res;
};
//Get the Merchant Profile
export const viewMerchantProfile =
  (token, role, merchant_id) => async (dispatch) => {
    const headers = {
      language: "en",
      auth_token: token,
      web_app_version: "1.0.0",
      "Content-Type": "application/json",
    };
    if (merchant_id) {
      const res = await axios.get(
        `/viewMerchantProfile?role=${role}&merchant_id=${merchant_id}`,
        {
          headers: headers,
        }
      );
      return res;
    } else {
      const res = await axios.get(`/viewMerchantProfile?role=${role}`, {
        headers: headers,
      });
      return res;
    }
  };
//Update the Merchant Profile
export const updateMerchantProfile = (data, token) => async (dispatch) => {
  const headers = {
    language: "en",
    auth_token: token,
    web_app_version: "1.0.0",
    "Content-Type": "application/json",
  };
  const res = await axios.post("/editMerchantProfile", data, {
    headers: headers,
  });

  return res;
};
