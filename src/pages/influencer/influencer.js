import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Routes from "../../Routes/Routes";
import { NavLink } from "react-router-dom";
import { apiCall } from "../../utils/common";
import moment from "moment";
import Header from "../../components/header/header";
import "antd/dist/antd.css";
import { Select } from "antd";
import Loader from "../../utils/Loader";
import ReactPaginate from "react-paginate";
const { Option } = Select;

function Influencer() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [sortEarned, setSortEarned] = useState(false);
  const [influencerList, setInfluencerList] = useState([]);
  const [pageno, setPageno] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchByName, setSearchByName] = useState("");
  const [sorting, setSorting] = useState("DESC");

  useEffect(() => {
    setLoading(true);
    getInfluencerlist();
  }, [pageno, sorting, sortEarned]);

  const getInfluencerlist = async () => {
    let req_data = {
      role: localStorage.getItem("role"),
      page_no: pageno,
      limit: limit,
      sort: sorting,
    };
    if (searchByName.replace(/\s+/g, "") !== "") {
      req_data["searchByName"] = searchByName;
    }

    let res = await apiCall("POST", "getInfluncersList", req_data);

    if (res.code == 1) {
      setLoading(false);
      if (sortEarned == true) {
        console.log("TRUE");
        let sorting = res.data.Influncers.sort(function (a, b) {
          return a.total_amount - b.total_amount;
        });

        setInfluencerList([...sorting]);
      } else {
        console.log("FALSE");
        setInfluencerList(res.data.Influncers);
      }

      setTotal(res.data.total);
    } else {
      setLoading(false);
    }
  };

  const handlePageClick = async (e) => {
    setPageno(e.selected + 1);
    // setSortEarned(sortEarned == false ? true : false);
  };
  const goViewinfluencer = (item) => {
    console.log("HELLO", item);
    history.push({
      pathname: "/influencer-profile",
      state: { user_id: item.user_id, itemData: item },
    });
  };
  //HANDLE THE SORTING DATA
  const handleSorting = () => {
    setSorting(sorting == "ASC" ? "DESC" : "ASC");
    // console.log("sss", sorting);
    // getInfluencerlist();
  };
  const handleSortingData = () => {
    setSortEarned(sortEarned == false ? true : false);
  };

  return (
    <div>
      <Header />
      <section className="listingTableMain">
        <div className="container">
          <div className="listingFilter">
            <h3>Influencers</h3>
            <div className="listingFilterRight">
              {/* <div className="customSelect">
                <Select
                  defaultValue="All"
                  style={{ width: 246 }}
                  // onChange={handleChange}
                >
                  <Option value="All">All</Option>
                  <Option value="Withdrawal Request">Withdrawal Request</Option>
                </Select>
              </div> */}
              <div className="filterSearch">
                <input
                  type="search"
                  class="form-control"
                  placeholder="Search a name"
                  value={searchByName}
                  onChange={(e) => setSearchByName(e.target.value)}
                  // onKeyDown={() => getInfluencerlist()}
                  onKeyUp={() => getInfluencerlist()}
                />
                <button
                  type="button"
                  class="searchBtn"
                  onClick={() => getInfluencerlist()}
                  style={{ cursor: "default" }}
                >
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="listingTable">
            <div className="table-responsive">
              <table class="table no-border-table whiteSpaceNowrap mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    {console.log("sorting====", sorting)}
                    <th>
                      Date Joined &nbsp;
                      {sorting == "DESC" ? (
                        <>
                          {" "}
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSorting()}
                          >
                            <i className="fas fa-arrow-down"></i>
                          </span>{" "}
                        </>
                      ) : sorting == "ASC" ? (
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSorting()}
                        >
                          <i className="fas fa-arrow-up"></i>
                        </span>
                      ) : (
                        ""
                      )}
                    </th>
                    <th>
                      Total Earned &nbsp;
                      {sortEarned == false ? (
                        <>
                          {" "}
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSortingData()}
                          >
                            <i className="fas fa-arrow-down"></i>
                          </span>{" "}
                        </>
                      ) : sortEarned == true ? (
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSortingData()}
                        >
                          <i className="fas fa-arrow-up"></i>
                        </span>
                      ) : (
                        ""
                      )}
                      {/* {sorting == "DESC" ? (
                        <>
                          {" "}
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSorting()}
                          >
                            <i className="fas fa-arrow-down"></i>
                          </span>{" "}
                        </>
                      ) : sorting == "ASC" ? (
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSorting()}
                        >
                          <i className="fas fa-arrow-up"></i>
                        </span>
                      ) : (
                        ""
                      )} */}
                    </th>
                    {/* <th>Withdrawal Request</th> */}
                    <th width="144">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading == true ? (
                    <div>
                      <Loader />
                    </div>
                  ) : (
                    <>
                      {influencerList.length > 0 ? (
                        influencerList.map((item, index) => (
                          <tr key={index}>
                            <td>{item.user_name}</td>
                            <td>
                              {moment
                                .unix(item.created_date)
                                .format("MMM DD, yyyy")}
                            </td>
                            <td>
                              {item?.total_amount ? item?.total_amount : "0"}
                            </td>
                            {/* <td>Sept 21, 2021 static</td> */}
                            <td className="action">
                              {/* <NavLink to={Routes.HOME} className="disable">
                                Disable
                              </NavLink> */}
                              <button
                                className="viewButton"
                                onClick={() => {
                                  goViewinfluencer(item);
                                }}
                              >
                                View
                              </button>
                              {/* <NavLink
                                to={Routes.INFLUENCERPROFILE}
                                className="view"
                              >
                                View
                              </NavLink> */}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <div className="merchantsListLi">No Records Found</div>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <div className="tablePagination">
              {influencerList.length > 0 ? (
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
        </div>
      </section>
    </div>
  );
}

export default Influencer;
