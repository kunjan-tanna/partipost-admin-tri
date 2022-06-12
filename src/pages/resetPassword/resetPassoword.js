import React, { Component, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import Joi from "joi-browser";
import * as functions from "../../utils/functions";

import * as loginAction from "../../redux/actions/login";
import * as RegAction from "../../redux/actions/merchantSignUp";

import { NavLink, useHistory } from "react-router-dom";
import "antd/dist/antd.css";
import { useDispatch } from "react-redux";
import { displayLog } from "../../utils/functions";
import { Alert } from "reactstrap";
import md5 from "md5";

import Loader from "../../utils/Loader";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";

function ResetPassword(props) {
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
      new_password: Joi.string().trim().min(6).required(),
      confirm_password: Joi.string().trim().min(6).required(),
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
        if (data.new_password !== data.confirm_password) {
          displayLog(0, "Confirm Password doesn't match!");
        } else {
          const search = props && props.location.search;
          const authToken = search.split("=")[1];
          //   console.log("TOKENN", authToken);
          let reqData = {
            new_password: md5(data.new_password),
            confirm_password: md5(data.confirm_password),
            token: authToken,
          };
          resetPass(reqData);
          setloading(true);
        }
      }
    });
  };
  const resetPass = (data) => {
    if (data) {
      setTimeout(() => {
        dispatch(loginAction.resetPass(data)).then((response) => {
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

            setTimeout(() => {
              history.push(Routes.SIGNIN);
            }, 1000);
          } else if (response.data.code === 401) {
            displayLog(response.data.code, response.data.message);
            setTimeout(() => {
              window.location.reload();
              //   history.push(Routes.SIGNIN);
            }, 2000);
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
        <h2>Reset the Password</h2>
        <p>
          Your new password must be different from previously used passwords
        </p>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <input
                placeholder="New Password"
                type="password"
                name="new_password"
                className="form-control"
                onChange={inputHandler}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <input
                placeholder="Confirm Password"
                type="password"
                name="confirm_password"
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
            Set New Password
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

export default ResetPassword;
