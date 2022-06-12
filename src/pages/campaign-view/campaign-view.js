import React, { useEffect, useState } from "react";
import Routes from "../../Routes/Routes";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import Header from "../../components/header/header";
import { apiCall } from "../../utils/common";
import moment from "moment";
import Loader from "../../utils/Loader";
import { Image } from "antd";
import { displayLog } from "../../utils/functions";
import $ from "jquery";

function CampaignView() {
  const history = useHistory();
  const { merchant_id, campaign_id, is_campaign_created } = useLocation().state;
  const [loading, setLoading] = useState(true);
  const [acceptPosting, setAcceptPosting] = useState(null);
  const [viewCampaign, setViewCampaign] = useState({});

  const [viewCampaignImage, setViewCampaignImage] = useState("");

  useEffect(() => {
    getViewCampaign();
  }, []);

  const getViewCampaign = async () => {
    let req_data = {
      merchant_id: merchant_id,
      campaign_id: campaign_id,
      role: localStorage.getItem("role"),
    };
    let res = await apiCall("POST", "viewCampaignDetails", req_data);
    console.log("RESS", res);
    if (res.data.length > 0) {
      setLoading(false);
      setViewCampaign(res.data[0]);
      setViewCampaignImage(res.data[0].campaign_image);
    } else {
      setLoading(false);
    }
  };
  const goEditCampaign = (mid, cid, ac) => {
    history.push({
      pathname: "/update-campaign",
      state: { merchant_id: mid, campaign_id: cid, accept_posting: ac },
    });
  };

  //handle the accpet post request
  const handleAccept = async () => {
    // accept_posting : 1
    let req_data = {
      campaign_id: campaign_id,
      role: +localStorage.getItem("role"),
      accept_posting: 1,
    };
    if (+localStorage.getItem("role") == 1) {
      req_data.merchant_id = merchant_id;
    }
    // //console.log("Hello", req_data);
    let res = await apiCall("POST", "acceptPosting", req_data);

    if (res.code == 1) {
      if (res.data.length > 0) {
        let text = res.data[0].campaign_image;

        let result = text.includes(
          "https://fameonyou.s3.ap-southeast-1.amazonaws.com/"
        );
        //console.log("RESS----", result);
        setViewCampaign(res.data[0]);
      }
    } else if (res.code == 0) {
      displayLog(res.code, res.message);
    }
  };
  //handle the decline post request
  const handleDecline = async () => {
    // accept_posting : 0 - decline
    let req_data = {
      campaign_id: campaign_id,
      role: +localStorage.getItem("role"),
      accept_posting: 0,
    };
    if (+localStorage.getItem("role") == 1) {
      req_data.merchant_id = merchant_id;
    }
    //console.log("Hello----", req_data);
    let res = await apiCall("POST", "acceptPosting", req_data);
    //console.log("RESS----", res);
    if (res.code == 1) {
      if (res.data.length > 0) {
        setViewCampaign(res.data[0]);
      }
    } else if (res.code == 0) {
      displayLog(res.code, res.message);
    }
  };

  return (
    <div>
      <Header />
      <section className="campaignView">
        <div className="container">
          <ul className="d-flex breadcrumbTop">
            <li>
              <NavLink to={Routes.MERCHANTSCAMPAIGNS}> My Campaigns</NavLink>
            </li>
            <li>{viewCampaign?.campaign_title}</li>
          </ul>
          {loading == true ? (
            <div>
              {" "}
              <Loader />
            </div>
          ) : (
            <div className="colBg campaignViewDetail">
              <div className="campaignViewPicture">
                <Image
                  className="img-fluid"
                  src={
                    viewCampaignImage.includes(
                      "https://fameonyou.s3.ap-southeast-1.amazonaws.com"
                    )
                      ? viewCampaignImage
                      : "https://fameonyou.s3.ap-southeast-1.amazonaws.com" +
                        viewCampaignImage
                  }
                  fallback="data:image/png;base64,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"
                />
                {/* <img
                  src={
                    viewCampaign.campaign_image
                      ? viewCampaign.campaign_image
                      : "images/Defaultimage.jpeg"
                  }
                  alt=""
                  className="img-fluid"
                /> */}
              </div>
              <div className="campaignViewHead">
                <div className="campaignViewHeadLeft">
                  <h5> {viewCampaign?.campaign_title}</h5>
                  <ul>{viewCampaign?.description}</ul>
                </div>
                <div className="campaignViewHeadRight">
                  {viewCampaign?.accept_posting == 1 ? (
                    <>
                      {" "}
                      <p>Earn up to</p>
                      <h2>SGD {viewCampaign?.price}.00</h2>{" "}
                    </>
                  ) : (
                    <label>Pending...</label>
                  )}
                </div>
              </div>

              <div className="campaignRequirements">
                <h2>Campaign status</h2>

                {viewCampaign?.accept_posting == 0 ? (
                  <>
                    <label style={{ color: "#cf1516" }}>Pending...</label>
                  </>
                ) : (
                  <label style={{ color: "#41b64b" }}>Accepted</label>
                )}
              </div>
              <div className="campaignRequirements">
                <h2>Requirements</h2>
                <p>{viewCampaign?.requirements}</p>
              </div>

              <div className="campaignRequirements">
                <div className="row">
                  <div className="col-md-3">
                    <h2>Start Date</h2>
                    <p>
                      {moment(viewCampaign.start_date).format("MMM DD, yyyy")}
                    </p>
                  </div>
                  <div className="col-md-3">
                    <h2>End Date</h2>
                    <p>
                      {moment(viewCampaign.end_date).format("MMM DD, yyyy")}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h2>Rules</h2>
                    <p>{viewCampaign?.rules}</p>
                  </div>
                </div>
                <div className="campaignRequirements">
                  <div className="row">
                    <div className="col-md-12 text-md-right">
                      <div className="merchantsBtn">
                        <button
                          className="border-btn"
                          title="View Campaign"
                          onClick={() => {
                            goEditCampaign(
                              viewCampaign?.merchant_id,
                              viewCampaign?.campaign_id,
                              viewCampaign?.accept_posting
                            );
                          }}
                        >
                          Edit Campaign
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="floating-btns">
          <div className="container">
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-accept"
                onClick={() => {
                  handleAccept();
                }}
                disabled={viewCampaign?.accept_posting == 1 ? true : false}
              >
                Accept posting
              </button>
              <button
                className="btn btn-decline"
                onClick={() => {
                  handleDecline();
                }}
                disabled={viewCampaign?.accept_posting == 0 ? true : false}
              >
                Decline posting
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CampaignView;
