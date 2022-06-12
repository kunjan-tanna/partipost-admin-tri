import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import Joi from "joi-browser";
import Userinfo from "../../configs/dashboard";
import Header from "../../components/header/header";
import "antd/dist/antd.css";
import { DatePicker, Space, Upload, message, Button, Image, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { connect, useDispatch } from "react-redux";
import * as merchantAction from "../../redux/actions/merchantSignUp";
import { displayLog } from "../../utils/functions";
import Loader from "../../utils/Loader";
import { Alert } from "reactstrap";
import * as functions from "../../utils/functions";
import { apiCall } from "../../utils/common";

function onChange(date, dateString) {
  // console.log(date, dateString);
}

const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      // console.log("KUNJANN", info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function Setting(props) {
  // const { merchant_id } = useLocation().state;

  const [fileError, setFileerror] = useState("");
  const [errorField, seterrorField] = useState("");
  const [loading, setloading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [viewProfile, setViewProfile] = useState({});
  const [ImageData, setImageData] = useState(null);
  const [formValue, setformValue] = useState({});
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    // setloading(true);
    getRatingPercentage();
  }, []);

  const getRatingPercentage = async () => {
    let reqData = {};
    let res = await apiCall("POST", "getRatingPercentage", reqData);
    if (res.code == 1) {
      setformValue(res.data);
    } else {
      displayLog(res.code, res.message);
    }
  };
  //Handle the Input event
  const handleInput = (event) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
    setError("");
  };
  const handleSubmit = async (response) => {
    if (formValue.set_rating_percentage == undefined) {
      setError("Please Fill the Field");
    } else {
      const reqData = {
        set_rating_percentage: +formValue.set_rating_percentage,
      };
      let res = await apiCall("POST", "updateRatingPercentage", reqData);
      if (res.code == 1) {
        displayLog(1, "Successfully Update Rating");
      } else {
        displayLog(res.code, res.message);
      }

      console.log("ratinng", reqData);
    }
  };

  console.log("formValue", formValue);
  return (
    <div>
      <Header />
      <section className="merchantsList">
        {loading && <Loader />}
        <div className="container">
          <div className="colBg defaultForm">
            <div className="row">
              <div className="col-md-6 pr-9">
                <div className="form-group">
                  <label>Top Rating Percentage</label>
                  <input
                    placeholder="Top Rating Percentage"
                    value={formValue?.set_rating_percentage}
                    type="number"
                    name="set_rating_percentage"
                    className="form-control"
                    onChange={handleInput}
                  />
                </div>
                {error ? <p style={{ color: "red" }}>{error}</p> : null}
              </div>
            </div>
            <div className="formBtn">
              <button
                className="btn btn-default-blue"
                onClick={() => handleSubmit()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    accessToken: state.loginReducer.accessToken,
    role: state.loginReducer.role,
  };
};
export default connect(mapStateToProps)(Setting);
