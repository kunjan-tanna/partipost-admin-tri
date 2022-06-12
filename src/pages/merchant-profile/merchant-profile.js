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

function MerchantProfile(props) {
  // const { merchant_id } = useLocation().state;

  const [error, seterror] = useState("");
  const [fileError, setFileerror] = useState("");
  const [errorField, seterrorField] = useState("");
  const [loading, setloading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [viewProfile, setViewProfile] = useState({});
  const [ImageData, setImageData] = useState(null);
  const [updateProfile, setUpdateProfile] = useState({});

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setloading(true);

    const token = props && props.accessToken;

    const role = props && props.role;

    // if (role == 1) {
    //   obj.merchant_id = merchant_id;
    // }

    // console.log("reqData", reqData);
    setTimeout(() => {
      dispatch(merchantAction.viewMerchantProfile(token, role)).then(
        (response) => {
          console.log("GET RES", response);
          if (response.data.code == 1) {
            // displayLog(response.data.code, response.data.message);
            setloading(false);
            setViewProfile(response.data.data);
            dispatch({
              type: "MERCHANT_PROFILE",
              payload: {
                viewData: response.data.data,
              },
            });
          } else if (response.data.code === 401) {
            localStorage.clear();

            displayLog(response.data.code, response.data.message);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else if (response.data.code == 0) {
            displayLog(response.data.code, response.data.message);
          }
        }
      );
    }, 1000);
  }, [dispatch]);

  const handleInput = (event) => {
    seterror("");
    event.persist();

    setViewProfile(() => ({
      ...viewProfile,
      [event.target.name]: event.target.value,
    }));
  };
  const ChangePhoto = async (event) => {
    setloading(false);
    if (!event.file.url && !event.file.preview) {
      const urlData = await getBase64(event.file.originFileObj);
      const spiltUrl = urlData.split(",")[1];

      setPreviewImage(spiltUrl);
      setViewProfile(() => ({
        ...viewProfile,
        logo: null,
      }));
    }

    let FileSize = event.file.size / 1024 / 1024; // in MB

    let imgvalidate_result = functions.validateImgSize(FileSize);
    if (imgvalidate_result.isvalidate) {
      setFileerror("");

      setImageData(event.file.originFileObj);
      // setViewProfile(() => ({
      //   ...viewProfile,
      //   logo: event.file,
      // }));
      // setViewProfile({
      //   logo: fileList[1],
      // });
    } else {
      setFileerror(imgvalidate_result.error);
    }
  };

  const handleSubmit = () => {
    let obj = {
      address: viewProfile.address,
      email: viewProfile.email,
      number: viewProfile.number,
      name: viewProfile.name,
      first_name: viewProfile.first_name,
      last_name: viewProfile.last_name,
    };
    if (ImageData) {
      obj.logo = ImageData;
    }

    // console.log("FFF", obj);

    validateFormData(obj);
  };
  const validateFormData = (data) => {
    let schema = Joi.object().keys({
      first_name: Joi.string().trim().required(),
      last_name: Joi.string().trim().required(),
      name: Joi.string().trim().required(),
      address: Joi.string().trim().required(),
      email: Joi.string().trim().email().required(),

      number: Joi.string()
        .min(10)
        .max(10)
        .regex(/^[0]?\d{10,10}$/),

      logo: ImageData ? Joi.any().required() : "",
    });

    Joi.validate(data, schema, (error, value) => {
      if (error) {
        if (
          error.details[0].message !== error ||
          error.details[0].context.key !== errorField
        ) {
          let errorLog = functions.validateSchema(error);
          seterror(errorLog.error);
          seterrorField(errorLog.errorField);
          // console.log("error is 63 ", this.state.error);
        }
      } else {
        seterror("");

        const role = props && props.role;

        const formValues = new FormData();

        formValues.append("email", data.email);
        formValues.append("address", data.address);
        if (viewProfile.name !== null) {
          formValues.append("name", data.name);
        } else {
          formValues.append("first_name", data.first_name);
          formValues.append("last_name", data.last_name);
        }

        formValues.append("number", data.number);
        if (ImageData) {
          formValues.append("logo", data.logo);
        }

        formValues.append("role", role);

        // console.log("FINALLDATA", data);
        setloading(true);
        UpdateProfile(formValues);
      }
    });
  };
  const UpdateProfile = (info) => {
    const token = props && props.accessToken;
    setTimeout(() => {
      dispatch(merchantAction.updateMerchantProfile(info, token)).then(
        (response) => {
          console.log("RESPONSEEE UPDATE", response);
          if (response.data.code == 1) {
            displayLog(response.data.code, response.data.message);
            setloading(false);

            setViewProfile(response.data.data);
            dispatch({
              type: "MERCHANT_PROFILE",
              payload: {
                viewData: response.data.data,
              },
            });
            if (response.data.data?.is_verified == 0) {
              localStorage.clear();
              dispatch({
                type: "LOGOUT",
              });
              displayLog(0, "We've sent an email, please verify it.");
              setTimeout(() => {
                history.push(Routes.SIGNIN);
              }, 2000);
            } else if (response.data.data?.is_verified == 1) {
              setTimeout(() => {
                history.push({
                  pathname: Routes.MERCHANTSCAMPAIGNS,
                  state: {
                    merchantName:
                      response && response.data && response.data.data.name,
                  },
                });
              }, 2000);
            }
          } else if (response.data.code === 401) {
            // localStorage.clear();
            displayLog(response.data.code, response.data.message);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else if (response.data.code == 0) {
            displayLog(response.data.code, response.data.message);
          }
        }
      );
    }, 1000);
  };
  // console.log("VIEEE", previewImage);
  return (
    <div>
      <Header />
      <section className="merchantsList">
        {loading && <Loader />}
        <div className="container">
          <div className="colBg defaultForm">
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <div className="uploadPic uploadLogo ">
                    <div className="customUpload">
                      <div className="ant-upload-list-item-info">
                        <span className="ant-upload-span">
                          <a className="ant-upload-list-item-thumbnail">
                            <Image
                              className="ant-upload-list-item-image"
                              width={160}
                              height={160}
                              src={
                                viewProfile && viewProfile.logo
                                  ? viewProfile.logo
                                  : `data:image/png;base64,${previewImage}`
                              }
                              fallback="data:image/png;base64,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"
                            />
                          </a>
                        </span>
                      </div>
                      &nbsp; &nbsp;
                      {/* <input type="file" name="logo" onChange={handlePhoto} /> */}
                      <Upload
                        name="logo"
                        accept="image/*"
                        onChange={ChangePhoto}
                        showUploadList={false}

                        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      >
                        <>
                          <Button className="previewPhoto">
                            <i className="fas fa-upload"></i> Upload Logo
                          </Button>
                        </>
                      </Upload>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {fileError !== "" ? (
                  <Alert color="danger">{fileError}</Alert>
                ) : null}
              </div>
              <div className="col-md-6 pr-9">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    placeholder="First Name"
                    value={viewProfile && viewProfile.first_name}
                    type="text"
                    name="first_name"
                    className="form-control"
                    onChange={handleInput}
                  />
                </div>
              </div>
              <div className="col-md-6 pl-9">
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    placeholder="Last Name"
                    value={viewProfile && viewProfile.last_name}
                    type="text"
                    name="last_name"
                    className="form-control"
                    onChange={handleInput}
                  />
                </div>
              </div>{" "}
              <div className="col-md-12">
                <div className="form-group">
                  <label>Merchant Name</label>
                  <input
                    value={viewProfile && viewProfile.name}
                    placeholder={Userinfo.Userinfo}
                    name="name"
                    onChange={handleInput}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              {/* {viewProfile && viewProfile.name ? (
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Merchant Name</label>
                    <input
                      value={viewProfile && viewProfile.name}
                      placeholder={Userinfo.Userinfo}
                      name="name"
                      onChange={handleInput}
                      type="text"
                      className="form-control"
                    />
                  </div>
                </div>
              ) : null} */}
              <div className="col-md-12">
                <div className="form-group">
                  <label>Address</label>
                  <input
                    value={viewProfile && viewProfile.address}
                    placeholder={Userinfo.Userinfo}
                    name="address"
                    onChange={handleInput}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label>Contact Number</label>
                  {/* <input
                    type="number"
                    pattern="[0-9]+"
                    maxlength="3"
                    inputmode="numeric"
                  /> */}
                  <input
                    onChange={handleInput}
                    value={viewProfile && viewProfile.number}
                    placeholder="1234567890"
                    name="number"
                    max={10}
                    // pattern="^-?[0-9]\d*\.?\d*$"
                    type="number"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    value={viewProfile && viewProfile.email}
                    placeholder={Userinfo.Userinfo}
                    name="email"
                    onChange={handleInput}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div>
                {error !== "" ? <Alert color="danger">{error}</Alert> : null}
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
export default connect(mapStateToProps)(MerchantProfile);
