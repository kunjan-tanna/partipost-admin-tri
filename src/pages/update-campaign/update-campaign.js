import React, { Component, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import Header from "../../components/header/header";
import "antd/dist/antd.css";
import { Space, Upload, message, Button, Select, Image } from "antd";
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
import { apiCall } from "../../utils/common";

function onChange(date, dateString) {
  // console.log(date, dateString);
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
      // console.log(info.file, info.fileList);
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
function UpdateCampaign(props) {
  const { merchant_id, campaign_id, accept_posting } = useLocation().state;

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
  const [campId, setCampId] = useState("");

  const [ImageData, setImageData] = useState(null);
  const [updateProfile, setUpdateProfile] = useState({});
  const [getcategory, setGetcategory] = useState([]);
  const [startcalDate, setStartcalDate] = useState("");
  const [endcalDate, setEndcalDate] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    // console.log("PPPFFF", accept_posting);
    setloading(true);
    viewCampaignDetails();
    dispatch(campaignAction.getCategory()).then((response) => {
      // console.log("RESSSS", response);
      if (response.data.code == 1) {
        // displayLog(response.data.code, response.data.message);
        setGetcategory(response.data.data);
      } else if (response.data.code == 0) {
        displayLog(response.data.code, response.data.message);
      }
    });
  }, []);

  //View Campaign
  const viewCampaignDetails = async () => {
    let req_data = {
      merchant_id: merchant_id,
      campaign_id: campaign_id,
      role: +localStorage.getItem("role"),
    };

    // console.log("BODY", req_data);
    let res = await apiCall("POST", "viewCampaignDetail", req_data);
    // console.log("RESPONSE", res);
    if (res.code == 1) {
      setloading(false);
      // setFormData(res.data);
      setStartcalDate(new Date(res.data.start_date));
      setEndcalDate(new Date(res.data.end_date));
      setFormData({
        campaign_title: res.data.campaign_title,
        price: res.data.price,
        start_date: "",
        end_date: "",
        description: res.data.description,
        requirements: res.data.requirements,
        rules: res.data.rules,
        category_id: res.data.category_id,
        campaign_image: res.data.campaign_image,
      });
      setCampId(res.data?.campaign_id);

      // setStartDate(new Date(res.data.start_date));
      // form["start_date"] = new Date(res.data.start_date),
      // form["end_date"] = new Date(res.data.end_date)
    } else if (res.code == 0) {
      displayLog(res.code, res.message);
    }
  };
  const handleInput = (event) => {
    // seterror("");
    // let name = event.target.name;
    // let form = formData;
    // // event.persist();
    // form[name] = event.target.value.replace(/^\s+/g, "");

    // setFormData(form);
    seterror("");
    // event.persist();

    setFormData(() => ({
      ...formData,
      [event.target.name]: event.target.value,
    }));
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
    if (!event.file.url && !event.file.preview) {
      const urlData = await getBase64(event.file.originFileObj);
      const spiltUrl = urlData.split(",")[1];

      setPreviewImage(spiltUrl);
      setFormData(() => ({
        ...formData,
        campaign_image: null,
      }));
    }
    let form = formData;
    let FileSize = event.file.size / 1024 / 1024; // in MB

    let imgvalidate_result = functions.validateImgSize(FileSize);
    if (imgvalidate_result.isvalidate) {
      setFileerror("");
      setImageData(event.file.originFileObj);
      // form["campaign_image"] = event.file.originFileObj;
      // // setImageData(event.file.originFileObj);
      // setFormData(form);
    } else {
      setFileerror(imgvalidate_result.error);
    }
  };
  const handleSubmit = () => {
    // console.log("ddd", formData);

    let obj = {
      campaign_title: formData.campaign_title,
      price: formData.price,
      start_date: moment(startcalDate).format("YYYY-MM-DD")
        ? moment(startcalDate).format("YYYY-MM-DD").replace(/-/g, "")
        : formData.start_date.replace(/-/g, ""),

      end_date: moment(endcalDate).format("YYYY-MM-DD")
        ? moment(endcalDate).format("YYYY-MM-DD").replace(/-/g, "")
        : formData.end_date.replace(/-/g, ""),
      description: formData.description,
      requirements: formData.requirements,
      rules: formData.rules,
      category_id: formData.category_id,
    };
    if (ImageData) {
      obj.campaign_image = ImageData;
    }

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
      campaign_image: ImageData ? Joi.any().required() : "",
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

        formValues.append("campaign_title", data.campaign_title);
        formValues.append("price", +data.price);
        formValues.append(
          "start_date",
          moment(data.start_date).format("YYYY-MM-DD")
        );
        formValues.append(
          "end_date",
          moment(data.end_date).format("YYYY-MM-DD")
        );
        formValues.append("description", data.description);
        formValues.append("requirements", data.requirements);
        formValues.append("rules", data.rules);
        formValues.append("category_id", data.category_id);
        if (ImageData) {
          formValues.append("campaign_image", data.campaign_image);
        }

        formValues.append("role", role);
        formValues.append(
          "merchant_id",
          localStorage.getItem("merchant_id")
            ? +localStorage.getItem("merchant_id")
            : 1
        );
        formValues.append("campaign_id", campId);

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
        // console.log("RESPONSE----===", response);
        if (response.data.code == 1) {
          displayLog(response.data.code, response.data.message);
          setloading(false);

          if (response.data.data.is_campaign_created == 1) {
            setTimeout(() => {
              history.push({
                pathname: Routes.UPDATETASK,
                search: `?campaign_id=${response.data.data.campaign_id}`,
                state: { accept_posting: accept_posting },
              });
              // history.push(Routes.MERCHANTSCAMPAIGNS);
            }, 2000);
          } else if (response.data.data.is_campaign_created == 0) {
            setTimeout(() => {
              history.push({
                pathname: Routes.CREATETASK,
                search: `?campaign_id=${response.data.data.campaign_id}`,
              });
              // history.push(Routes.MERCHANTSCAMPAIGNS);
            }, 2000);
            // const mName = localStorage.getItem("merchant_name");
            // setTimeout(() => {
            //   history.push({
            //     pathname: "/merchant-campaigns",
            //     state: {
            //       merchant_id: response.data.data.merchant_id,
            //       merchant_name: mName,
            //     },
            //   });
            //   // history.push(Routes.MERCHANTSCAMPAIGNS);
            // }, 2000);
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
      });
    }, 1000);
  };

  // console.log("formData", moment(endcalDate).format("YYYY-MM-DD"));
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
                <li className="active">Update Campaign</li>
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
                    value={
                      formData.campaign_title ? formData.campaign_title : ""
                    }
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
                    // value={
                    //   getcategory &&
                    //   getcategory.filter(
                    //     (item) => item.category_id == formData.category_id
                    //   )
                    // }
                    value={formData.category_id}
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
                    value={formData.price ? formData.price : ""}
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
                        // selected={
                        //   moment(formData.start_date).format("MM/DD/YYYY")
                        //     ? moment(formData.start_date).format("MM/DD/YYYY")
                        //     : startcalDate
                        // }
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
                        // selected={
                        //   new Date(formData.end_date)
                        //     ? new Date(formData.end_date)
                        //     : endcalDate
                        // }
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
                    value={formData.description ? formData.description : ""}
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
                    value={formData.requirements ? formData.requirements : ""}
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
                    value={formData.rules ? formData.rules : ""}
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
            <span className="campaignsImg">
              {" "}
              <Image
                className="ant-upload-list-item-image"
                width={160}
                height={160}
                src={
                  formData && formData.campaign_image
                    ? formData.campaign_image
                    : `data:image/png;base64,${previewImage}`
                }
                fallback="data:image/png;base64,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"
              />
              {/* <img
                className="img-fluid"
                src={
                  formData.campaign_image
                    ? formData.campaign_image
                    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                }
              /> */}
            </span>{" "}
            <br />
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
export default connect(mapStateToProps)(UpdateCampaign);
