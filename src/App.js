import React, { useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "alertifyjs/build/css/alertify.css";
import { connect } from "react-redux";

import Routes from "./Routes/Routes";
import Dashboard from "./pages/dashboard/dashboard";
import sList from "./pages/merchantslist/merchantslist";
import MerchantsCampaigns from "./pages/merchant-campaigns/merchant-campaigns";
import MerchantsList from "./pages/merchantslist/merchantslist";
import Campaign from "./pages/campaign/campaign";
import Taskview from "./pages/taskview/taskview";
import InfluencerView from "./pages/influencer-view/influencer-view";
import Influencer from "./pages/influencer/influencer";
import influencerProfile from "./pages/influencer-profile/influencer-profile";
import CampaignView from "./pages/campaign-view/campaign-view";
import CreatTask from "./pages/create-task/create-task";
import UpdateTask from "./pages/update-task/update-task";
import CreatCampaign from "./pages/create-campaign/create-campaign";
import UpdateCampaign from "./pages/update-campaign/update-campaign";
import CreatTaskStep from "./pages/create-task-step/create-task-step";
import UpdateTaskStep from "./pages/update-task-step/update-task-step";
import SignIn from "./pages/signin/signin";
import SignUp from "./pages/signup/signup";
import MerchantProfile from "./pages/merchant-profile/merchant-profile";
import ViewMerchantProfile from "./pages/merchant-profile/view-merchant-profile";
import ForgotPassword from "./pages/forgotPass.js/forgotPass";
import ResetPassword from "./pages/resetPassword/resetPassoword";
import NotificationList from "./pages/notification-list/notification-list";
import Setting from "./pages/setting/setting";

function App(props) {
  // .catch((err) => console.log("failed: ", err));
  return (
    <BrowserRouter>
      {props && props.accessToken !== "" ? (
        <>
          {/* Passing thr Role 
        1 - SUPER ADMIN
        2 - MERCHANT 
       */}
          <div>
            {props && props.role == 1 ? (
              <>
                <Switch>
                  <Route exact path={Routes.DASHBOARD} component={Dashboard} />
                  <Route
                    exact
                    path={Routes.MERCHANTSLIST}
                    component={MerchantsList}
                  />
                  <Route
                    exact
                    path={Routes.VIEWMERCHANTPROFILE}
                    component={ViewMerchantProfile}
                  />
                  <Route
                    exact
                    path={Routes.MERCHANTSCAMPAIGNS}
                    component={MerchantsCampaigns}
                  />
                  <Route exact path={Routes.CAMPAIGN} component={Campaign} />
                  <Route exact path={Routes.TASKVIEW} component={Taskview} />

                  <Route
                    exact
                    path={Routes.INFLUENCERVIEW}
                    component={InfluencerView}
                  />
                  <Route
                    exact
                    path={Routes.INFLUENCER}
                    component={Influencer}
                  />
                  <Route
                    exact
                    path={Routes.INFLUENCERPROFILE}
                    component={influencerProfile}
                  />
                  <Route
                    exact
                    path={Routes.CAMPAIGNVIEW}
                    component={CampaignView}
                  />
                  <Route exact path={Routes.CREATETASK} component={CreatTask} />
                  <Route
                    exact
                    path={Routes.UPDATETASK}
                    component={UpdateTask}
                  />
                  <Route
                    exact
                    path={Routes.CREATCAMPAIGN}
                    component={CreatCampaign}
                  />
                  <Route
                    exact
                    path={Routes.UPDATECAMPAIGN}
                    component={UpdateCampaign}
                  />
                  <Route
                    exact
                    path={Routes.CREATTASKSTEP}
                    component={CreatTaskStep}
                  />
                  <Route
                    exact
                    path={Routes.NOTIFICATIONLIST}
                    component={NotificationList}
                  />
                  <Route
                    exact
                    path={Routes.UPDATETASKSTEP}
                    component={UpdateTaskStep}
                  />
                  <Route exact path={Routes.SETTING} component={Setting} />
                  <Redirect to={Routes.DASHBOARD} />
                </Switch>
              </>
            ) : // localStorage.clear()
            null}
            {props && props.role == 2 ? (
              <>
                <Switch>
                  <Route
                    exact
                    path={Routes.MERCHANTPROFILE}
                    component={MerchantProfile}
                  />
                  {/* <Route
                    exact
                    path={Routes.MERCHANTSLIST}
                    component={MerchantsList}
                  /> */}
                  {/* Merchant show the list of own campaigview */}
                  <Route
                    exact
                    path={Routes.MERCHANTSCAMPAIGNS}
                    component={MerchantsCampaigns}
                  />
                  <Route exact path={Routes.CAMPAIGN} component={Campaign} />
                  <Route exact path={Routes.TASKVIEW} component={Taskview} />
                  <Route exact path={Routes.TASKVIEW} component={Taskview} />
                  <Route
                    exact
                    path={Routes.INFLUENCERVIEW}
                    component={InfluencerView}
                  />
                  <Route
                    exact
                    path={Routes.INFLUENCERPROFILE}
                    component={influencerProfile}
                  />
                  <Route
                    exact
                    path={Routes.CAMPAIGNVIEW}
                    component={CampaignView}
                  />
                  <Route exact path={Routes.CREATETASK} component={CreatTask} />
                  <Route
                    exact
                    path={Routes.UPDATETASK}
                    component={UpdateTask}
                  />
                  <Route
                    exact
                    path={Routes.NOTIFICATIONLIST}
                    component={NotificationList}
                  />

                  <Route
                    exact
                    path={Routes.CREATCAMPAIGN}
                    component={CreatCampaign}
                  />
                  <Route
                    exact
                    path={Routes.UPDATECAMPAIGN}
                    component={UpdateCampaign}
                  />
                  <Route
                    exact
                    path={Routes.CREATTASKSTEP}
                    component={CreatTaskStep}
                  />
                  <Route
                    exact
                    path={Routes.UPDATETASKSTEP}
                    component={UpdateTaskStep}
                  />
                  <Route exact path={Routes.SIGNIN} component={SignIn} />
                  <Redirect to={Routes.SIGNIN} />
                </Switch>
              </>
            ) : // localStorage.clear()
            null}
          </div>
        </>
      ) : (
        <Switch>
          <Route exact path={Routes.SIGNIN} component={SignIn} />
          <Route exact path={Routes.SIGNUP} component={SignUp} />
          <Route
            exact
            path={Routes.FORGOTPASSWORD}
            component={ForgotPassword}
          />
          <Route exact path={Routes.RESETPASSWORD} component={ResetPassword} />
          <Redirect to={Routes.SIGNIN} />
        </Switch>
      )}
    </BrowserRouter>
  );
}
const mapStateToProps = (state) => {
  return {
    accessToken: state.loginReducer.accessToken,
    role: state.loginReducer.role,
  };
};
export default connect(mapStateToProps)(App);
