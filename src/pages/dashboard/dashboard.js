import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import "antd/dist/antd.css";
import { Select } from "antd";
import { Pie } from "react-chartjs-2";
// import { Chart, ArcElement } from "chart.js";
import { apiCall } from "../../utils/common";
import { displayLog } from "../../utils/functions";
const { Option } = Select;

// Chart.register(ArcElement);

function Dashboard() {
   const [lastWeek, setLastWeek] = useState([]);
   const [thisWeek, setThisWeek] = useState([]);
   const [totalInfluncers, setTotalInfluncers] = useState("");
   const [totalMerchant, setTotalMerchant] = useState("");
   const [totalCampaign, setTotalCampaign] = useState("");
   const [influencerType, setInfluencerType] = useState(1);
   const [campaignType, setCampaignType] = useState(1);
   const [merchantType, setMerchantType] = useState(1);
   const [canvasType, setCanvasType] = useState(1);
   const [campaginCount, setCampaignCount] = useState(0);

   useEffect(() => {
      viewDashboard();
   }, []);
   const viewDashboard = async () => {
      let reqData = {};
      let response = await apiCall("POST", "dashBoard", reqData);
      // console.log("RESPONSE====", response);

      if (response.code == 1) {
         if (
            response.data.thisWeek.length > 0 &&
            response.data.lastWeek.length > 0
         ) {
            setThisWeek(response.data.thisWeek);
            setLastWeek(response.data.lastWeek);

            if (response.data.lastWeek[2]?.CampaignCount.length > 0) {
               console.log("11111111111111111111111111");
               console.log("LENGTH", response.data.lastWeek[2]?.CampaignCount);

               // CampaignCountData();
            }
         }

         // setCampaignCount(response.data.lastWeek[2]?.CampaignCount);
         setTotalInfluncers(response.data.totalInfluncers);
         setTotalMerchant(response.data.totalMerchant);
         setTotalCampaign(response.data.totalCampaign);
      } else if (response.code == 0) {
         displayLog(response.code, response.message);
      }
   };

   //Handle Influncer
   const handleChangeInfluncer = (value) => {
      // #1 -- Last 1 week
      // #0 -- This Week
      setInfluencerType(value);
   };

   //Handle canvas
   const handleChangeCanvas = (value) => {
      // #1 -- Last 1 week
      // #0 -- This Week
      setCanvasType(value);
   };
   //Handle Influncer
   const handleChangeMerchant = (value) => {
      // #1 -- Last 1 week
      // #0 -- This Week
      setMerchantType(value);
   };

   //This portion is influencerType
   if (influencerType == 1) {
      // influncerCount
      let lastWeekRecord = lastWeek;
      var influncerCount = lastWeekRecord[0]?.influncerCount[0]?.count;
   } else if (influencerType == 0) {
      // influncerCount
      let thisWeekRecord = thisWeek;
      var influncerCount = thisWeekRecord[0]?.influncerCount[0]?.count;
   }

   //This portion is merchantType
   if (merchantType == 1) {
      // merchantCount
      let lastWeekRecordMerchant = lastWeek;

      var merchantCount = lastWeekRecordMerchant[1]?.MerchantCount[0]?.count;
   } else if (merchantType == 0) {
      // MerchantCount
      let thisWeekRecordMerchant = thisWeek;
      var merchantCount = thisWeekRecordMerchant[1]?.MerchantCount[0]?.count;
   }
   // const CampaignCountData = () => {

   // };
   if (canvasType == 1) {
      //last Week count record
      console.log("222222222222222222");
      let lastWeekCampaignCount = lastWeek;

      let CampaignCount = lastWeekCampaignCount[2]?.CampaignCount[0]?.count;
      let acceptedCount =
         lastWeekCampaignCount[2]?.CampaignCount[0]?.acceptedCount;
      var total = (acceptedCount / CampaignCount) * 100;

      var roundValue = total ? total.toFixed(2) : 0;
      console.log("lastWeek---", roundValue);
      // setCanvasData(roundValue);
      // // Chart/Pie Props
      var canvas = {
         // labels: ["January", "February"],
         datasets: [
            {
               label: "Rainfall",

               backgroundColor: ["#445d8c", "#2d3f62"],
               hoverBackgroundColor: ["#445d8c", "#2d3f62"],
               data: [+roundValue, 100 - roundValue],
            },
         ],
      };
      // setCampaignCount(canvas);

      // setCanvasData(canvas);
   } else if (canvasType == 0) {
      //last Week count record
      let thisWeekCampaignCount = thisWeek;
      let CampaignCount = thisWeekCampaignCount[2]?.CampaignCount[0]?.count;
      let acceptedCount =
         thisWeekCampaignCount[2]?.CampaignCount[0]?.acceptedCount;
      var thisWeekTotal = (acceptedCount / CampaignCount) * 100;
      var thisWeekTotalRoundValue = thisWeekTotal
         ? thisWeekTotal.toFixed(2)
         : "0.00";
      // console.log("thisWeek", thisWeekTotalRoundValue);
      // // Chart/Pie Props
      var canvas = {
         // labels: ["January", "February"],
         datasets: [
            {
               label: "Rainfall",
               backgroundColor: ["#445d8c", "#2d3f62"],
               hoverBackgroundColor: ["#445d8c", "#2d3f62"],
               data: [thisWeekTotalRoundValue, 100 - thisWeekTotalRoundValue],
            },
         ],
      };
   }
   // console.log("campaginCount", campaginCount);

   return (
      <div>
         <Header />
         <section className="dashboard">
            <div className="container">
               <h1>Dashboard</h1>
               <div className="row col-row dashboardRow pb-4">
                  <div className="col-md-4 col-div-4">
                     <div className="colBg text-center">
                        <div className="customSelect">
                           <Select
                              value={influencerType}
                              onChange={handleChangeInfluncer}
                           >
                              <Option value={1}>Last 1 week</Option>
                              <Option value={0}>This week</Option>
                           </Select>
                        </div>

                        <span className="newUser">
                           +{influncerCount ? influncerCount : "0"}
                        </span>
                        <h3>
                           New created <strong>Influencer </strong> accounts
                        </h3>
                        <h4>{totalInfluncers ? totalInfluncers : ""}</h4>
                        <h5>Total Influencers</h5>
                     </div>
                  </div>
                  <div className="col-md-4 col-div-4">
                     <div className="colBg text-center">
                        <div className="customSelect">
                           <Select
                              value={canvasType}
                              onChange={handleChangeCanvas}
                           >
                              <Option value={1}>Last 1 week</Option>
                              <Option value={0}>This week</Option>
                           </Select>
                        </div>
                        <div className="dashboardChart">
                           <Pie data={canvas} />
                        </div>
                        {/* <span className="">
                  <img src="images/graph.png" alt="" className="img-fluid" />{" "}
                </span> */}
                        <h3>
                           <strong>
                              {canvasType == 1
                                 ? roundValue
                                 : thisWeekTotalRoundValue}
                              %
                           </strong>{" "}
                           campaigns <br />
                           are on going live
                        </h3>
                        <h4>{totalCampaign ? totalCampaign : ""}</h4>
                        <h5>Total Campaigns</h5>
                     </div>
                  </div>
                  <div className="col-md-4 col-div-4">
                     <div className="colBg text-center">
                        <div className="customSelect">
                           <Select
                              value={merchantType}
                              onChange={handleChangeMerchant}
                           >
                              <Option value={1}>Last 1 week</Option>
                              <Option value={0}>This week</Option>
                           </Select>
                        </div>
                        <span className="newUser">
                           +{merchantCount ? merchantCount : "0"}
                        </span>
                        <h3>
                           New created <strong>merchant</strong> accounts
                        </h3>
                        <h4>{totalMerchant ? totalMerchant : ""}</h4>
                        <h5>Total Merchants</h5>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </div>
   );
}

export default Dashboard;
