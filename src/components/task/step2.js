import React, { Component, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink, useHistory } from "react-router-dom";
import "antd/dist/antd.css";
import { Alert, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
import { Image } from "antd";
import { displayLog } from "../../utils/functions";
import Button from "@material-ui/core/Button";
import { apiCall } from "../../utils/common";
import ReactStars from "react-rating-stars-component";
function StepTwo(props) {
  // const [stepOne, setStepOne] = useState(props && props.stepOne);
  // console.log("DDDD-----", props);
  const [reqEdit, setReqEdit] = useState(false);
  const [review, setReview] = useState("");
  const [approve, setApprove] = useState(false);
  const [decline, setDecline] = useState(false);
  const [itemData, setItemData] = useState({});
  const [formData, setFormData] = useState({});
  const [disableButton, setDisableButton] = useState(false);
  const [reqHandle, sethandleReq] = useState(false);
  const [approvebtn, setApproveBtn] = useState();
  const [stepTwo, setStepTwo] = useState([]);

  const [error, setError] = useState(false);
  const [showRatingModal, setshowRatingModal] = useState(false);

  const history = useHistory();

  useEffect(() => {
    // console.log("fhhhh", itemData);

    getViewEntry();
  }, []);
  const getViewEntry = async () => {
    let req_data = {
      merchant_id: props.merchant_id,
      campaign_id: props.campaign_id,
      role: +localStorage.getItem("role"),
      id: props.user_id,
    };

    let res = await apiCall("POST", "viewPostOfInitialTask", req_data);

    if (res.code == 1) {
      console.log("RESSSS-STEP2", res);
      setStepTwo(res.data.step_two);
    } else if (res.code == 0) {
      displayLog(res.code, res.message);
    }
  };

  const handleEdit = () => {
    setReqEdit(true);
  };
  const handleInput = (e) => {
    setReview(e.target.value);
  };

  useEffect(() => {
    setDisableButton(false);
  }, []);
  console.log("setStepTwo", stepTwo);

  //close the rating modal
  const closeRatingModal = () => {
    setshowRatingModal(!showRatingModal);
  };
  //Handle the rating Data
  const handleRatingInput = (e) => {
    // console.log("event", e);
    setFormData(() => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
    setError(false);
  };
  //handle the rating
  const handleRating = (rating) => {
    setFormData(() => ({
      ...formData,
      stars: rating,
    }));
    setError(false);
  };
  //Handle the rating modal
  const handleRatingModal = async () => {
    console.log("FFF", formData);
    if (formData.comment && formData.stars) {
      const obj = formData;
      obj.campaign_id = props?.campaign_id;
      obj.id = props?.user_id;
      obj.role = +localStorage.getItem("role");

      let res = await apiCall("POST", "sendratingandReview", obj);

      if (res.code == 1) {
        history.push({
          pathname: "/influencer-view",
          state: {
            campaign_id: res.data.campaign_id,
            user_id: res.data.user_id,
          },
        });
        setshowRatingModal(false);
      } else if (res.code == 0) {
        displayLog(res.code, res.message);
      }
    } else {
      setError(true);
    }
  };
  //Req Edit Task
  const handleReqEdit = async (item) => {
    let reqData = {
      campaign_id: item.campaign_id,
      task_id: item.task_id,
      id: item.user_id,
      post_id: item.post_id,
      role: +localStorage.getItem("role"),
      flag: 3,
      review: review,
    };

    let res = await apiCall("POST", "acceptFinalStepRequest", reqData);
    console.log("RESSSS", res);
    if (res.code == 1) {
      setReqEdit(false);
      setDisableButton(true);
      setStepTwo(res?.data);
      // sethandleReq(!reqHandle);
      // setDisableButton(true);
      // window.location.reload();
    } else if (res.code == 0) {
      displayLog(res.code, res.message);
    }
  };
  //Decline the Task
  const handleDecline = async () => {
    let reqData = {
      campaign_id: itemData.campaign_id,
      task_id: itemData.task_id,
      id: itemData.user_id,
      post_id: itemData.post_id,
      role: +localStorage.getItem("role"),
      flag: 0,
    };
    let res = await apiCall("POST", "acceptFinalStepRequest", reqData);

    if (res.code == 1) {
      setDecline(false);
      setDisableButton(true);
      setStepTwo(res?.data);
      // window.location.reload();
    } else if (res.code == 0) {
      displayLog(res.code, res.message);
    }
  };
  //Approve the Task
  const handleApprove = async () => {
    console.log("CAMPPP", itemData);
    let reqData = {
      campaign_id: itemData.campaign_id,
      task_id: itemData.task_id,
      id: itemData.user_id,
      post_id: itemData.post_id,
      role: +localStorage.getItem("role"),
      flag: 2,
    };
    let res = await apiCall("POST", "acceptFinalStepRequest", reqData);
    if (res.code == 1) {
      setApprove(false);
      setDisableButton(true);
      setStepTwo(res?.data);
      // res.data.map((item, index) => {
      //   if (item.task_approved === 2) {
      //     setApproveBtn(item.task_approved);
      //   }
      // });
      // if (res.flag?.completion_flag == false) {
      //   window.location.reload();
      // }

      console.log("res.data", res.data);
      if (res.flag?.completion_flag == true) {
        setshowRatingModal(true);
      }
    } else if (res.code == 0) {
      displayLog(res.code, res.message);
    }

    // if (props.campaign && props.campaign.length == itemData.task_id) {
    //   // console.log("FINAL DATA", itemData);
    //   let reqData = {
    //     campaign_id: itemData.campaign_id,
    //     task_id: itemData.task_id,
    //     id: itemData.user_id,
    //     post_id: itemData.post_id,
    //     role: +localStorage.getItem("role"),
    //     flag: 2,
    //   };
    //   let res = await apiCall("POST", "acceptFinalStepRequest", reqData);
    //   if (res.code == 1) {
    //     setApprove(false);
    //     setDisableButton(true);
    //     // window.location.reload();
    //     res.data.map((item, index) => {
    //       if (item.task_approved === 2 && res.flag?.completion_flag == true) {
    //         setshowRatingModal(true);
    //       }
    //     });
    //   } else if (res.code == 0) {
    //     displayLog(res.code, res.message);
    //   }
    // }
    // else {
    //   // console.log("Not Last", itemData);
    //   let reqData = {
    //     campaign_id: itemData.campaign_id,
    //     task_id: itemData.task_id,
    //     id: itemData.user_id,
    //     post_id: itemData.post_id,
    //     role: +localStorage.getItem("role"),
    //     flag: 2,
    //   };
    //   let res = await apiCall("POST", "acceptFinalStepRequest", reqData);

    //   if (res.code == 1) {
    //     setApprove(false);
    //     setDisableButton(true);
    //     // window.location.reload();
    //   } else if (res.code == 0) {
    //     displayLog(res.code, res.message);
    //   }
    // }

    //     Important Note:
    //     flag : 0 => decline
    //  flag : 2 => approvve
    // flag : 3 => request edit => then pass review key in body
    // let reqData = {
    //   campaign_id: itemData.campaign_id,
    //   task_id: itemData.task_id,
    //   id: itemData.user_id,
    //   post_id: itemData.post_id,
    //   role: +localStorage.getItem("role"),
    //   flag: 2,
    // };
    // console.log("BODY", reqData);
    // //Suppose step 1 is pending...
    // props?.stepOne &&
    //   props?.stepOne.length > 0 &&
    //   props?.stepOne.map(async (item) => {
    //     // console.log("itemmm", item);
    //     if (item.is_approved_from_admin == 2) {
    //       let res = await apiCall("POST", "acceptFinalStepRequest", reqData);
    //       if (res.code == 1) {
    //         setApprove(false);
    //         setDisableButton(true);
    //         // window.location.reload();
    //         res.data.map((item, index) => {
    //           console.log("RESSSS------", item);
    //           if (res.flag?.completion_flag == true) {
    //             setshowRatingModal(true);
    //           }
    //         });
    //       } else if (res.code == 0) {
    //         displayLog(res.code, res.message);
    //       }
    //     } else {
    //       displayLog(0, "First Please All Approve step 1");
    //     }
    //   });
  };
  const handleApproveModal = (item) => {
    setApprove(true);
    setItemData(item);
  };
  const closeApproveModal = () => {
    setApprove(false);
  };
  const handleDeclineModal = (item) => {
    setDecline(true);
    setItemData(item);
  };
  const closeDeclineModal = () => {
    setDecline(false);
  };
  console.log("approvebtn", stepTwo);

  const stepTwoData =
    props.campaign.length > 0
      ? props.campaign.map((item, index) => {
          return stepTwo.length > 0 ? (
            stepTwo.map((task, index) => {
              if (item.task_id == task.task_id) {
                return (
                  <>
                    <div key={index}>
                      <h3 className="post-title">
                        {task.task_name ? task.task_name : "N/A"}
                      </h3>
                      <div className="post-detail">
                        <div className="post-url">
                          URL: {task.url ? task.url : "N/A"}
                        </div>
                        <div className="post-picture">
                          <Image
                            className="img-fluid w-100"
                            src={
                              task && task.post_screenshot
                                ? task.post_screenshot
                                : "data:image/png;base64,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"
                            }
                            fallback="data:image/png;base64,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"
                          />
                        </div>
                        <div className="post-buttons">
                          <div className="post-buttons">
                            {task.task_approved == 1 ? (
                              <>
                                {" "}
                                <button
                                  className="btn btn-transparent"
                                  onClick={handleEdit}
                                >
                                  Request Edit <i class="far fa-edit"></i>
                                </button>{" "}
                                <button
                                  className="btn btn-transparent"
                                  onClick={() => handleDeclineModal(task)}
                                >
                                  Decline <i class="far fa-times-circle"></i>
                                </button>
                                <button
                                  className="btn btn-transparent"
                                  onClick={() => handleApproveModal(task)}
                                >
                                  Approve <i class="far fa-check-circle"></i>
                                </button>{" "}
                              </>
                            ) : (
                              ""
                            )}
                            {task.task_approved == 2 ? (
                              <>
                                {" "}
                                <button
                                  className="btn btn-transparent"
                                  // onClick={() => handleApproveModal(task)}
                                  disabled={true}
                                  // disabled={
                                  //   task.is_approved_from_admin == 2 ||
                                  //   task.is_approved_from_admin == 3 ||
                                  //   task.is_approved_from_admin == 0
                                  //     ? true
                                  //     : disableButton
                                  // }
                                  // onClick={() => handleApprove(item)}
                                >
                                  Approved <i class="far fa-check-circle"></i>
                                </button>{" "}
                              </>
                            ) : (
                              ""
                            )}
                            {task.task_approved == 0 ? (
                              <>
                                {" "}
                                <button
                                  className="btn btn-transparent"
                                  onClick={() => handleDeclineModal(task)}
                                  disabled={true}
                                >
                                  Decline <i class="far fa-times-circle"></i>
                                </button>
                              </>
                            ) : (
                              ""
                            )}
                            {task.task_approved == 3 ? (
                              <>
                                {" "}
                                <button
                                  className="btn btn-transparent"
                                  onClick={handleEdit}
                                  disabled={true}
                                >
                                  Request Edit <i class="far fa-edit"></i>
                                </button>{" "}
                              </>
                            ) : (
                              ""
                            )}
                          </div>{" "}
                        </div>
                        {reqEdit == true ? (
                          <>
                            {" "}
                            <div className="post-put-review">
                              <textarea
                                className="form-control"
                                placeholder="Put review here"
                                name="review"
                                required
                                onChange={(e) => handleInput(e)}
                              ></textarea>
                              {review ? (
                                <button
                                  className="btn btn-transparent"
                                  onClick={() => handleReqEdit(task)}
                                >
                                  Send Request
                                </button>
                              ) : (
                                ""
                              )}
                            </div>{" "}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </>
                );
              }
            })
          ) : (
            <>
              <div key={item.user_id}>
                <h3 className="post-title">
                  {item.task_name ? item.task_name : "N/A"}
                </h3>
                <div className="post-detail">
                  <div className="post-url">
                    URL: {item.url ? item.url : "N/A"}
                  </div>
                  <div className="post-picture">
                    <Image
                      className="img-fluid w-100"
                      src={
                        item && item.post_screenshot
                          ? item.post_screenshot
                          : "data:image/png;base64,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"
                      }
                      fallback="data:image/png;base64,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"
                    />
                  </div>
                  <div className="post-buttons">
                    <button className="btn btn-transparent" disabled={true}>
                      Request Edit <i class="far fa-edit"></i>
                    </button>{" "}
                    <button className="btn btn-transparent" disabled={true}>
                      Decline <i class="far fa-times-circle"></i>
                    </button>
                    <button className="btn btn-transparent" disabled={true}>
                      Approve <i class="far fa-check-circle"></i>
                    </button>
                  </div>
                </div>
              </div>
            </>
          );
        })
      : "";

  return (
    <div>
      <div className="postItem step2">{stepTwoData}</div>
      {/* <div className="postItem"></div> */}
      {/* Show the rating Modal */}
      <Modal
        isOpen={showRatingModal}
        // toggle={() => closeRatingModal()}

        // style={{ maxWidth: "700px", width: "100%" }}
        // className="custom-modal-style"
      >
        <ModalHeader id="modal-header-css">
          Give Rating to user and Message
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <input
                  placeholder="Enter Message"
                  type="text"
                  name="comment"
                  className="form-control"
                  onChange={handleRatingInput}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <ReactStars
                  count={5}
                  name="stars"
                  className="form-control"
                  onChange={handleRating}
                  size={24}
                  activeColor="#ffd700"
                />
              </div>
            </div>
            <div className="col-md-12">
              {error == true ? (
                <Alert color="danger">Please fill the details</Alert>
              ) : null}
            </div>
          </div>
        </ModalBody>
        <ModalFooter id="modal-footer-css">
          <Button
            style={{ backgroundColor: "#3C16D5" }}
            className="text-white"
            variant="contained"
            onClick={() => handleRatingModal()}
          >
            Submit
          </Button>
        </ModalFooter>
      </Modal>
      {/* Approve Modal  */}
      <Modal
        isOpen={approve}
        toggle={() => closeApproveModal()}

        // style={{ maxWidth: "700px", width: "100%" }}
        // className="custom-modal-style"
      >
        <ModalHeader id="modal-header-css">
          Are you sure you want to Approve {itemData.task_name}?
        </ModalHeader>
        <ModalFooter id="modal-footer-css">
          <Button
            style={{ backgroundColor: "red" }}
            variant="contained"
            className="text-white btn-danger mx-2"
            onClick={() => closeApproveModal()}
          >
            No
          </Button>
          <Button
            style={{ backgroundColor: "#3C16D5" }}
            className="text-white"
            variant="contained"
            onClick={() => handleApprove()}
          >
            Yes
          </Button>
        </ModalFooter>
      </Modal>
      {/* Decline Modal */}
      <Modal
        isOpen={decline}
        toggle={() => closeDeclineModal()}

        // style={{ maxWidth: "700px", width: "100%" }}
        // className="custom-modal-style"
      >
        <ModalHeader id="modal-header-css">
          Are you sure you want to Decline {itemData.task_name}?
        </ModalHeader>
        <ModalFooter id="modal-footer-css">
          <Button
            style={{ backgroundColor: "red" }}
            variant="contained"
            className="text-white btn-danger mx-2"
            onClick={() => closeDeclineModal()}
          >
            No
          </Button>
          <Button
            style={{ backgroundColor: "#3C16D5" }}
            className="text-white"
            variant="contained"
            onClick={() => handleDecline()}
          >
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default StepTwo;
