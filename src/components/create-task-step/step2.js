import React, { Component } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink } from "react-router-dom";
import "antd/dist/antd.css";
import { Switch, Upload, message, Button } from "antd";

function onChange(checked) {}
const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

function StepTwo() {
  return (
    <div>
      <div className="row taskPost taskPostStep2">
        <div className="col-md-6">
          <div className="postDescription">
            <h2>Instagram Post (Approved Template)</h2>
            <div className="form-group description">
              <h3>Description</h3>
              <textarea
                className="form-control"
                placeholder="Please send here the URL and the screenshot of your post."
              ></textarea>
            </div>
            <div className="postSwitch">
              <div className="customSwitch">
                <Switch size="small" defaultChecked />
                <label>Enabled URL upload</label>
              </div>
              <div className="customSwitch">
                <Switch size="small" defaultChecked />
                <label>Enabled Picture Upload</label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="postedDetailRight">
            <div className="postedDetail">
              <span className="stepNumber">Step 2 of 2</span>
              <div className="postedContentArea">
                <h4>Approved Instagram Post</h4>
                <label>
                  Please send here the URL and the screenshot of your post.
                </label>
                <div className="form-group form-groupRight">
                  <textarea
                    className="form-control"
                    placeholder="Upload URL Here"
                  ></textarea>
                </div>
                <div className="form-group">
                  <div className="uploadPic">
                    <Upload {...props}>
                      <Button>
                        <img src="images/upload-img.png" alt="" /> Upload
                        Photo(s)
                      </Button>
                    </Upload>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepTwo;
