import React, { Component } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink } from "react-router-dom";
import "antd/dist/antd.css";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import Loader from "../../utils/Loader";
import { Alert } from "reactstrap";
import moment from "moment";

function PastCampaign(props) {
  // console.log("proppp----", props);
  return (
    <div>
      <div className="transactionHistory">
        <div className="currentBalance">
          <h2>{props.totalBal ? props.totalBal : 0.0}</h2>
          <span>Current balance</span>
        </div>
        <div className="influencersTabDetail">
          <h3>Transaction History</h3>
          <ul className="influencersTabList">
            {props.loading == true ? (
              <div>
                <Loader />
              </div>
            ) : (
              <>
                {props.influncersTransactionData.length > 0 ? (
                  props.influncersTransactionData.map((item, index) => (
                    <>
                      <li key={index}>
                        <div className="transactionSgd">
                          {item.payment_status == 1 ? (
                            <>
                              {" "}
                              <h5 className="minus-sgd">
                                -
                                {item.credit_debit_amount
                                  ? item.credit_debit_amount
                                  : 0.0}{" "}
                                SGD
                              </h5>
                              <span>Waiting for Approval</span>{" "}
                            </>
                          ) : item.payment_status == 2 ? (
                            <>
                              {" "}
                              <h5>
                                +
                                {item.credit_debit_amount
                                  ? item.credit_debit_amount
                                  : 0.0}{" "}
                                SGD
                              </h5>
                              <span>Earned</span>
                            </>
                          ) : item.payment_status == 3 ? (
                            <>
                              {" "}
                              <h5>
                                +
                                {item.credit_debit_amount
                                  ? item.credit_debit_amount
                                  : 0.0}{" "}
                                SGD
                              </h5>
                              <span>Approved</span>
                            </>
                          ) : item.payment_status == 0 ? (
                            <>
                              {" "}
                              <h5>
                                +
                                {item.credit_debit_amount
                                  ? item.credit_debit_amount
                                  : 0.0}{" "}
                                SGD
                              </h5>
                              <span>Decline</span>
                            </>
                          ) : (
                            ""
                          )}
                          {/* {item.payment_status == 1 ? (
                            <span>Waiting for Approval</span>
                          ) : item.payment_status == 2 ? (
                            <span>Won</span>
                          ) : item.payment_status == 0 ? (
                            <span>Decline</span>
                          ) : item.payment_status == 3 ? (
                            <span>Approved</span>
                          ) : (
                            ""
                          )} */}
                          {/* {item.payment_status == 1 ? (
                            <span>Waiting for Approval</span>
                          ) : null} */}
                        </div>
                        <div className="transactionDate">
                          {moment(item?.transaction_date).format(
                            "MMM DD, yyyy"
                          )}
                        </div>
                      </li>
                    </>
                  ))
                ) : (
                  <>No Record Found </>
                )}{" "}
              </>
            )}

            {/* <li>
              <div className="transactionSgd">
                <h5>+3,500 SGD</h5>
                <span>Received from Food Grab campaign</span>
              </div>
              <div className="transactionDate">Jul 15, 2021</div>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PastCampaign;
