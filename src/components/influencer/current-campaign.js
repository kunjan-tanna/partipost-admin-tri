import React, { Component } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink } from "react-router-dom";
import "antd/dist/antd.css";
import { StarOutlined, StarFilled } from "@ant-design/icons";

function CurrentCampaign(props) {
  // console.log("viewCampList", props);
  return (
    <div>
      <ul className="historyList">
        {props.viewCampList.length > 0
          ? props.viewCampList.map((item, index) => (
              <>
                {" "}
                <li key={index}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="merchantBox d-md-flex">
                        <div className="merchantName">
                          <h2>{item?.name ? item?.name : "N/A"}</h2>
                          {/* <p>{"item?.address"}</p>
                          <p>{"{item?.number}"}</p>
                          <p>{"item?.email"}</p> */}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5 text-md-right">
                      <h6>
                        {item?.campaign_title ? item?.campaign_title : "N/A"}
                      </h6>
                      {/* <label>Latest Campaign - hello</label> */}
                    </div>
                  </div>{" "}
                </li>
              </>
            ))
          : ""}
      </ul>
    </div>
  );
}

export default CurrentCampaign;
