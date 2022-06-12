import React, { Component, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink, useHistory } from "react-router-dom";
import "antd/dist/antd.css";
import { useDispatch } from "react-redux";
import { displayLog } from "../../utils/functions";
import { Alert } from "reactstrap";
import Loader from "../../utils/Loader";
import Joi from "joi-browser";
import * as functions from "../../utils/functions";
import md5 from "md5";
import * as RegAction from "../../redux/actions/merchantSignUp";

import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { getToken } from "../../utils/firebaseInit";

function SignUp() {
  const [data, setData] = useState({});
  const [error, seterror] = useState("");
  const [errorField, seterrorField] = useState("");
  const [loading, setloading] = useState(false);
  const [isTokenFound, setTokenFound] = useState(false);
  const [isToken, setToken] = useState("");

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    let data;
    //This funcation generated the Token (NOTIFICATION)
    async function tokenFunc() {
      data = await getToken(setTokenFound);
      if (data) {
        console.log("Token is", data);
        setToken(data);
      }
      return data;
    }
    tokenFunc();

    // firebase.messaging().onMessage(
    //   (payload) => {
    //     console.log("PAYLOAD", payload);
    //     // alertify.success(payload.notification.body);
    //   },
    //   (e) => {
    //     console.log(e);
    //   }
    // );
  }, [setTokenFound]);

  //handle the input data
  const inputHandler = (event) => {
    event.persist();

    setData(() => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
    seterror("");
  };
  //Handle the submit button
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFormData(data);
    // console.log("DAAA", data);

    // console.log("ASSS", data);
  };

  //Handle the validate form Data
  const validateFormData = (data) => {
    let schema = Joi.object().keys({
      first_name: Joi.string().trim().required(),
      last_name: Joi.string().trim().required(),
      email: Joi.string().trim().email().required(),
      password: Joi.string().trim().min(6).required(),
      conPassword: Joi.string().trim().min(6).required(),
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
        if (data.password !== data.conPassword) {
          displayLog(0, "Confirm Password doesn't match!");
        } else {
          let reqData = {
            email: data.email,
            password: md5(data.password),
            first_name: data.first_name,
            last_name: data.last_name,
          };
          merchantReg(reqData);
          setloading(true);
        }
      }
    });
  };
  //Handle the merchant Register
  const merchantReg = (data) => {
    const obj = data;
    obj.device_token = isToken;
    console.log("FFFF", obj);
    if (data) {
      dispatch(RegAction.merchantSignUp(data)).then((response) => {
        console.log("RESSPONSE SIGNUP", response);
        if (response.data.code === 1) {
          dispatch({
            type: "LOGIN_DATA",
            payload: {
              accessToken: response.data.auth_token,
              role: response.data.role,
            },
          });
          setloading(false);
          seterror("");
          displayLog(response.data.code, response.data.message);
          localStorage.setItem("auth_token", response.data.auth_token);
          localStorage.setItem("role", response.data.role);
          if (localStorage.getItem("role") == 2) {
            localStorage.setItem(
              "merchant_name",
              response.data.data.first_name + " " + response.data.data.last_name
            );

            localStorage.setItem("merchant_id", response.data.data.merchant_id);
          }
          if (response.data.data?.is_verified === 0) {
            displayLog(1, "We've sent an email, please verify it.");
            setTimeout(() => {
              history.push(Routes.SIGNIN);
            }, 1000);
          }

          // window.location.reload();
          // if Merchant login then redirect to profile & superadmin redirect to Dashboard
          // setTimeout(() => {
          //   history.push(Routes.MERCHANTPROFILE);
          // }, 1000);
        } else if (response.data.code === 0) {
          displayLog(response.data.code, response.data.message);
          setloading(false);
        }
      });

      // setResendSuccessfully("SUCESSS");
    } else {
      displayLog(0, "Something Went Wrong");
    }
  };
  //handle the signup for google
  const responseGoogle = (response) => {
    // console.log("RESSS---", response);
    if (response && response.profileObj) {
      var reqData = {
        google_id: response.profileObj.googleId,
        first_name: response.profileObj.givenName,
        last_name: response.profileObj.familyName,
        email: response.profileObj.email,
        device_token: isToken,
      };
      // console.log("BODY", reqData);
      dispatch(RegAction.SignUpWithGoogleOrFacebook(reqData)).then(
        (response) => {
          // console.log("RESSS GOOGLE", response);
          if (response.data.code === 1) {
            dispatch({
              type: "LOGIN_DATA",
              payload: {
                accessToken: response.data.auth_token,
                role: response.data.role,
              },
            });
            setloading(false);
            seterror("");
            displayLog(response.data.code, response.data.message);
            if (response.data.registration_completed == 0) {
              history.push(Routes.MERCHANTPROFILE);
            } else if (response.data.registration_completed == 1) {
              history.push(Routes.MERCHANTSCAMPAIGNS);
            }
            localStorage.setItem("auth_token", response.data.auth_token);
            localStorage.setItem("role", response.data.role);
            if (localStorage.getItem("role") == 2) {
              localStorage.setItem(
                "merchant_name",
                response.data.data[0].first_name +
                  " " +
                  response.data.data[0].last_name
              );
              localStorage.setItem(
                "merchant_id",
                response.data.data[0].merchant_id
              );
            }
            // window.location.reload();
            // if Merchant login then redirect to profile & superadmin redirect to Dashboard
            // setTimeout(() => {
            //   history.push(Routes.MERCHANTPROFILE);
            // }, 1000);
          } else if (response.data.code === 0) {
            displayLog(response.data.code, response.data.message);
          }
        }
      );
    } else {
      displayLog(0, response.error);
    }
  };
  //handle the signUp for facebook
  const responseFacebook = (response) => {
    // console.log("RESSSS", response);
    const name = response.name;

    const fname = name.split(" ")[0];
    const lname = name.split(" ")[1];
    // console.log("fff", fname, "nameee", lname);

    if (response && response.id) {
      var reqData = {
        facebook_id: response.id,
        first_name: fname,
        last_name: lname,
        device_token: isToken,
      };
      // console.log("BODY", reqData);
      dispatch(RegAction.SignUpWithGoogleOrFacebook(reqData)).then(
        (response) => {
          // console.log("RESSS FACEBOOK", response);
          if (response.data.code === 1) {
            dispatch({
              type: "LOGIN_DATA",
              payload: {
                accessToken: response.data.auth_token,
                role: response.data.role,
              },
            });
            setloading(false);
            seterror("");
            displayLog(response.data.code, response.data.message);
            if (response.data.registration_completed == 0) {
              history.push(Routes.MERCHANTPROFILE);
            } else if (response.data.registration_completed == 1) {
              history.push(Routes.MERCHANTSCAMPAIGNS);
            }
            localStorage.setItem("auth_token", response.data.auth_token);
            localStorage.setItem("role", response.data.role);
            if (localStorage.getItem("role") == 2) {
              localStorage.setItem(
                "merchant_name",
                response.data.data[0].first_name +
                  " " +
                  response.data.data[0].last_name
              );
              localStorage.setItem(
                "merchant_id",
                response.data.data[0].merchant_id
              );
            }
            // window.location.reload();
            // if Merchant login then redirect to profile & superadmin redirect to Dashboard
            // history.push(Routes.MERCHANTPROFILE);
          } else if (response.data.code === 0) {
            displayLog(response.data.code, response.data.message);
          }
        }
      );
    } else {
      displayLog(0, response.error);
    }
  };

  return (
    <div className="authScreen">
      {loading && <Loader />}
      <div className="authForm signupForm">
        <div className="row">
          <div className="col-md-6">
            <h2>Sign Up</h2>
            <p>Please fill in this form to create an account!</p>
            <div className="row">
              <div className="col-md-6 pr-9">
                <div className="form-group">
                  <input
                    placeholder="First Name"
                    type="text"
                    name="first_name"
                    className="form-control"
                    onChange={inputHandler}
                  />
                </div>
              </div>
              <div className="col-md-6 pl-9">
                <div className="form-group">
                  <input
                    placeholder="Last Name"
                    type="text"
                    name="last_name"
                    className="form-control"
                    onChange={inputHandler}
                  />
                </div>
              </div>
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
              <div className="col-md-12">
                <div className="form-group">
                  <input
                    placeholder="Password"
                    type="password"
                    name="password"
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
                    name="conPassword"
                    className="form-control"
                    onChange={inputHandler}
                  />
                </div>
                <div>
                  {error !== "" ? <Alert color="danger">{error}</Alert> : null}
                </div>
              </div>

              <div className="col-md-12">
                <div className="form-group privacyPolicy">
                  <input type="checkbox" />
                  <label>
                    I accept the{" "}
                    <NavLink to={Routes.HOME}>Terms of Use</NavLink> &{" "}
                    <NavLink to={Routes.HOME}>Privacy Policy</NavLink>.
                  </label>
                </div>
              </div>
            </div>
            <div className="authSubmitBtn">
              <button
                className="btn btn-sign-submit"
                onClick={(e) => handleSubmit(e)}
              >
                Sign Up
              </button>
            </div>
            <div className="haveAccount">
              Already have an account?{" "}
              <NavLink to={Routes.SIGNIN}>Log in here.</NavLink>
            </div>
          </div>
          <div className="col-md-6">
            <div className="authSocialBtn">
              {/* App is just a test mode once its uploaded the live then change the URL in FB developer */}
              <FacebookLogin
                appId="2964913527091189"
                // autoLoad={true}
                fields="name,email,picture"
                scope="public_profile,user_friends"
                callback={responseFacebook}
                icon="fab fa-facebook-square"
                cssClass="btn btn-facebook"
              />

              {/* <NavLink to={Routes.HOME} class="btn btn-facebook">
                <i class="fab fa-facebook-square"></i> Sign In with Facebook
              </NavLink> */}
              <br />
              {/* Once you upload the live then Add live URL in google console callback URL */}
              <GoogleLogin
                // clientId="180903532050-a3k6mvr2nvah6quu8jqo01phdk0v80se.apps.googleusercontent.com"
                clientId="824838106149-tatq9uuknm1f26hq766oi4bkniibkal5.apps.googleusercontent.com"
                buttonText="Sign In with Google"
                render={(renderProps) => (
                  <button
                    style={{ background: "transparent", border: 0 }}
                    onClick={renderProps.onClick}
                  >
                    <NavLink to="#" class="btn btn-google">
                      <i className="fab fa-google-plus-square"></i> Sign In with
                      Google
                    </NavLink>
                  </button>
                )}
                onSuccess={responseGoogle}
                // onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
              ></GoogleLogin>
              {/* <NavLink to={Routes.HOME} class="btn btn-google">
                <i class="fab fa-google-plus-square"></i> Sign In with Google
              </NavLink> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
