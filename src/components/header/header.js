import React, { Component, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink } from "react-router-dom";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import Button from "@material-ui/core/Button";
import { connect, useDispatch } from "react-redux";

import $ from "jquery";
import { onMessageListener } from "../../utils/firebaseInit";
import firebase from "firebase/app";
import { apiCall } from "../../utils/common";
import * as logoutAction from "../../redux/actions/login/index";
import { displayLog } from "../../utils/functions";
import Loader from "../../utils/Loader";

function Header(props) {
  const [showlogout, setShowlogout] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "" });
  const [notificatiototal, setNotificationTotal] = useState(null);
  const [pageno, setPageno] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("HELLO", props);
    setLoading(true);
    if (firebase.messaging.isSupported()) {
      firebase.messaging().onMessage(
        (payload) => {
          console.log("PAYLOAD", payload);
          viewNotificationList();
          displayLog(1, payload.notification.body);
          // alertify.success(payload.notification.body);
        },
        (e) => {
          console.log(e);
        }
      );
    }

    viewNotificationList();
  }, [notificatiototal]);

  //show the notication list
  const viewNotificationList = async () => {
    const token = props && props.accessToken;
    // const token = localStorage.getItem("auth_token");
    let req_data = {
      role: props.role,
    };
    await dispatch(logoutAction.NotificationCount(req_data, token)).then(
      (response) => {
        if (response.data.code == 1) {
          setLoading(false);
          console.log("RESOPONN", response.data.data);
          if (response.data.data?.unreadNotificationCount !== 0) {
            console.log("llll");
            setNotificationTotal(response.data.data?.unreadNotificationCount);
          }
        }
      }
    );
  };

  const showLogoutModal = () => {
    setShowlogout(true);
  };
  const closeLogoutModal = () => {
    setShowlogout(false);
  };
  const logout = async () => {
    const token = localStorage.getItem("auth_token");
    let req_data = {
      role: props.role,
      // page_no: pageno,
      // limit: limit,
    };
    await dispatch(logoutAction.logout(req_data, token)).then((response) => {
      console.log("RESOPONN", response);
      if (response.data.code == 1) {
        localStorage.clear();
        window.location.reload();
      }
    });
  };
  const handleMenu = () => {
    setMenuOpen(!menuOpen);
    // setTimeout(() => {
    //   setMenuOpen(false);
    // }, 5000);
    // $("subMenu").toggleClass("open");
  };
  console.log("notificatiototal", notificatiototal);

  return (
    <header>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 col-6">
            {props && props.role == 1 ? (
              <NavLink to={Routes.DASHBOARD} className="logo">
                admin
              </NavLink>
            ) : null}
            {props &&
            props.viewData?.viewData?.is_verified == 1 &&
            props &&
            props.role == 2 ? (
              <NavLink to={Routes.DASHBOARD} className="logo">
                Merchant
              </NavLink>
            ) : props && props.role == 2 ? (
              <NavLink to={Routes.MERCHANTPROFILE} className="logo">
                Merchant
              </NavLink>
            ) : null}
          </div>
          {(props && props.viewData?.viewData?.is_verified == 1) ||
          (props && props.role == 1) ? (
            <>
              {" "}
              <div className="col-md-6 col-6">
                <div className="rightIcon">
                  <ul className="d-flex m-0">
                    <li>
                      <NavLink
                        to={Routes.NOTIFICATIONLIST}
                        className="notification"
                      >
                        {" "}
                        <i class="fas fa-bell"></i>
                        {/* {
                      loading == true ? (
                        <Loader />
                      ) : (
                        notificatiototal !== 0 && (
                          <span> {notificatiototal} </span>
                        )
                      )
                      
                    } */}
                        {notificatiototal !== null && (
                          <span>{notificatiototal}</span>
                        )}
                        {/* {notificatiototal !== 0 ? (
                      <span className="d-flex">{notificatiototal}</span>
                    ) : (
                      <span className="d-none"></span>
                    )} */}
                      </NavLink>
                    </li>
                    <li>
                      <span
                        className="dropdownIcon"
                        onClick={() => handleMenu()}
                      >
                        <i class="fas fa-user-alt"></i>
                      </span>
                      <div className={`subMenu ${menuOpen ? "open" : ""}`}>
                        <ul>
                          {props && props.role == 1 ? (
                            <>
                              <li>
                                <NavLink to={Routes.DASHBOARD}>
                                  {/* <i className="fa fa-home iconLink"></i> */}
                                  <i>
                                    <img src="images/dashboard.png" alt="" />
                                  </i>{" "}
                                  <span>Dashboard</span>
                                </NavLink>{" "}
                              </li>
                              <li>
                                <NavLink to={Routes.MERCHANTSLIST}>
                                  <i>
                                    <img
                                      src="images/merchants-icon.png"
                                      alt=""
                                    />
                                  </i>{" "}
                                  Merchants
                                </NavLink>{" "}
                              </li>
                              <li>
                                <NavLink to={Routes.INFLUENCER}>
                                  <i>
                                    <img
                                      src="images/influencers-icon.png"
                                      alt=""
                                    />
                                  </i>{" "}
                                  Influencers
                                </NavLink>{" "}
                              </li>
                              <li>
                                <NavLink to={Routes.SETTING}>
                                  <i>
                                    <img src="images/setting-icon.png" alt="" />
                                  </i>{" "}
                                  Setting
                                </NavLink>{" "}
                              </li>
                              <li onClick={showLogoutModal}>
                                <i className="iconLink">
                                  <img src="images/logout-icon.png" alt="" />
                                </i>
                                <span style={{ cursor: "pointer" }}>
                                  Log Out
                                </span>
                              </li>
                            </>
                          ) : null}
                          {props && props.role == 2 ? (
                            <>
                              <li>
                                <NavLink to={Routes.MERCHANTPROFILE}>
                                  <i>
                                    <img
                                      src="images/influencers-icon.png"
                                      alt=""
                                    />
                                  </i>{" "}
                                  Profile
                                </NavLink>{" "}
                              </li>
                              <li>
                                <NavLink to={Routes.MERCHANTSCAMPAIGNS}>
                                  <i>
                                    <img
                                      src="images/merchants-icon.png"
                                      alt=""
                                    />
                                  </i>{" "}
                                  Home
                                </NavLink>{" "}
                              </li>
                              <li onClick={showLogoutModal}>
                                <i
                                  className="iconLink"
                                  style={{ cursor: "pointer" }}
                                >
                                  <img src="images/logout-icon.png" alt="" />
                                </i>
                                <span style={{ cursor: "pointer" }}>
                                  Log Out
                                </span>
                              </li>
                            </>
                          ) : null}
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>{" "}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      <Modal
        isOpen={showlogout}
        toggle={() => closeLogoutModal()}

        // style={{ maxWidth: "700px", width: "100%" }}
        // className="custom-modal-style"
      >
        <ModalHeader id="modal-header-css">
          Are you sure you want to logout?
          {/* <button
                    type="button"
                    className="close_btn"
                    aria-label="Close"
                    onClick={() =>
                      this.setState({ showlogout: !this.state.showlogout })
                    }
                  ></button> */}
        </ModalHeader>
        <ModalFooter id="modal-footer-css">
          <Button
            style={{ backgroundColor: "red" }}
            variant="contained"
            className="text-white btn-danger mx-2"
            onClick={closeLogoutModal}
          >
            No
          </Button>
          <Button
            style={{ backgroundColor: "#3C16D5" }}
            className="text-white"
            variant="contained"
            onClick={() => logout()}
          >
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </header>
  );
}
const mapStateToProps = (state) => {
  return {
    role: state.loginReducer.role,
    accessToken: state.loginReducer.accessToken,
    viewData: state.dataReducer.viewData,
  };
};
export default connect(mapStateToProps)(Header);
