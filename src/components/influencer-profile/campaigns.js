import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink } from "react-router-dom";
import "antd/dist/antd.css";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import { Alert } from "reactstrap";
import Loader from "../../utils/Loader";

function PastCampaign(props) {
   // const [influencerList, setinfluencerList] = useState(props);
   // console.log("useState", props);

   return (
      <div>
         <div className="listingTable campaignTable">
            <div className="table-responsive">
               <table className="table no-border-table whiteSpaceNowrap mb-0">
                  <tbody>
                     {props.loading == true ? (
                        <div>
                           <Loader />
                        </div>
                     ) : (
                        <>
                           {props.influencerList &&
                           props.influencerList.length > 0 ? (
                              props.influencerList.map((item, index) => (
                                 <>
                                    <tr key={index}>
                                       <td>
                                          {item.campaign_title
                                             ? item.campaign_title
                                             : "N/A"}
                                       </td>
                                       <td className="text-right td-light">
                                          {item.is_completed == 0
                                             ? "Not started"
                                             : item.is_completed == 2
                                             ? "Completed"
                                             : item.is_completed == 1
                                             ? "On Going"
                                             : null}
                                       </td>
                                    </tr>
                                 </>
                              ))
                           ) : (
                              <>No Record Found</>
                           )}{" "}
                        </>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}

export default PastCampaign;
