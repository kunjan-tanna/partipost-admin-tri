import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink, useLocation, useHistory } from "react-router-dom";
import Header from "../../components/header/header";
import Stepone from "../../components/task/step1";
import StepTwo from "../../components/task/step2";
import { apiCall } from "../../utils/common";
import { displayLog } from "../../utils/functions";
import Loader from "../../utils/Loader";

import "antd/dist/antd.css";
import { Tabs, Image } from "antd";

const { TabPane } = Tabs;

function Taskview() {
  const { merchant_id, campaign_id, user_id, campaign_title, itemData } =
    useLocation().state;
  const [applicantDetails, setApplicantDetails] = useState({});
  const [amount, setAmount] = useState({});
  const [stepOne, setStepOne] = useState([]);
  const [stepTwo, setStepTwo] = useState([]);
  const [campaign, setCampaign] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingAmount, setRatingAmount] = useState(null);
  const [key, setKey] = useState("1");

  const history = useHistory();

  const callback = async (key) => {
    setKey(key);
    // if (key == "1") {
    //   window.location.reload();
    //   // getViewEntry();
    // } else if (key == "2") {
    //   getViewEntry();
    //   // window.location.reload();
    // }
    // let req_data = {
    //   merchant_id: merchant_id,
    //   campaign_id: campaign_id,
    //   role: +localStorage.getItem("role"),
    //   id: user_id,
    // };

    // console.log("BODY----", key);
    // let res = await apiCall("POST", "viewPostOfInitialTask", req_data);
    // console.log("RESSSS", res);
    // if (res.code == 1) {
    //   setLoading(false);
    //   // setApplicantDetails(res.applicant_detail);
    //   setStepOne(res.data.step_one);
    //   setCampaign(res.data.campaign);
    //   setStepTwo(res.data.step_two);
    // } else if (res.code == 0) {
    //   displayLog(res.code, res.message);
    // }
  };
  useEffect(() => {
    // console.log("fhhhh", itemData);
    setLoading(true);

    getViewEntry();
  }, []);
  const getViewEntry = async () => {
    let req_data = {
      merchant_id: merchant_id,
      campaign_id: campaign_id,
      role: +localStorage.getItem("role"),
      id: user_id,
    };

    let res = await apiCall("POST", "viewPostOfInitialTask", req_data);
    console.log("RESSSS", res);
    if (res.code == 1) {
      setLoading(false);
      setApplicantDetails(res.applicant_detail);
      setStepOne(res.data.step_one);
      setCampaign(res.data.campaign);
      setStepTwo(res.data.step_two);
      setAmount(res.amount);
      let req_data = {
        id: user_id,
        campaign_id: campaign_id,
      };
      let response = await apiCall("POST", "getTopRatedRecord", req_data);
      console.log("RESSSSRATED", response);
      if (response.code == 1) {
        setRatingAmount(response.data?.topRatedRatingWise);
      }
    } else if (res.code == 0) {
      displayLog(res.code, res.message);
    }
  };
  // console.log("applicantDetails", applicantDetails.jobCount?.length);
  return (
    <div>
      <Header />
      {loading == true ? (
        <div>
          <Loader />
        </div>
      ) : (
        <>
          {" "}
          <section className="taskview">
            <div className="container">
              <ul className="d-flex breadcrumbTop">
                <li>
                  {localStorage.getItem("role") == 1 ? (
                    <NavLink
                      to={Routes.MERCHANTSLIST}
                      title="Create New Campaign"
                      // className="border-round-btn"
                    >
                      {/* {localStorage.getItem("merchant_name")} */}
                      Merchants
                    </NavLink>
                  ) : localStorage.getItem("role") == 2 ? (
                    <NavLink
                      to={Routes.MERCHANTPROFILE}
                      title="Create New Campaign"
                      // className="border-round-btn"
                    >
                      {localStorage.getItem("merchant_name")}
                    </NavLink>
                  ) : (
                    ""
                  )}
                </li>
                {console.log("merchant_id", merchant_id)}
                <li
                  onClick={() => {
                    history.push({
                      pathname: Routes.MERCHANTSCAMPAIGNS,
                      state: {
                        merchant_id: merchant_id,
                      },
                    });
                  }}
                  style={{ color: "#737373", cursor: "pointer" }}
                >
                  {campaign_title}
                  {/* <NavLink
                    to={Routes.MERCHANTSCAMPAIGNS}
                    title="Campaign"
                    // className="border-round-btn"
                  >
                    Campaigns
                  </NavLink> */}
                </li>
                {/* <li>
                  <NavLink to={Routes.MERCHANTSCAMPAIGNS}>
                    {" "}
                    {campaign_title}
                  </NavLink>
                </li> */}
                {/* <li>
                  <NavLink
                    to="#"
                    onClick={() =>
                      history.push({
                        pathname: Routes.CAMPAIGN,
                        state: {
                          merchant_id: localStorage.getItem("merchant_id"),
                          campaign_id: campaign_id,
                          campaign_title: campaign_title,
                        },
                      })
                    }
                  >
                    {" "}
                    Campaign
                  </NavLink>
                 
                </li> */}
                <li>Tasks</li>
              </ul>
              <div className="taskview-content">
                {ratingAmount == true ? (
                  <div className="topRated-full">
                    <img src="images/award.png" alt="" />
                    TOP RATED
                  </div>
                ) : null}

                <div className="rated-user-profile">
                  <div className="rated-userLeft">
                    <div className="rated-user">
                      <Image
                        // className="img-fluid"
                        src={
                          applicantDetails?.profile_images
                            ? "https://fameonyou.s3.ap-southeast-1.amazonaws.com" +
                              applicantDetails?.profile_images[0]
                            : "data:image/png;base64,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"
                        }
                        fallback="data:image/png;base64,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"
                      />
                      {/* <img
                        src={
                          applicantDetails?.profile_images
                            ? "https://fameonyou.s3.ap-southeast-1.amazonaws.com" +
                              applicantDetails?.profile_images[0]
                            : "images/Defaultimage.jpeg"
                        }
                        alt=""
                      /> */}
                    </div>
                    <div className="rated-user-detail">
                      <h3>{applicantDetails?.user_name}</h3>
                      <p>
                        <i class="fas fa-map-marker-alt"></i>{" "}
                        {applicantDetails?.state}, {applicantDetails?.country}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rate-followers-detail">
                  <ul className="rate-followers">
                    <li>
                      <span>
                        {applicantDetails?.followers
                          ? applicantDetails?.followers
                          : "0"}
                      </span>
                      <label>Followers</label>
                    </li>
                    <li>
                      <span>${amount.amount / 1000}k</span>
                      <label>Total Earned</label>
                    </li>
                    <li>
                      <span>{applicantDetails.jobCount?.length}</span>
                      <label>Total Jobs</label>
                    </li>
                  </ul>
                  <div className="commonSocial">
                    <ul className="mt-0">
                      {applicantDetails.facebook_profile_url != "null" ||
                      null ? (
                        <li>
                          <a
                            href={
                              "https://" + applicantDetails.facebook_profile_url
                            }
                            target="_blank"
                          >
                            {" "}
                            <img
                              src="images/icon-facebook.png"
                              alt=""
                              target="_blank"
                            />
                          </a>
                        </li>
                      ) : null}
                      {applicantDetails.instagram_profile_url != "null" ||
                      null ? (
                        <li>
                          <a
                            href={
                              "https://" +
                              applicantDetails.instagram_profile_url
                            }
                            target="_blank"
                          >
                            <img src="images/icon-instagram.png" alt="" />
                          </a>
                        </li>
                      ) : null}
                      {applicantDetails.twitter_profile_url != "null" ||
                      null ? (
                        <li>
                          <a
                            href={
                              "https://" + applicantDetails.twitter_profile_url
                            }
                            target="_blank"
                          >
                            <img
                              src="images/icon-twitter.png"
                              alt=""
                              target="_blank"
                            />
                          </a>
                        </li>
                      ) : null}
                      {applicantDetails.tiktok_profile_url != "null" || null ? (
                        <li>
                          <a
                            href={
                              "https://" + applicantDetails.tiktok_profile_url
                            }
                            target="_blank"
                          >
                            {" "}
                            <img
                              src="images/icon-tiktok.png"
                              alt=""
                              target="_blank"
                            />
                          </a>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </div>

                <Tabs
                  // defaultActiveKey="1"
                  value={key}
                  onChange={callback}
                  className="custom-tabs"
                >
                  <TabPane tab="Step 1" key="1">
                    <Stepone
                      stepOne={stepOne}
                      campaign={campaign}
                      merchant_id={merchant_id}
                      campaign_id={campaign_id}
                      user_id={user_id}
                    />
                  </TabPane>
                  <TabPane tab="Step 2" key="2">
                    <StepTwo
                      campaign_id={campaign_id}
                      campaign={campaign}
                      merchant_id={merchant_id}
                      user_id={user_id}
                      stepTwo={stepTwo}
                      stepOne={stepOne}
                    />
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </section>{" "}
        </>
      )}
    </div>
  );
}

export default Taskview;
