import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink } from "react-router-dom";
import "antd/dist/antd.css";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import Loader from "../../utils/Loader";
import { Alert, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
import moment from "moment";
import Button from "@material-ui/core/Button";
import { apiCall } from "../../utils/common";
import { displayLog } from "../../utils/functions";

function PastCampaign(props) {
  const [approve, setApprove] = useState(false);
  const [decline, setDecline] = useState(false);
  const [itemData, setItemData] = useState({});

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

  //Handle the Approve request
  const handleApprove = async () => {
    // payment_status : 3 - Approve
    let req_data = {
      transaction_history_id: itemData.transaction_history_id,
      id: itemData.user_id,
      payment_status: 3,
    };

    let res = await apiCall(
      "POST",
      "isacceptordecliewithdrawRequest",
      req_data
    );

    if (res.code == 1) {
      setApprove(false);
      window.location.reload();
    } else if (res.code == 0) {
      displayLog(res.code, res.message);
    }
  };
  const handleDecline = async () => {
    // payment_status : 3 - Approve
    let req_data = {
      transaction_history_id: itemData.transaction_history_id,
      id: itemData.user_id,
      payment_status: 0,
    };

    let res = await apiCall(
      "POST",
      "isacceptordecliewithdrawRequest",
      req_data
    );

    if (res.code == 1) {
      setDecline(false);
      window.location.reload();
    } else if (res.code == 0) {
      displayLog(res.code, res.message);
    }
  };
  //Handle the Decline request
  // const handleDecline = async () => {
  //   // payment_status : 0 - decline
  //   console.log("ITEMDATA", itemData);
  //   // let req_data = {
  //   //   transaction_history_id: itemData.transaction_history_id,
  //   //   id: itemData.user_id,
  //   //   payment_status: 0,
  //   // };
  //   // // console.log("BODY---Aprrove", req_data);
  //   // let res = await apiCall(
  //   //   "POST",
  //   //   "isacceptordecliewithdrawRequest",
  //   //   req_data
  //   // );
  //   // console.log("BODY---", res);
  //   // if (res.code == 1) {
  //   //   setDecline(false);
  //   //   // window.location.reload();
  //   // } else if (res.code == 0) {
  //   //   displayLog(res.code, res.message);
  //   // }
  // };
  return (
    <div>
      <div className="requestsTab">
        {props.loading == true ? (
          <div>
            <Loader />
          </div>
        ) : (
          <>
            {props.withdrawRequestList &&
            props.withdrawRequestList.length > 0 ? (
              props.withdrawRequestList.map((item, index) => (
                <>
                  <ul className="influencersTabList mt-0 border-0">
                    <li key={index}>
                      <div className="withdrawalRequest">
                        <h5>
                          <strong>
                            {item?.credit_debit_amount
                              ? item?.credit_debit_amount
                              : 0.0}
                          </strong>{" "}
                          Withdrawal Request
                        </h5>
                        <span>
                          {" "}
                          {moment(item?.transaction_date).format(
                            "MMM DD, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="requestsAction">
                        {item?.payment_status == 1 ? (
                          <>
                            {" "}
                            <button
                              className="viewButton"
                              style={{ color: "#f61c0d" }}
                              onClick={() => handleDeclineModal(item)}
                            >
                              Decline
                            </button>
                            <button
                              className="viewButton"
                              onClick={() => handleApproveModal(item)}
                            >
                              Approve
                            </button>
                          </>
                        ) : null}
                        {item?.payment_status == 0 ? (
                          <>
                            <span>Decline</span>
                          </>
                        ) : null}
                        {item?.payment_status == 2 ? (
                          <>
                            <span>Earned</span>
                          </>
                        ) : null}
                        {item?.payment_status == 3 ? (
                          <>
                            <span>Approved</span>
                          </>
                        ) : null}
                      </div>
                    </li>
                  </ul>
                </>
              ))
            ) : (
              <>No Record Found</>
            )}{" "}
          </>
        )}
      </div>
      {/* Approve Modal  */}
      <Modal
        isOpen={approve}
        toggle={() => closeApproveModal()}

        // style={{ maxWidth: "700px", width: "100%" }}
        // className="custom-modal-style"
      >
        <ModalHeader id="modal-header-css">
          Are you sure you want to Approve?
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
          Are you sure you want to Decline?
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

export default PastCampaign;
