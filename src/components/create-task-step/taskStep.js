import React, { Component, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink, useHistory } from "react-router-dom";
import "antd/dist/antd.css";
import { Switch } from "antd";
import { Upload, message, Button } from "antd";
import * as functions from "../../utils/functions";
import { Alert } from "reactstrap";
import { displayLog } from "../../utils/functions";

import Joi from "joi-browser";
import { connect, useDispatch } from "react-redux";
import * as campaignAction from "../../redux/actions/Campaign/index";
import $ from "jquery";
import { apiCall } from "../../utils/common";

function onChange(checked) {
  // console.log(`switch to ${checked}`);
}
let defaultData = [{ name: "name" }];
function TaskStep(props) {
  // console.log("PROOOO", props);
  const [taskDetails, setTaskDetails] = useState(props && props);
  const [showContent, setShowContent] = useState(false);
  const [showPic, setShowpic] = useState(false);
  const [formData, setFormData] = useState([]);
  const [nextData, setNextData] = useState(defaultData);
  const [myArray, SetmyArray] = useState([]);
  const [error, seterror] = useState("");
  const [errorField, seterrorField] = useState("");

  const [taskData, setTaskData] = useState(defaultData);

  const dispatch = useDispatch();
  const history = useHistory();

  // console.log("FFHHH", props.acceptPosting);

  //handle the  show content
  const handleContent = (checked) => {
    setShowContent(checked);
  };
  //handle the show pic
  const handlePic = (checked) => {
    setShowpic(checked);
  };
  //handle the input
  const handleInput = (event) => {
    seterror("");
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  let arr = nextData;

  const handleNext = () => {
    if (showContent || showPic == true) {
      const obj = formData;
      obj.task_content_enable = showContent == true ? 1 : 0;
      obj.task_picture_enable = showPic == true ? 1 : 0;
      obj.task_id = taskDetails.taskId;
      obj.campaign_id = +taskDetails.campaignId;

      let index = arr.findIndex((x) => x.task_id === obj.task_id);
      // console.log("index------", index);
      if (index == -1) {
        arr.push(obj);
      } else {
        arr[index] = obj;
      }
      // console.log("arr------", arr);
      setNextData(arr);

      displayLog(1, "Data added please move next tab");
    } else {
      displayLog(0, "Please enable at least one task");
    }
  };
  const handleSubmit = () => {
    // nextData.shift();
    if (showContent || showPic == true) {
      const obj = formData;
      obj.task_content_enable = showContent == true ? 1 : 0;
      obj.task_picture_enable = showPic == true ? 1 : 0;
      obj.task_id = taskDetails.taskId;
      obj.campaign_id = +taskDetails.campaignId;

      let index = nextData.findIndex((x) => x.task_id === obj.task_id);
      // console.log("index in handleSubmit------", index);
      if (index == -1) {
        nextData.push(obj);
      } else {
        nextData[index] = obj;
      }
      // console.log("arr in handleSubmit------", nextData);
      // nextData.shift();
      // nextData.push(obj);

      // console.log("")
      handleCampaign(nextData);

      // nextData.push(obj);
      // console.log("NEXTDATA", nextData, "TASKARRAY", props.taskArray);
      // if (nextData.length == props.taskArray.length) {
      //   console.log("HELLO");
      //   handleCampaign(nextData);
      // } else {
      //   console.log("SORRY");
      //   displayLog(0, "Please Fill Previous Data or click Next button");
      //   // setTimeout(() => {
      //   //   window.location.reload();
      //   // }, 1000);
      // }
    } else {
      displayLog(0, "Please enable at least one task");
    }

    // console.log("hewllo====", obj);
    // console.log("ggg", myArray);
    // handleCampaign(obj, nextData);

    // console.log("props.taskArray", props.taskArray, taskDetails.taskId);
  };

  const handleCampaign = (data) => {
    if (data[0].name) {
      data.shift();
      // console.log("SHIFT", nextData.length, "gg", props.taskArray.length);
      // console.log("FINALL", data, "PROPPSS ARRAY", props.taskArray.length);
      if (nextData.length != props.taskArray.length) {
        displayLog(0, "Please Click the previous data");
      }
    }
    if (data.length == props.taskArray.length) {
      const role = props && props.role;
      const token = props && props.accessToken;
      let info = {
        role: role,
        campaign_id: formData.campaign_id
          ? formData.campaign_id
          : +taskDetails.campaignId,
        task: data,
        merchant_id: localStorage.getItem("merchant_id")
          ? +localStorage.getItem("merchant_id")
          : 1,
      };

      // console.log("BODY-----", info);
      dispatch(campaignAction.createCampaignTask(info, token)).then(
        (response) => {
          if (response.data.code == 1) {
            // console.log("resss---------------------", response);
            displayLog(response.data.code, response.data.message);
            history.push(Routes.MERCHANTSCAMPAIGNS);

            // setGetcategory(response.data.data);
          } else if (response.data.code == 0) {
            displayLog(response.data.code, response.data.message);
          }
        }
      );
    }
    // data.shift();
  };

  //handle the accpet post request
  const handleAccept = async () => {
    // accept_posting : 1
    let req_data = {
      campaign_id: +taskDetails.campaignId,
      role: +localStorage.getItem("role"),
      accept_posting: 1,
    };
    if (+localStorage.getItem("role") == 1) {
      req_data.merchant_id = +localStorage.getItem("merchant_id");
    }
    // console.log("Hello", req_data);
    let res = await apiCall("POST", "acceptPosting", req_data);

    if (res.code == 1) {
      history.push(Routes.MERCHANTSCAMPAIGNS);
    } else if (res.code == 0) {
      displayLog(res.code, res.message);
    }
  };
  //handle the decline post request
  const handleDecline = async () => {
    // accept_posting : 0 - decline
    let req_data = {
      campaign_id: +taskDetails.campaignId,
      role: +localStorage.getItem("role"),
      accept_posting: 0,
    };
    if (+localStorage.getItem("role") == 1) {
      req_data.merchant_id = +localStorage.getItem("merchant_id");
    }
    // console.log("Hello----", req_data);
    let res = await apiCall("POST", "acceptPosting", req_data);

    if (res.code == 1) {
      history.push(Routes.MERCHANTSCAMPAIGNS);
    } else if (res.code == 0) {
      displayLog(res.code, res.message);
    }
  };
  return (
    <div>
      <div className="row taskPost taskPostStep1">
        <div className="col-md-6">
          <div className="postDescription">
            <h2>{taskDetails.taskName} Post</h2>
            <div className="form-group description">
              <h3>Description</h3>
              <textarea
                className="form-control"
                name="task_description"
                placeholder="Please upload and send your draft for the Instagram Post."
                onChange={handleInput}
              ></textarea>
            </div>
            <div className="form-group hashtags">
              <h3>Hashtags</h3>
              <textarea
                className="form-control"
                name="task_hashtags"
                onChange={handleInput}
                placeholder="Food, Travel, Life, Foodhub, yes"
              ></textarea>
            </div>
            <div className="postSwitch">
              <div className="customSwitch">
                <Switch
                  size="small"
                  onChange={handleContent}
                  name="task_content_enable"
                  checked={showContent}
                />
                <label>Enabled Content upload</label>
              </div>
              <div className="customSwitch">
                <Switch
                  size="small"
                  onChange={handlePic}
                  checked={showPic}
                  name="task_picture_enable"
                />
                <label>Enable Picture Upload</label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="postedDetailRight">
            <div className="postedDetail">
              <span className="stepNumber">Step 1 of 2</span>
              <div className="postedContentArea">
                <h4>{taskDetails.taskName} Post</h4>
                <label>
                  {formData.task_description
                    ? formData.task_description
                    : "Please upload and send your draft for the Instagram Post."}
                </label>
                <p>
                  <small>HASHTAG TO BE USED</small>{" "}
                  {formData.task_hashtags
                    ? formData.task_hashtags
                    : "Food, Travel, Life, Foodhub,yes"}
                </p>
                {showContent == true ? (
                  <div className="form-group form-groupRight">
                    <textarea
                      className="form-control"
                      placeholder="Content or Draft here"
                      readOnly="true"
                    ></textarea>
                  </div>
                ) : null}
                {showPic == true ? (
                  <div className="form-group">
                    <div className="uploadPic pointer-events-none">
                      <Upload>
                        <Button>
                          <img src="images/upload-img.png" alt="" /> Upload
                          Photo(s)
                        </Button>
                      </Upload>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div>{error !== "" ? <Alert color="danger">{error}</Alert> : null}</div>
      </div>
      <div className="taskPostBtn d-flex justify-content-between">
        <NavLink
          to={`/create-task?campaign_id=${taskDetails.campaignId}`}
          className="btn btn-default-white"
        >
          Back
        </NavLink>
        {/* {console.log("PROPPARRAY", props.taskArray)} */}
        {props.taskArray &&
        props.taskArray[props.taskArray.length - 1] == taskDetails.taskId ? (
          <>
            {" "}
            <button
              className="btn btn-default-blue btn-submit"
              onClick={() => handleSubmit()}
            >
              submit
            </button>{" "}
            <div className="floating-btns">
              <div className="container">
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-accept"
                    onClick={() => handleAccept()}
                  >
                    Accept posting
                  </button>
                  <button
                    className="btn btn-decline"
                    onClick={() => handleDecline()}
                  >
                    Decline posting
                  </button>
                </div>
              </div>
            </div>{" "}
          </>
        ) : (
          <button className="btn btn-default-blue" onClick={() => handleNext()}>
            Save
          </button>
        )}
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    accessToken: state.loginReducer.accessToken,
    role: state.loginReducer.role,
  };
};
export default connect(mapStateToProps)(TaskStep);
