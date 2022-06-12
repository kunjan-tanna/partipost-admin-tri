import React, { useEffect, useState } from "react";
import Routes from "../../Routes/Routes";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import Header from "../../components/header/header";
import moment from "moment";
import { apiCall } from "../../utils/common";
import ReactPaginate from "react-paginate";
import Loader from "../../utils/Loader";
import { Image } from "antd";

function MerchantsCampaigns(props) {
  const history = useHistory();
  // const { merchant_id, merchant_name } = useLocation().state;
  const [loading, setLoading] = useState(true);
  const [campaignList, setCampaignList] = useState([]);
  const [pageno, setPageno] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getCampaignlist();
  }, [pageno]);

  const getCampaignlist = async () => {
    console.log("merchant_id", props && props.location?.state);
    let req_data = {
      merchant_id: localStorage.getItem("merchant_id"),
      role: localStorage.getItem("role"),
      page_no: pageno,
      limit: limit,
    };
    if (localStorage.getItem("merchant_id")) {
      req_data.merchant_id = localStorage.getItem("merchant_id");
    } else {
      req_data.merchant_id = props && props.location?.state?.merchant_id;
    }

    let res = await apiCall("POST", "viewMerchantCampaign", req_data);
    if (res.data.Campaign.length > 0) {
      setLoading(false);
      setCampaignList(res.data.Campaign);
      setTotal(res.data.total);
    } else {
      setLoading(false);
    }
  };

  const handlePageClick = async (e) => {
    setPageno(e.selected + 1);
  };

  const goViewcampaignlist = async (mid, cid, isCreated) => {
    history.push({
      pathname: "/campaign-view",
      state: {
        merchant_id: mid,
        campaign_id: cid,
        is_campaign_created: isCreated,
      },
    });
  };

  const goCampaign = async (mid, cid, title) => {
    history.push({
      pathname: "/campaign",
      state: { merchant_id: mid, campaign_id: cid, campaign_title: title },
    });
  };
  const goEditCampaign = (mid, cid, iscamp) => {
    history.push({
      pathname: "/update-campaign",
      state: {
        merchant_id: mid,
        campaign_id: cid,
        is_campaign_created: iscamp,
      },
    });
  };
  return (
    <div>
      <Header />
      <section className="merchantsList">
        <div className="container">
          <div className="row align-items-center breadcrumbOuter">
            <div className="col-md-7">
              <ul className="d-flex breadcrumbTop">
                <li>
                  {localStorage.getItem("role") == 1 ? (
                    <NavLink
                      to={Routes.MERCHANTSLIST}
                      title="Create New Campaign"
                      // className="border-round-btn"
                    >
                      {localStorage.getItem("merchant_id")
                        ? localStorage.getItem("merchant_name")
                        : "Merchants"}
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
                <li className="active">Campaigns</li>
              </ul>
            </div>
            <div className="col-md-5 d-md-flex justify-content-end">
              <NavLink
                to={Routes.CREATCAMPAIGN}
                title="Create New Campaign"
                className="border-round-btn"
              >
                Create New Campaigns
              </NavLink>
            </div>
          </div>
          {loading == true ? (
            <div>
              <Loader />
            </div>
          ) : (
            <>
              {campaignList.length > 0 ? (
                campaignList.map((item, index) => (
                  <div className="merchantsCampaigns" key={index}>
                    <ul>
                      <li className="colBg">
                        <div className="row align-items-center">
                          <div className="col-md-7">
                            <div
                              className="merchantBox d-md-flex"
                              onClick={() => {
                                goViewcampaignlist(
                                  item.merchant_id,
                                  item.campaign_id
                                );
                              }}
                            >
                              <span className="campaignsImg">
                                <Image
                                  className="img-fluid"
                                  src={
                                    item.campaign_image
                                      ? item.campaign_image
                                      : "data:image/png;base64,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"
                                  }
                                  fallback="data:image/png;base64,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"
                                />
                                {/* <img
                                  src={
                                    item.campaign_image
                                      ? item.campaign_image
                                      : "images/Defaultimage.jpeg"
                                  }
                                  alt=""
                                  className="img-fluid"
                                /> */}
                              </span>
                              <div className="campaignsName">
                                <h2>{item.campaign_title}</h2>
                                <span>
                                  {moment(item.start_date).format(
                                    "MMM DD, yyyy"
                                  )}
                                  -{" "}
                                  {moment(item.end_date).format("MMM DD, yyyy")}
                                </span>

                                {moment(item.end_date).format("yyyy-MM-DD") <
                                moment(new Date()).format("yyyy-MM-DD") ? (
                                  <label className="close-label">Close</label>
                                ) : null}

                                {moment(new Date()).format("yyyy-MM-DD") >=
                                  moment(item.start_date).format(
                                    "yyyy-MM-DD"
                                  ) &&
                                moment(new Date()).format("yyyy-MM-DD") <=
                                  moment(item.end_date).format("yyyy-MM-DD") &&
                                item.accept_posting == 0 ? (
                                  <label>Pending</label>
                                ) : null}

                                {moment(new Date()).format("yyyy-MM-DD") >=
                                  moment(item.start_date).format(
                                    "yyyy-MM-DD"
                                  ) &&
                                moment(new Date()).format("yyyy-MM-DD") <=
                                  moment(item.end_date).format("yyyy-MM-DD") &&
                                item.accept_posting == 1 ? (
                                  <label className="launched-label">
                                    Launched
                                  </label>
                                ) : null}

                                {moment(item.start_date).format("yyyy-MM-DD") >
                                moment(new Date()).format("yyyy-MM-DD") ? (
                                  <label className="upcoming-label">
                                    Upcoming
                                  </label>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-5 pl-md-0 text-md-right">
                            <div className="d-md-flex justify-content-md-end">
                              {moment(item.end_date).format("yyyy-MM-DD") <
                              moment(new Date()).format("yyyy-MM-DD") ? null : (
                                <>
                                  {" "}
                                  {item.is_campaign_created == 0 ? (
                                    <div className="merchantsBtn">
                                      <button
                                        className="border-btn"
                                        title="View Campaign"
                                        onClick={() => {
                                          goEditCampaign(
                                            item.merchant_id,
                                            item.campaign_id,
                                            item.is_campaign_created
                                          );
                                        }}
                                      >
                                        Edit Campaign
                                      </button>
                                    </div>
                                  ) : null}
                                  {item.is_campaign_created == 1 ? (
                                    <>
                                      {" "}
                                      <div className="merchantsBtn">
                                        <button
                                          className="border-btn"
                                          title="View Campaign"
                                          onClick={() => {
                                            goViewcampaignlist(
                                              item.merchant_id,
                                              item.campaign_id,
                                              item.is_campaign_created
                                            );
                                          }}
                                        >
                                          View Campaign
                                        </button>
                                      </div>
                                      <div className="merchantsBtn">
                                        <button
                                          className="border-btn"
                                          title="View Campaign"
                                          onClick={() => {
                                            goCampaign(
                                              item.merchant_id,
                                              item.campaign_id,
                                              item.campaign_title
                                            );
                                          }}
                                        >
                                          View Applicants
                                        </button>
                                      </div>{" "}
                                    </>
                                  ) : null}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                ))
              ) : (
                <div className="merchantsListLi">No Records Found</div>
              )}
            </>
          )}

          {campaignList.length > 0 ? (
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
      </section>
    </div>
  );
}

export default MerchantsCampaigns;
