import React, { useEffect, useState } from "react";
import Routes from "../../Routes/Routes";
import { NavLink, useHistory, useLocation, Link } from "react-router-dom";
import Header from "../../components/header/header";
import "antd/dist/antd.css";
import { Select } from "antd";
import moment from "moment";
import { apiCall } from "../../utils/common";
import ReactPaginate from "react-paginate";
import Loader from "../../utils/Loader";
import { displayLog } from "../../utils/functions";
import { Image } from "antd";

const { Option } = Select;

function Campaign() {
  const history = useHistory();
  const { merchant_id, campaign_id, campaign_title } = useLocation().state;
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [jobCount, setJobCount] = useState([]);
  const [imageurl, setImageurl] = useState();
  const [pageno, setPageno] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchBySelect, setsearchBySelect] = useState(1);

  useEffect(() => {
    getCampaigns();
  }, [searchBySelect]);
  // //console.log("searchBySelect", searchBySelect);
  const getCampaigns = async (item) => {
    let req_data = {
      merchant_id: merchant_id,
      campaign_id: campaign_id,
      role: localStorage.getItem("role"),
      page_no: pageno,
      limit: limit,
    };

    if (searchBySelect) {
      req_data["flag"] = searchBySelect;
    }
    //console.log("BODY", req_data);
    setLoading(true);
    let res = await apiCall("POST", "viewApplicantList", req_data);
    if (res.code == 1) {
      //console.log("RESSS-----", res.data.ApplicantList);

      setLoading(false);
      setImageurl(res.data.url);
      setCampaigns(res.data.ApplicantList);
      setJobCount(res.data.ApplicantList);
      setTotal(res.data.total);
    }
    if (res.code == 0) {
      displayLog(res.code, res.message);
    }
  };

  const handlePageClick = async (e) => {
    setPageno(e.selected + 1);
  };

  const getAvailability = (e) => {
    setsearchBySelect(e);

    // setTimeout(() => {
    //   getCampaigns();
    // }, 2000);
  };

  const goInfluencerView = async (
    cid,
    uid,
    title,
    parReq,
    uname,
    totalJob,
    count,
    topRatedRatingWise,
    topRatedAmountWise
  ) => {
    //console.log("FFFFFF", uname);
    history.push({
      pathname: "/influencer-view",
      state: {
        campaign_id: cid,
        user_id: uid,
        campaign_title: title,
        participate_request: parReq,
        user_name: uname,
        job_count: totalJob,
        count: count,
        topRatedRatingWise: topRatedRatingWise,
        topRatedAmountWise: topRatedAmountWise,
      },
    });
  };
  const goViewEntry = async (cid, uid, mid, title, item) => {
    // localStorage.setItem("jobCount", item?.jobCount.length);
    history.push({
      pathname: Routes.TASKVIEW,
      state: {
        campaign_id: cid,
        user_id: uid,
        merchant_id: mid,
        campaign_title: title,
        itemData: item,
      },
    });
  };
  const handleSelect = async (userCampId) => {
    let req_data = {
      user_campaign_id: userCampId,
      participate_request: 2,
      role: localStorage.getItem("role"),
    };
    // //console.log("helo", req_data);
    let res = await apiCall("POST", "acceptParticipantRequest", req_data);
    //console.log("RESS", res);
    if (res.code == 1) {
      setLoading(false);
      // getCampaigns();
      // history.push;

      window.location.reload();
    } else if (res.code == 0) {
      displayLog(res.code, res.message);
    }
  };

  return (
    <div>
      <Header />
      <section className="campaign">
        <div className="container">
          <div className="row align-items-center breadcrumbOuter">
            <div className="col-md-12">
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
                  Campaigns
                  {/* <NavLink
                    to={Routes.MERCHANTSCAMPAIGNS}
                    title="Campaign"
                    // className="border-round-btn"
                  >
                    Campaigns
                  </NavLink> */}
                </li>

                <li className="active">{campaign_title}</li>
              </ul>
            </div>
          </div>
          {/* <h1 className="campaign-title">{campaign_title}</h1> */}
          <div className="campaignHead">
            <div className="customasdAntSelect">
              <Select
                style={{ minWidth: 230 }}
                onChange={(e) => getAvailability(e)}
                value={searchBySelect}
                // defaultValue={<p style={{ color: "#2d3f62" }}>All Requested</p>}
              >
                <Option style={{ color: "#2d3f62" }} value={1}>
                  All Requested
                </Option>
                <Option style={{ color: "#2d3f62" }} value={2}>
                  Selected
                </Option>
                <Option style={{ color: "#2d3f62" }} value={3}>
                  Unselected
                </Option>
                {/* <Option style={{ color: "#2d3f62" }} value="1">
                  Selected Applicants 2
                </Option>
                <Option style={{ color: "#2d3f62" }} value="1">
                  Selected Applicants 2
                </Option> */}
              </Select>
            </div>
            {/* <ul className="customPagination">
              <li>5</li>
              <li>of</li>
              <li>25</li>
              <li>
                <NavLink to={Routes.HOME}>Next</NavLink>
              </li>
            </ul> */}
          </div>
          <div className="campaignList">
            {loading == true ? (
              <div>
                <Loader />
              </div>
            ) : (
              <React.Fragment>
                {campaigns.length > 0 ? (
                  <React.Fragment>
                    {campaigns.map((item, index) => {
                      //console.log("JOBCOUNT", item);
                      return (
                        <div key={index}>
                          <div className="campaignListItem">
                            <div className="campaignListHead">
                              <div className="row">
                                <div
                                  className="col-md-6"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    goInfluencerView(
                                      item.campaign_id,
                                      item.user_id,
                                      campaign_title,
                                      item.participate_request,
                                      item.user_name,
                                      item?.jobCount.length,
                                      item.followers,
                                      item.topRatedRatingWise,
                                      item.topRatedAmountWise
                                    );
                                  }}
                                >
                                  <div className="campaignListUser">
                                    <div className="campaignUserIcon">
                                      <Image
                                        // className="img-fluid w-100"
                                        src={
                                          item && item.profile_images
                                            ? "https://fameonyou.s3.ap-southeast-1.amazonaws.com" +
                                              item?.profile_images[0]
                                            : "data:image/png;base64,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"
                                        }
                                        fallback="data:image/png;base64,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"
                                      />
                                    </div>
                                    <span>{item.user_name}</span>
                                  </div>
                                </div>
                                <div className="col-md-6 text-right">
                                  <div className="commonSocial">
                                    <ul>
                                      {item.facebook_profile_url != "null" ||
                                      null ? (
                                        <li>
                                          <a
                                            href={
                                              "https://" +
                                              item.facebook_profile_url
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
                                      {item.instagram_profile_url != "null" ||
                                      null ? (
                                        <li>
                                          <a
                                            href={
                                              "https://" +
                                              item.instagram_profile_url
                                            }
                                            target="_blank"
                                          >
                                            <img
                                              src="images/icon-instagram.png"
                                              alt=""
                                            />
                                          </a>
                                        </li>
                                      ) : null}
                                      {item.twitter_profile_url != "null" ||
                                      null ? (
                                        <li>
                                          <a
                                            href={
                                              "https://" +
                                              item.twitter_profile_url
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
                                      {item.tiktok_profile_url != "null" ||
                                      null ? (
                                        <li>
                                          <a
                                            href={
                                              "https://" +
                                              item.tiktok_profile_url
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
                                      {item.topRatedRatingWise == true ||
                                      item.topRatedAmountWise == true ? (
                                        <li className="topRate">
                                          <img
                                            src="images/award.png"
                                            alt=""
                                            className="img-fluid"
                                          />
                                          TOP RATED
                                        </li>
                                      ) : null}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="campaignJobDetail">
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="campaignJobLeft">
                                    <h5>
                                      <strong>{item?.jobCount.length}</strong>{" "}
                                      Completed Jobs
                                    </h5>
                                    <p>
                                      <span>Work history:</span>
                                    </p>
                                    {/* {//console.log("itemmm", item.jobCount)} */}
                                    {/* {item.jobCount.map((subitem, index) =>
                                      //console.log("DATTTAA", subitem)
                                    )} */}
                                    {item.jobCount.length > 0 &&
                                      item.jobCount.map((subitem, index) => (
                                        <>
                                          {" "}
                                          <p>
                                            <strong>
                                              {subitem.count
                                                ? subitem?.count
                                                : "0"}
                                              +
                                            </strong>{" "}
                                            &nbsp;
                                            {subitem.category_name
                                              ? subitem?.category_name
                                              : "N/A"}
                                          </p>
                                        </>
                                      ))}
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="instagramFollowers">
                                    <span>
                                      <strong>
                                        {item.followers ? item.followers : "0"}
                                      </strong>{" "}
                                      Instagram followers
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="campaignList-btn">
                              {item.participate_request != 2 ? (
                                <button
                                  className="btn btn-default-blue"
                                  title="View"
                                  onClick={() => {
                                    goInfluencerView(
                                      item.campaign_id,
                                      item.user_id,
                                      campaign_title,
                                      item.participate_request,
                                      item.user_name,
                                      item?.jobCount.length,
                                      item.followers,
                                      item.topRatedRatingWise,
                                      item.topRatedAmountWise
                                    );
                                  }}
                                >
                                  View
                                </button>
                              ) : null}

                              {item.participate_request == 2 ? (
                                <button
                                  className="btn btn-default-blue"
                                  title="View"
                                  onClick={() => {
                                    goViewEntry(
                                      item.campaign_id,
                                      item.user_id,
                                      item.merchant_id,
                                      campaign_title,
                                      item
                                    );
                                  }}
                                >
                                  View Entry
                                </button>
                              ) : null}

                              {item.participate_request == 2 ? (
                                <button className="btn btn-default-green">
                                  <i class="fas fa-check"></i>
                                </button>
                              ) : null}
                              {item.participate_request != 2 ? (
                                <button
                                  className="btn btn-default-white"
                                  onClick={() =>
                                    handleSelect(item.user_campaign_id)
                                  }
                                >
                                  Select
                                </button>
                              ) : null}
                            </div>
                          </div>{" "}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ) : (
                  <div className="merchantsListLi">No Records Found</div>
                )}
              </React.Fragment>
            )}
            {campaigns.length > 0 ? (
              <ReactPaginate
                pageCount={Math.ceil(total / limit)}
                onPageChange={handlePageClick}
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                containerClassName={"pagination justify-content-end"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                activeClassName={"active"}
                forcePage={pageno - 1}
                style={{
                  zIndex: "1",
                  color: "#fff",
                  backgroundColor: "#0f3b4b",
                  borderColor: "#0f3b4b",
                }}
              />
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Campaign;
