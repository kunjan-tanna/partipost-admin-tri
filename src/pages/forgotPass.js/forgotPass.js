import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import Joi from "joi-browser";
import * as functions from "../../utils/functions";

import * as loginAction from "../../redux/actions/login";
import * as RegAction from "../../redux/actions/merchantSignUp";
import md5 from "md5";

import { NavLink, useHistory } from "react-router-dom";
import "antd/dist/antd.css";
import { useDispatch } from "react-redux";
import { displayLog } from "../../utils/functions";
import { Alert } from "reactstrap";
import Loader from "../../utils/Loader";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";

function ForgotPassword() {
  const [data, setData] = useState({});
  const [error, seterror] = useState("");
  const [errorField, seterrorField] = useState("");
  const [resendsuccessfully, setResendSuccessfully] = useState("");
  const [loading, setloading] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const inputHandler = (event) => {
    event.persist();
    setData(() => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
    seterror("");
  };
  const handleSubmit = () => {
    validateFormData(data);
  };
  const validateFormData = (data) => {
    let schema = Joi.object().keys({
      email: Joi.string().trim().email().required(),
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
        let reqData = {
          email: data.email,
        };
        forgotPass(reqData);
        setloading(true);
      }
    });
  };
  const forgotPass = (data) => {
    // console.log("DAAA", data);
    if (data) {
      setTimeout(() => {
        dispatch(loginAction.forgotPass(data)).then((response) => {
          // console.log("RESSS----", response);
          setloading(false);
          seterror("");
          if (response.data.code === 1) {
            //   dispatch({
            //     type: "LOGIN_DATA",
            //     payload: {
            //       accessToken: response.data.data.token,
            //       role: response.data.data.role,
            //     },
            //   });
            displayLog(response.data.code, response.data.message);

            //   setTimeout(() => {
            //     history.push(Routes.MERCHANTPROFILE);
            //   }, 1000);
          } else if (response.data.code === 0) {
            displayLog(response.data.code, response.data.message);
          }
        });
      }, 1000);

      // setResendSuccessfully("SUCESSS");
    } else {
      displayLog(0, "Something Went Wrong");
    }
  };

  return (
    <div className="authScreen">
      {loading && <Loader />}
      <div className="authForm signinForm signinFormForgot">
        <h2>Forgot Password?</h2>
        <p>
          Enter your email and we'll send you instructions to reset your
          password
        </p>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <input
                placeholder="Email"
                type="text"
                name="email"
                className="form-control"
                onChange={inputHandler}
              />
            </div>
          </div>
        </div>
        <div>{error !== "" ? <Alert color="danger">{error}</Alert> : null}</div>
        <div>
          {resendsuccessfully !== "" ? (
            <Alert color="success">{resendsuccessfully}</Alert>
          ) : null}
        </div>
        <div className="authSubmitBtn authSubmitBtnForgot">
          <button
            className="btn btn-sign-submit"
            onClick={() => handleSubmit()}
          >
            Get New Password
          </button>
          {/* 38px 29px 30px 24px */}
          {/* <NavLink
            to={Routes.MERCHANTSCAMPAIGNS}
            class="btn btn-sign-submit"
            onClick={handleSubmit}
          >
            Sign In
          </NavLink> */}
        </div>
        <div></div>
        <div className="haveAccount forgotPass">
          <NavLink to={Routes.SIGNIN}>Go back to login</NavLink>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
