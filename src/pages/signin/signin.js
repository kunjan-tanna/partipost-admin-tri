import React, { Component, useState, useEffect } from "react";
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
import { getToken } from "../../utils/firebaseInit";
import firebase from "firebase/app";

function SignIn() {
  const [data, setData] = useState({});
  const [error, seterror] = useState("");
  const [errorField, seterrorField] = useState("");
  const [resendsuccessfully, setResendSuccessfully] = useState("");
  const [loading, setloading] = useState(false);
  const [isTokenFound, setTokenFound] = useState(false);
  const [isToken, setToken] = useState("");
  // console.log("Token found", isTokenFound);

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

  //handle input data
  const inputHandler = (event) => {
    event.persist();
    setData(() => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
    seterror("");
  };
  //handle submit
  const handleSubmit = () => {
    validateFormData(data);
  };
  //handle the enterPressed
  const enterPressed = (event, input) => {
    var code = event.keyCode || event.which;
    // console.log("HELLO---", input);
    if (code === 13) {
      var target = event.target;
      let email = document.getElementById("email");
      let password = document.getElementById("password");

      if (input == "email") {
        password.focus();
      }
      if (input == "password") {
        // console.log("HELLO");
        // console.log("FFFFF", code);
        let obj = {
          email: data.email,
          password: data.password,
        };

        validateFormData(obj);
        // validateFormData(email,password);
      }
    }
  };
  //handle the valida Data
  const validateFormData = (data) => {
    let schema = Joi.object().keys({
      email: Joi.string().trim().email().required(),
      password: Joi.string().trim().min(6).required(),
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
        let reqData = {
          email: data.email,
          password: md5(data.password),
        };
        merchantLogin(reqData);
        setloading(true);
      }
    });
  };
  //Handle the login Data
  const merchantLogin = (data) => {
    const obj = data;
    obj.device_token = isToken;
    console.log("FFFF", obj);

    if (data) {
      setTimeout(() => {
        dispatch(loginAction.login(data)).then((response) => {
          console.log("RESSS LOGIN", response);
          setloading(false);
          seterror("");
          if (response.data.code === 1) {
            dispatch({
              type: "LOGIN_DATA",
              payload: {
                accessToken: response.data.data.token,
                role: response.data.data.role,
              },
            });
            displayLog(response.data.code, response.data.message);
            if (response.data.data.registration_completed == 0) {
              history.push(Routes.MERCHANTPROFILE);
            } else if (response.data.data.registration_completed == 1) {
              history.push(Routes.MERCHANTSCAMPAIGNS);
            }
            localStorage.setItem("auth_token", response.data.data.token);
            localStorage.setItem("role", response.data.data.role);
            if (localStorage.getItem("role") == 2) {
              localStorage.setItem(
                "merchant_name",
                response.data.data.merchant_first_name +
                  " " +
                  response.data.data.merchant_last_name
              );
              localStorage.setItem(
                "merchant_id",
                response.data.data.merchant_id
              );
            }
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
  //Handle the login with Google
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
          // console.log("RESSS GOOGLE", response.data);
          //           auth_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjaGFudF9pZCI6NTAsInVzZXJfdHlwZSI6MSwiaWF0IjoxNjM4MzYxNjgyLCJleHAiOjE2MzgzNzk2ODJ9.YO5rGUfK1AkVd_BuDVkrQk8x1syflP9pW8uopMB5Q5Y"
          // code: 1
          // data: [{…}]
          // message: "Login In successfully"
          // registration_completed: 0
          // role: 2
          // status: "SUCCESS"
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
  //handle te login with FB
  const responseFacebook = (response) => {
    console.log("FACEBOKKK", response);
    let FB = window.FB;
    // console.log(FB);
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
          console.log("RESSS FACEBOOK", response);
          //           auth_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjaGFudF9pZCI6NjcsInVzZXJfdHlwZSI6MSwiaWF0IjoxNjM4MzYxODAyLCJleHAiOjE2MzgzNzk4MDJ9.eF20FN5hc-mfv-_BMBaGGzMLmiqGhqOJZryIh__pIdw"
          // code: 1
          // data: [{…}]
          // message: "Login In successfully"
          // registration_completed: 0
          // role: 2
          // status: "SUCCESS"
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
      <div className="authForm signinForm">
        <h2>Sign In</h2>
        <p>Please sign in with your email and password.</p>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <input
                placeholder="Email"
                type="text"
                name="email"
                className="form-control"
                onKeyPress={(e) => enterPressed(e, "email")}
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
                onKeyPress={(e) => enterPressed(e, "password")}
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
            Sign In
          </button>

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
          <NavLink to={Routes.FORGOTPASSWORD}>Forgot Password?</NavLink>
        </div>
        <div className="authSocialBtn">
          {/* <NavLink to={Routes.HOME} class="btn btn-facebook">
            <i class="fab fa-facebook-square"></i> Sign In with Facebook
          </NavLink>{" "} */}
          {/* App is just a test mode once its uploaded the live then change the URL in FB developer */}
          <FacebookLogin
            // appId="3077130045947446" //test only
            appId="2964913527091189" //IMP
            // autoLoad={true}
            fields="name,email,picture"
            scope="public_profile,email,user_friends"
            callback={responseFacebook}
            icon="fab fa-facebook-square"
            cssClass="btn btn-facebook"
            disableMobileRedirect={true}
          />
          <br />
          <GoogleLogin
            // clientId="180903532050-a3k6mvr2nvah6quu8jqo01phdk0v80se.apps.googleusercontent.com"
            clientId="824838106149-tatq9uuknm1f26hq766oi4bkniibkal5.apps.googleusercontent.com"
            buttonText="Sign In with Google"
            render={(renderProps) => (
              <button
                style={{ background: "transparent", border: 0, width: "100%" }}
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
        <div className="haveAccount">
          Don’t have an account?{" "}
          <NavLink to={Routes.SIGNUP}>Sign up here.</NavLink>
        </div>
        {/* <div className="haveAccount superAdminFlow">
          Super admin flow, <NavLink to={Routes.DASHBOARD}>Click here.</NavLink>
        </div> */}
      </div>
    </div>
  );
}

export default SignIn;
