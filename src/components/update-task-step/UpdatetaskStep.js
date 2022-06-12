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

function onChange(checked) {
  // console.log(`switch to ${checked}`);
}
let defaultData = [{ name: "name" }];

function UpdateTaskStep(props) {
  const [taskDetails, setTaskDetails] = useState(props && props);
  // const [formData, setFormData] = useState(props && props.existingTaskData);
  const [showContent, setShowContent] = useState(false);
  const [showPic, setShowpic] = useState(false);
  const [formData, setFormData] = useState({});
  const [nextData, setNextData] = useState(defaultData);

  const [myArray, SetmyArray] = useState([...nextData]);
  // const [error, seterror] = useState("");
  const [error, seterror] = useState(false);
  const [errorField, seterrorField] = useState("");

  const [taskData, setTaskData] = useState(defaultData);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setFormData(props.taskData);

    // console.log("USEEFFECT---taskID", props.existingTaskData?.task_id);
    // console.log("USEEFFECT---taskName", props.existingTaskData?.task_name);
    // console.log("USEEFFECT---ITEMDATA", props.existingTaskData?.itemData);

    // setFormData(props && props.existingTaskData?.itemData);
    // if (typeof abc?.itemData == "object") {
    //   console.log("HELLO");
    // } else {
    //   console.log("SORRY");
    // }
    // props && props.existingTaskData((item) => console.log("IREEM", item));
    // var user = JSON.parse(localStorage.getItem("item"));
    // console.log("user", user);
    // console.log("props.existingTaskData------", itemData);
    // // if (props && props.existingTaskData.item) {
    // //   console.log("existingTaskData");
    // //   setFormData(props && props.existingTaskData.item);
    // // }
    // if (itemData && itemData[0].itemData) {
    //   setFormData(itemData[0].itemData);
    // }
    // setShowContent();
  }, [props]);

  const handleContent = (checked) => {
    console.log("trrr", checked);

    setShowContent(checked);
    setFormData({
      ...formData,
      task_content_enable: checked,
    });
  };
  const handlePic = (checked) => {
    console.log("HandlePIC", checked);
    setShowpic(checked);
    setFormData({
      ...formData,
      task_picture_enable: checked,
    });
  };
  const handleInput = (event) => {
    // seterror("");
    seterror(false);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  let arr = nextData;
  const handleNext = () => {
    console.log("formData------", formData);
    if (formData == undefined) {
      seterror(true);
    } else {
      const obj = formData;
      obj.task_content_enable = formData.task_content_enable == true ? 1 : 0;
      obj.task_picture_enable = formData.task_picture_enable == true ? 1 : 0;
      obj.task_id = formData.task_id ? formData.task_id : taskDetails.taskId;
      obj.campaign_id = formData.campaign_id
        ? formData.campaign_id
        : +taskDetails.campaignId;

      if (obj.task_content_enable == 1 || obj.task_picture_enable == 1) {
        // setBtndis(false);
        // console.log("PASS", obj.task_id, "FORMDAAA", formData.task_id);
        console.log("obj------", obj);
        let index = arr.findIndex((x) => x.task_id === obj.task_id);
        console.log("index------", index);
        if (index == -1) {
          arr.push(obj);
        } else {
          arr[index] = obj;
        }
        console.log("arr------", arr);
        setNextData(arr);

        // setFormData(arr);

        displayLog(1, "Data added please move next tab");
        // if (
        //   obj.task_id &&
        //   obj.campaign_id &&
        //   obj.task_content_enable &&
        //   obj.task_picture_enable
        // ) {
        //   console.log("PUSH");
        //   arr.push(obj);
        //   setNextData(arr);
        // } else {
        //   console.log("ALRWEDY", arr);
        //   setNextData(arr);
        //   // setAlreadyData(obj);
        // }
      } else {
        // console.log("PLEASE ENBLE ONE");
        displayLog(0, "Please enable at least one task");
      }
      // console.log(
      //   "task_content_enable",
      //   obj.task_content_enable,
      //   "task_picture_enable",
      //   obj.task_picture_enable
      // );
      // console.log("showContent", showContent, "showPic", showPic);
      // console.log("OBJECT", obj);
      // if (formData.task_id == taskDetails.taskId) {
      //   console.log("PUSH");
      // } else {
      //   console.log("ALREADY");
      // }
      // arr.push(obj);
      // if (
      //   (obj.task_content_enable == 1 && showContent == false) ||
      //   (obj.task_picture_enable == 1 && showPic == false)
      // ) {
      //   setNextData(arr);
      //   // console.log("ffff", obj);
      //   displayLog(1, "Data added please move next tab");
      // } else if (showContent || showPic == true) {
      //   setNextData(arr);
      //   // console.log("ffff", obj);
      //   displayLog(1, "Data added please move next tab----------------------");
      // } else {
      //   displayLog(0, "Please enable at least one task");
      // }
    }
  };

  const handleSubmit = () => {
    // nextData.shift();
    // console.log("nextData after", nextData);
    console.log("formData in handleSubmit------", formData);

    if (formData == undefined) {
      seterror(true);
    } else {
      const obj = formData;
      obj.task_content_enable = formData.task_content_enable == true ? 1 : 0;
      obj.task_picture_enable = formData.task_picture_enable == true ? 1 : 0;
      obj.task_id = formData.task_id ? formData.task_id : taskDetails.taskId;
      obj.campaign_id = formData.campaign_id
        ? formData.campaign_id
        : +taskDetails.campaignId;
      if (obj.task_content_enable == 1 || obj.task_picture_enable == 1) {
        console.log("obj in handleSubmit------", obj);
        let index = nextData.findIndex((x) => x.task_id === obj.task_id);
        console.log("index in handleSubmit------", index);
        if (index == -1) {
          nextData.push(obj);
        } else {
          nextData[index] = obj;
        }
        console.log("arr in handleSubmit------", nextData);
        // nextData.shift();
        // nextData.push(obj);

        // console.log("")
        handleCampaign(nextData);
        // if (nextData.length == props.taskArray.length) {
        // } else {
        //   console.log("First click next button");
        // }
        // console.log("PASS", obj.task_id, "FORMDAAA", formData.task_id);
        // if (
        //   obj.task_id &&
        //   obj.campaign_id &&
        //   obj.task_content_enable &&
        //   obj.task_picture_enable
        // ) {
        //   console.log("OBJECT", nextData);
        // } else {
        //   console.log("ALRWEDY");
        //   setNextData(obj);
        //   // setAlreadyData(obj);
        // }
        // nextData.map((item) => {
        //   if (item.task_id == obj.task_id) {
        //     console.log("ALREADY");
        //   } else {
        //     console.log("OBJECT", nextData);
        //   }
        // });
        // arr.push(obj);
        // setNextData(arr);
      } else {
        console.log("PLEASE ENBLE ONE");
        displayLog(0, "Please enable at least one task");
      }
    }
    //   // if (nextData.length === props.taskArray.length) {
    //   //   console.log("HELLO");
    //   //   nextData.push(obj);
    //   //   handleCampaign(nextData);
    //   // } else {
    //   //   console.log("SORRY");
    //   //   displayLog(0, "Please Click Next button");
    //   //   // setTimeout(() => {
    //   //   //   window.location.reload();
    //   //   // }, 1000);
    //   // }
    //   // if (nextData.length == 0) {
    //   //   nextData.push(obj);
    //   //   // handleCampaign(nextData);
    //   // }
    //   // if (
    //   //   (obj.task_content_enable == 1 && showContent == false) ||
    //   //   (obj.task_picture_enable == 1 && showPic == false)
    //   // ) {
    //   //   if (nextData.length === props.taskArray.length) {
    //   //     console.log("NextDATA---", nextData);
    //   //     nextData.push(obj);
    //   //     handleCampaign(nextData);
    //   //   } else {
    //   //     console.log("sorry");
    //   //     // displayLog(0, "Please Fill Previous Data or click Next button");
    //   //     // setTimeout(() => {
    //   //     //   window.location.reload();
    //   //     // }, 1000);
    //   //   }
    //   // } else if (showContent || showPic == true) {
    //   //   nextData.push(obj);
    //   //   console.log("NextDATA---", nextData);
    //   //   if (nextData.length === props.taskArray.length) {
    //   //     handleCampaign(nextData);
    //   //   }
    //   // } else {
    //   //   displayLog(0, "Please enable at least one task");
    //   // }
    //   // if (
    //   //   (obj.task_content_enable == 1 && showContent == false) ||
    //   //   (obj.task_picture_enable == 1 && showPic == false)
    //   // ) {
    //   //   if (nextData.length === props.taskArray.length) {
    //   //     // console.log("NextDATA---", nextData);
    //   //     nextData.push(obj);
    //   //     handleCampaign(nextData);
    //   //   }
    //   // } else if (showContent || showPic == true) {
    //   //   nextData.push(obj);
    //   //   console.log("NextDATA---", nextData);
    //   //   if (nextData.length === props.taskArray.length) {
    //   //     handleCampaign(nextData);
    //   //   }
    //   // } else {
    //   //   displayLog(0, "Please enable at least one task");
    //   // }
    // }
  };
  // console.log("props.taskArray.length", props.taskArray[0]);
  const handleCampaign = (data) => {
    console.log("defaultData", data, props.taskArray.length);
    if (data[0].name) {
      data.shift();
      console.log("SHIFT", nextData.length, "gg", props.taskArray.length);
      console.log("FINALL", data, "PROPPSS ARRAY", props.taskArray.length);
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

      console.log("BODY-----", info);
      dispatch(campaignAction.createCampaignTask(info, token)).then(
        (response) => {
          if (response.data.code == 1) {
            console.log("resss---------------------", response);
            displayLog(response.data.code, response.data.message);
            history.push(Routes.MERCHANTSCAMPAIGNS);

            // setGetcategory(response.data.data);
          } else if (response.data.code == 0) {
            displayLog(response.data.code, response.data.message);
          }
        }
      );
    }

    // const abc = data.shift();

    // data.splice(0, 1);
    // console.log(data.indexOf(taskDetails.taskId));

    // if (data.length == props.taskArray.length) {
    //   const role = props && props.role;
    //   const token = props && props.accessToken;
    //   let info = {
    //     role: role,
    //     campaign_id: formData.campaign_id
    //       ? formData.campaign_id
    //       : +taskDetails.campaignId,
    //     task: data,
    //     merchant_id: localStorage.getItem("merchant_id")
    //       ? +localStorage.getItem("merchant_id")
    //       : 1,
    //   };

    //   console.log("BODY-----", info);
    //   // dispatch(campaignAction.createCampaignTask(info, token)).then(
    //   //   (response) => {
    //   //     if (response.data.code == 1) {
    //   //       console.log("resss---------------------", response);
    //   //       displayLog(response.data.code, response.data.message);
    //   //       history.push(Routes.MERCHANTSCAMPAIGNS);

    //   //       // setGetcategory(response.data.data);
    //   //     } else if (response.data.code == 0) {
    //   //       displayLog(response.data.code, response.data.message);
    //   //     }
    //   //   }
    //   // );
    // } else {
    //   // setBtndis(true);
    //   // displayLog(0, "Please Click the previous data");
    //   // setTimeout(() => {
    //   //   window.location.reload();
    //   // }, 1000);
    //   console.log("SORRY");
    // }
  };
  // console.log("merrr", formData);
  const goEditCampaign = (mid, cid) => {
    // console.log("FORMDDSDAA", mid, "fff", cid);
    history.push({
      pathname: "/update-campaign",
      state: { merchant_id: mid, campaign_id: cid },
    });
  };
  // console.log("SHOWCONTWEE", showContent);

  return (
    <div>
      {/* {console.log("In return", props.taskData)}, */}
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
                // value={taskDetails.existingTaskData.task_description}
                value={formData?.task_description}
              ></textarea>
            </div>
            <div className="form-group hashtags">
              <h3>Hashtags</h3>
              <textarea
                className="form-control"
                name="task_hashtags"
                onChange={handleInput}
                placeholder="Food, Travel, Life, Foodhub, yes"
                value={formData?.task_hashtags}
              ></textarea>
            </div>
            <div className="postSwitch">
              <div className="customSwitch">
                <Switch
                  size="small"
                  onChange={handleContent}
                  name="task_content_enable"
                  checked={
                    formData?.task_content_enable == 1 ? true : showContent
                  }
                  // checked={showContent}
                />
                <label>Enabled Content upload</label>
              </div>
              <div className="customSwitch">
                <Switch
                  size="small"
                  onChange={handlePic}
                  checked={formData?.task_picture_enable == 1 ? true : showPic}
                  // checked={showPic}
                  name="task_picture_enable"
                />
                <label>Enable Picture Upload</label>
              </div>
            </div>
          </div>
          <div>
            {error == true ? (
              <Alert color="danger">Please fill the details</Alert>
            ) : null}
          </div>
        </div>

        <div className="col-md-6">
          <div className="postedDetailRight">
            <div className="postedDetail">
              <span className="stepNumber">Step 1 of 2</span>
              <div className="postedContentArea">
                <h4>{taskDetails.taskName} Post</h4>
                <label>
                  {formData?.task_description
                    ? formData?.task_description
                    : "Please upload and send your draft for the Instagram Post."}
                </label>
                <p>
                  <small>HASHTAG TO BE USED</small>{" "}
                  {formData?.task_hashtags
                    ? formData?.task_hashtags
                    : "Food, Travel, Life, Foodhub,yes"}
                </p>

                {formData?.task_content_enable == 1 ? (
                  <div className="form-group form-groupRight">
                    <textarea
                      className="form-control"
                      placeholder="Content or Draft here"
                      readOnly="true"
                    ></textarea>
                  </div>
                ) : showContent == true ? (
                  <div className="form-group form-groupRight">
                    <textarea
                      className="form-control"
                      placeholder="Content or Draft here"
                      readOnly="true"
                    ></textarea>
                  </div>
                ) : null}
                {formData?.task_picture_enable == 1 ? (
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
                ) : showPic == true ? (
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
      </div>

      <div className="taskPostBtn d-flex justify-content-between">
        {props.taskArray[0] ? (
          <>
            {" "}
            <button
              className="btn btn-default-white"
              onClick={() => {
                history.push({
                  pathname: Routes.UPDATETASK,
                  search: `?campaign_id=${taskDetails.campaignId}`,
                  state: { accept_posting: taskDetails?.acceptPosting },
                });
              }}
            >
              Back
            </button>{" "}
          </>
        ) : (
          ""
        )}

        {/* <NavLink to={"/merchant-campaigns"} className="btn btn-default-white">
          Back
        </NavLink> */}
        {/* {console.log("FFF", formData)} */}

        {props.taskArray &&
        props.taskArray[props.taskArray.length - 1] == taskDetails.taskId ? (
          <>
            <button
              className="btn btn-default-blue"
              onClick={() => handleSubmit()}
            >
              Submit
            </button>{" "}
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
export default connect(mapStateToProps)(UpdateTaskStep);
