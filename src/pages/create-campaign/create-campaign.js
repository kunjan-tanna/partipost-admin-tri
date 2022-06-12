import React, { Component, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink, useHistory } from "react-router-dom";
import Header from "../../components/header/header";
import "antd/dist/antd.css";
import { Space, Upload, message, Button, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { connect, useDispatch } from "react-redux";
import * as functions from "../../utils/functions";
import Joi from "joi-browser";
import { displayLog } from "../../utils/functions";
import * as merchantAction from "../../redux/actions/merchantSignUp";
import * as campaignAction from "../../redux/actions/Campaign/index";
import moment from "moment";
import { Alert } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
function onChange(date, dateString) {
  //console.log(date, dateString);
}
const { Option } = Select;
const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      //console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

function CreatCampaign(props) {
  const [error, seterror] = useState("");
  const [fileError, setFileerror] = useState("");
  const [errorField, seterrorField] = useState("");
  const [loading, setloading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [formData, setFormData] = useState({
    campaign_title: "",
    price: "",
    start_date: "",
    end_date: "",
    description: "",
    requirements: "",
    rules: "",
    category_id: "",
    campaign_image: {},
  });
  const [ImageData, setImageData] = useState(null);
  const [updateProfile, setUpdateProfile] = useState({});
  const [getcategory, setGetcategory] = useState([]);
  const [startcalDate, setStartcalDate] = useState("");
  const [endcalDate, setEndcalDate] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(campaignAction.getCategory()).then((response) => {
      //console.log("RESSSS", response);
      if (response.data.code == 1) {
        // displayLog(response.data.code, response.data.message);
        setGetcategory(response.data.data);
      } else if (response.data.code == 0) {
        displayLog(response.data.code, response.data.message);
      }
    });
  }, []);
  const handleInput = (event) => {
    seterror("");
    let name = event.target.name;
    let form = formData;
    // event.persist();
    form[name] = event.target.value.replace(/^\s+/g, "");

    setFormData(form);
  };
  const changeDate = (date, name) => {
    let form = formData;
    const Date = moment(date).format("YYYY-MM-DD");

    if (name == "start_date") {
      form["start_date"] = Date;
      setFormData(() => ({
        ...form,
        start_date: Date,
      }));
      setStartcalDate(date);
    } else if (name == "end_date") {
      form["end_date"] = Date;
      setFormData(() => ({
        ...form,
        end_date: Date,
      }));
      setEndcalDate(date);
    }
  };
  const handleChange = (catId) => {
    let form = formData;
    setFormData(() => ({
      ...form,
      category_id: catId,
    }));
  };
  const ChangePhoto = async (event) => {
    let form = formData;
    let FileSize = event.file.size / 1024 / 1024; // in MB

    let imgvalidate_result = functions.validateImgSize(FileSize);
    if (imgvalidate_result.isvalidate) {
      setFileerror("");
      form["campaign_image"] = event.file.originFileObj;
      // setImageData(event.file.originFileObj);
      setFormData(form);
    } else {
      setFileerror(imgvalidate_result.error);
    }
  };
  const handleSubmit = () => {
    // console.log("ddd", formData);

    let obj = {
      campaign_title: formData.campaign_title,
      price: formData.price,
      start_date: formData.start_date.replace(/-/g, ""),
      end_date: formData.end_date.replace(/-/g, ""),
      description: formData.description,
      requirements: formData.requirements,
      rules: formData.rules,
      category_id: formData.category_id,
      campaign_image: formData.campaign_image,
    };

    // console.log("FFF", obj);
    validateFormData(obj);
  };
  const validateFormData = (data) => {
    let startDate = +formData.start_date.replace(/-/g, "");
    // console.log("FFF", startDate);
    let schema = Joi.object().keys({
      campaign_title: Joi.string().trim().required(),
      category_id: Joi.number().required(),

      price: Joi.string()
        .min(0)
        .max(10)
        .regex(/^[0]?\d{0,10}$/),
      // price: Joi.number().required(),
      start_date: Joi.string().required(),
      // end_date: Joi.string().required(),
      end_date: Joi.number().greater(startDate).required(),

      description: Joi.string().trim().required(),
      requirements: Joi.string().trim().required(),
      rules: Joi.string().trim().required(),
      campaign_image: Joi.any().required(),
    });

    Joi.validate(data, schema, (error, value) => {
      if (error) {
        // console.log("error", error.details[0].message);

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

        formValues.append("campaign_title", data.campaign_title);
        formValues.append("price", +data.price);
        formValues.append("start_date", data.start_date);
        formValues.append("end_date", data.end_date);
        formValues.append("description", data.description);
        formValues.append("requirements", data.requirements);
        formValues.append("rules", data.rules);
        formValues.append("category_id", data.category_id);
        formValues.append("campaign_image", data.campaign_image);

        formValues.append("role", role);
        formValues.append(
          "merchant_id",
          localStorage.getItem("merchant_id")
            ? +localStorage.getItem("merchant_id")
            : 1
        );

        // console.log("FINALLDATA", data);
        setloading(true);
        UpdateProfile(formValues);
      }
    });
  };
  const UpdateProfile = (info) => {
    const token = props && props.accessToken;
    setTimeout(() => {
      dispatch(campaignAction.createCampaign(info, token)).then((response) => {
        // console.log("RESPONSE", response);
        if (response.data.code == 1) {
          displayLog(response.data.code, response.data.message);
          setloading(false);

          setTimeout(() => {
            history.push({
              pathname: Routes.CREATETASK,
              search: `?campaign_id=${response.data.data.campaign_id}`,
            });
            // history.push(Routes.MERCHANTSCAMPAIGNS);
          }, 2000);
        } else if (response.data.code === 401) {
          // localStorage.clear();
          displayLog(response.data.code, response.data.message);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else if (response.data.code == 0) {
          displayLog(response.data.code, response.data.message);
        }
      });
    }, 1000);
  };

  return (
    <div>
      <Header />
      <section className="merchantsList">
        <div className="container">
          <div className="row align-items-center breadcrumbOuter">
            <div className="col-md-12">
              <ul className="d-flex breadcrumbTop">
                <li>
                  <NavLink to={Routes.MERCHANTSCAMPAIGNS}>My Campaigns</NavLink>
                </li>
                <li className="active">Create Campaign</li>
              </ul>
            </div>
          </div>

          <div className="colBg defaultForm">
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Campaign Title</label>
                  <input
                    placeholder="Spread the good news"
                    type="text"
                    name="campaign_title"
                    className="form-control"
                    onChange={handleInput}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Category</label>
                  <Select
                    // defaultValue="select"
                    placeholder="Select Category"
                    style={{
                      width: "100%",
                      background: "#f2f2f2",
                      borderRadius: "10px",
                    }}
                    // className="form-control"
                    onChange={handleChange}
                    name="category"
                  >
                    {getcategory && getcategory.length > 0
                      ? getcategory.map((item, index) => (
                          <Option value={item.category_id}>
                            {" "}
                            {item.category_name}
                          </Option>
                        ))
                      : ""}
                  </Select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Commission per influencer</label>
                  <input
                    placeholder="SGD 20"
                    type="number"
                    name="price"
                    className="form-control"
                    onChange={handleInput}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Start Date</label>

                  <div className="dateOuter">
                    <Space direction="vertical">
                      <DatePicker
                        className="form-control"
                        selected={startcalDate}
                        name="start_date"
                        onChange={(date) => changeDate(date, "start_date")}
                        placeholderText="Start Date"
                        minDate={new Date()}
                        showYearDropdown
                        //showMonthDropdown
                      />
                    </Space>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>End Date</label>
                  <div className="dateOuter">
                    <Space direction="vertical">
                      <DatePicker
                        className="form-control"
                        selected={endcalDate}
                        name="end_date"
                        onChange={(date) => changeDate(date, "end_date")}
                        placeholderText="End Date"
                        // minDate={formData.start_date + 1}
                        minDate={new Date()}
                        showYearDropdown
                      />
                    </Space>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Description here"
                    className="form-control"
                    name="description"
                    onChange={handleInput}
                  ></textarea>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label>Requirements</label>
                  <textarea
                    placeholder="Requirements here"
                    className="form-control"
                    name="requirements"
                    onChange={handleInput}
                  ></textarea>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label>Dos and Don's</label>
                  <textarea
                    placeholder="Description here"
                    className="form-control"
                    name="rules"
                    onChange={handleInput}
                  ></textarea>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Upload Picture (234x234)</label>
                  <div className="uploadPic">
                    <Upload
                      name="campaign_image"
                      accept="image/*"
                      onChange={ChangePhoto}
                    >
                      <Button>Upload Picture</Button>
                    </Upload>
                  </div>
                  <div>
                    {fileError !== "" ? (
                      <Alert color="danger">{fileError}</Alert>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div>
              {error !== "" ? <Alert color="danger">{error}</Alert> : null}
            </div>
            <div className="formBtn">
              {/* <NavLink to={Routes.CREATETASK} class="btn btn-default-blue">
                Next
              </NavLink> */}
              <button
                className="btn btn-default-blue"
                onClick={() => handleSubmit()}
              >
                Next
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
export default connect(mapStateToProps)(CreatCampaign);
