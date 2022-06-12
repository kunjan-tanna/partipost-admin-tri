import React from "react";
import axios from "./config";
import Joi from "joi-browser";
import { displayLog } from "./functions";

export const validateSchema = (body, schema) => {
  return new Promise((resolve, reject) => {
    Joi.validate(body, schema, (error, value) => {
      if (error) {
        let msg;
        let key =
          error.details[0].context.label || error.details[0].context.key;
        if (error.details[0].type.includes("empty")) {
          msg = key.replace(/_/g, " ") + " is required!";
          msg = msg.charAt(0).toUpperCase() + msg.slice(1);
        } else if (error.details[0].type.includes("string.min")) {
          msg =
            key.replace(/_/g, " ") +
            " length must be at least " +
            error.details[0].context.limit +
            " characters long!";
          msg = msg.charAt(0).toUpperCase() + msg.slice(1);
        } else if (error.details[0].type.includes("string.max")) {
          msg =
            key.replace(/_/g, " ") +
            " length must be less than or equal to " +
            error.details[0].context.limit +
            " characters long!";
          msg = msg.charAt(0).toUpperCase() + msg.slice(1);
        } else if (error.details[0].type.includes("number.min")) {
          msg =
            key.replace(/_/g, " ") +
            "should be greater than or equal to " +
            error.details[0].context.limit;
          msg = msg.charAt(0).toUpperCase() + msg.slice(1);
        } else if (error.details[0].type.includes("number.max")) {
          msg =
            key.replace(/_/g, " ") +
            " should be less than or equal to " +
            error.details[0].context.limit;
          msg = msg.charAt(0).toUpperCase() + msg.slice(1);
        } else if (error.details[0].type.includes("allowOnly")) {
          msg = "Password and confirm password must be same!";
          msg = msg.charAt(0).toUpperCase() + msg.slice(1);
        } else {
          msg = "Please enter a valid " + key.replace(/_/g, " ") + "!";
        }
        resolve({
          status: true,
          message: msg,
        });
      } else {
        resolve({
          status: false,
          message: "",
        });
      }
    });
  });
};

export const formValueChangeHandler = (e, formValue) => {
  // console.log(e.target, e.target.name, e.target.value, e.target.type, e.target.checked);
  let name = e.target.name;
  const value =
    e.target.type === "checkbox" ? e.target.checked : e.target.value;
  if (name.includes(".")) {
    const path = name.split(".");
    setDeep(formValue, path, value);
  } else if (name.match(/\[(.*?)\]/)) {
    let index = name.match(/\[(.*?)\]/)[1];
    name = name.split("[")[0];
    console.log(name, index);
    formValue[name][index] = value;
  } else {
    formValue[name] = value;
  }
  // console.log(formValue);
  return formValue;
};

export const formValueChangeHandlerFoArray = (
  e,
  formValue,
  arrayName,
  index
) => {
  const newFormValue = { ...formValue };
  const newArrayValue = formValueChangeHandler(e, formValue[arrayName][index]);
  newFormValue.attributes[index] = newArrayValue;
  return newFormValue;
};

export const setDeep = (obj, path, value, setrecursively = false) => {
  let level = 0;
  path.reduce((a, b) => {
    level++;
    if (
      setrecursively &&
      typeof a[b] === "undefined" &&
      level !== path.length
    ) {
      a[b] = {};
      return a[b];
    }
    if (level === path.length) {
      a[b] = value;
      return value;
    } else {
      return a[b];
    }
  }, obj);
  return obj;
};

export const apiCall = async (method, url, reqData, params, header) => {
  return new Promise((resolve, reject) => {
    let headers;
    if (header) {
      headers = header;
    } else {
      headers = {
        language: "en",
        auth_token:
          "@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#FKDFJSDLFJSDLFJSDLFJSDQY",
        web_app_version: "1.0.0",
        Accept: "application/json",
        "Content-Type": "application/json",
      };
    }
    if (localStorage.getItem("auth_token") !== null && !header) {
      headers.auth_token = localStorage.getItem("auth_token");
    }
    axios({
      method: method,
      url: url,
      data: reqData,
      headers: headers,
      params: params,
    })
      .then((response) => {
        console.log("\n\n\n RESPONSE :::", response);
        let data = response.data;
        if (data.code === 401) {
          displayLog(data.code, "Session Expired, Please Login Again");
          localStorage.clear();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else if (data.code === 0) {
          displayLog(data.code, data.message);
        } else {
          resolve(data);
        }
      })
      .catch(async (error) => {
        if (error && error.response && error.response.status === 401) {
          displayLog(0, "Session Expired, Please Login Again");
          localStorage.clear();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          //displayLog(0, "Network error!");
        }
        return error;
      });
  });
};
