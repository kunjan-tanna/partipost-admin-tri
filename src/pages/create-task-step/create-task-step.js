import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import TaskStep from "../../components/create-task-step/taskStep";
import StepTwo from "../../components/create-task-step/step2";
import "antd/dist/antd.css";
import { Tabs } from "antd";
import { connect, useDispatch } from "react-redux";

const { TabPane } = Tabs;

function CreateTask(props) {
  // console.log("propss", props);

  const [taskList, setTaskList] = useState(props && props.taskList);
  const [taskData, setTaskData] = useState([]);
  const [taskButton, setTaskButton] = useState(1);

  const campaignId = props && props.location?.state.campaign_id;
  const taskId = props && props.location?.state.task_id;
  // const taskLabel = props && props.location?.state.taskLabel;
  // console.log("campaignId", campaignId);
  useEffect(() => {
    // console.log("GGGsteooo", taskData);
    taskId &&
      taskId.map((id) => {
        taskList.map((item, index) => {
          if (item.task_id == id) {
            // console.log("hello");
            let arr = taskData;
            arr.push({
              ...item,
              task_id: item.task_id,
              task_name: item.task_name,
            });
            return setTaskList(arr);
          }
        });
      });
  }, []);

  // console.log("GGGsteooo----", taskList);
  function callback(data) {
    // console.log("data", data);
    // for (data = 0; data < taskList.length; data++) {
    //   console.log("hello", data);
    // }
  }
  const handleItem = (info) => {
    // console.log("ggg", info);
  };
  // console.log("jjj", taskButton);
  return (
    <div>
      <Header />
      <section className="createTask">
        <div className="container">
          <ul className="d-flex breadcrumbTop">
            <li>
              <NavLink to={Routes.MERCHANTSLIST}> Merchant </NavLink>
            </li>
            <li>
              <NavLink to={Routes.MERCHANTSCAMPAIGNS}> Campaigns </NavLink>
            </li>
            <li>
              <NavLink to={`/create-task?campaign_id=${campaignId}`}>
                {" "}
                Choose Tasks
              </NavLink>
            </li>
            <li className="active">Create Task</li>
          </ul>
          <div className="colBg createTaskContent">
            <Tabs
              defaultActiveKey="1"
              onChange={callback}
              // activeKey={activeTabKey}
              className="custom-tabs"
            >
              {taskList && taskList.length > 0
                ? taskList.map((item, index) => (
                    <TabPane tab={item.task_name} key={item.task_id}>
                      <TaskStep
                        taskName={item.task_name}
                        taskId={item.task_id}
                        taskArray={taskId}
                        campaignId={campaignId}
                        // handlItem={this.handleItem}
                      />
                    </TabPane>
                  ))
                : ""}

              {/* <TabPane tab="Step 1" key="1">
                <Instagram />;
              </TabPane> */}
              {/* <TabPane tab="Step 2" key="2">
                <StepTwo />
              </TabPane> */}
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    taskList: state.dataReducer.taskList,
  };
};
export default connect(mapStateToProps)(CreateTask);
