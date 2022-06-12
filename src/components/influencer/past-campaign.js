import React, { Component } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink } from "react-router-dom";
import "antd/dist/antd.css";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import ReactStars from "react-rating-stars-component";
import moment from "moment";
import { Alert } from "reactstrap";

function PastCampaign(props) {
  // console.log("reviewRating", props);
  return (
    <div>
      <ul className="historyList">
        {props.reviewRating.length > 0 ? (
          props.reviewRating.map((item, index) => (
            <>
              <li key={index}>
                <h4>{item.comment ? item.comment : "N/A"}</h4>
                <div className="rating-date">
                  <span className="rating">
                    <ReactStars
                      name="rating"
                      className="form-control"
                      size={24}
                      value={item.stars ? item.stars : null}
                      activeColor="#ffd700"
                      edit={false}
                    />
                  </span>
                  <span className="ratingOf">
                    {item.stars ? item.stars : null}.0
                  </span>

                  <span className="dateRange">
                    {" "}
                    {moment.unix(item?.created_date).format("MMM DD, yyyy")}
                  </span>
                </div>
              </li>
            </>
          ))
        ) : (
          <Alert color="danger">No Record Found</Alert>
        )}
      </ul>
    </div>
  );
}

export default PastCampaign;
