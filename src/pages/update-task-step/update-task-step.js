import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import UpdateTaskStep from "../../components/update-task-step/UpdatetaskStep";
import TaskStep from "../../components/create-task-step/taskStep";

import "antd/dist/antd.css";
import { Tabs } from "antd";
import { connect, useDispatch } from "react-redux";
import { apiCall } from "../../utils/common";
import { displayLog } from "../../utils/functions";

const { TabPane } = Tabs;

function UpdateTask(props) {
  // console.log("propss", props);

  const [taskList, setTaskList] = useState(props && props.taskList);
  const [taskData, setTaskData] = useState([]);
  const [existingTaskData, setExistingTaskData] = useState([]);
  const [taskButton, setTaskButton] = useState(1);
  const [tabDisable, setTabDisable] = useState(false);

  const campaignId = props && props.location?.state.campaign_id;
  var taskId = props && props.location?.state.task_id;
  const taskDetails = props && props.location?.state.taskDetails;
  const updateTaskId = props && props.location?.state.update_task_id;
  const acceptPosting = props && props.location?.state.accept_posting;
  var taskData1 = [];
  // console.log("TASSS", taskDetails);
  useEffect(async () => {
    // console.log("TASKKDE", taskId);
    // console.log("taskDetails-----", taskDetails);

    // getCampaignTaskDetail();
    let arr = [];

    taskId &&
      taskId.map((task, i) => {
        // taskList.map((item, index) => {
        // console.log("task-----", task);
        //   if (item.task_id == id) {
        //     console.log("ITEM-------", item);
        taskData1.push({
          task_id: task.task_id,
          task_name: task.task_name,
          itemData: [],
          // itemData:task[0]
        });
        // taskData1[i].itemData = [];
        taskDetails.map((task_item, index) => {
          // console.log("task_item---", task_item);
          if (task_item[0] && task_item[0].task_id == task.task_id) {
            // console.log(
            //   "task_item-------",
            //   task_item[0].task_id,
            //   "Taskkkk",
            //   task.task_id
            // );
            // console.log("MATCHED");

            // taskId[i].itemData = [];
            taskData1[i].itemData.push(task_item[0]);
            // taskData1[i].itemData.push(task_item[0]);

            // taskId[i]["itemData"] = task_item[0];
            // taskId[i].itemData = "hello ";

            // console.log("taskID-----", taskId);
            // console.log("taskData1-----", taskData1);
            setTaskData(taskData1);
            // localStorage.setItem("item", JSON.stringify(taskId));

            //    if (arr.length > 0) {
            //   arr.map((ar) => {
            //     console.log("ar-------", ar);
            //     if (ar[0] && ar[0].task_id) {
            //       console.log("ALready in array");
            //     } else {
            //       arr.push({
            //         ...task_item,
            //         task_id: item.task_id,
            //         task_name: item.task_name,
            //       });
            //     }
            //   });
            // } else {
            //   arr.push({
            //     ...task_item,
            //     task_id: item.task_id,
            //     task_name: item.task_name,
            //   });
            // }
          } else {
            console.log("NOT MATCHED");
          }
        });
      });
  }, []);

  function callback(data) {
    if (updateTaskId && updateTaskId[updateTaskId.length - 1] == +data) {
      console.log("NOTCLICK");

      setTabDisable(false);
    } else {
      console.log("CLICK");
      setTabDisable(true);
    }

    // for (data = 0; data < taskList.length; data++) {
    //   console.log("hello", data);
    // }
  }
  const handleItem = (info) => {
    // console.log("ggg", info);
  };
  // console.log("existingTaskData", taskId);

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
              <NavLink to={Routes.UPDATECAMPAIGN}> Update Campaign </NavLink>
            </li>
            {/* <li>
              <NavLink to={Routes.CREATETASK}> Create Task </NavLink>
            </li> */}
            {/* <li>Instagram</li> */}
          </ul>
          <div className="colBg createTaskContent">
            <Tabs
              defaultActiveKey="1"
              onChange={callback}
              // activeKey={activeTabKey}
              className="custom-tabs"
            >
              {/* {console.log("TASKIIIDD--", taskData)} */}
              {taskData && taskData.length > 0
                ? taskData.map((item, index) => (
                    // console.log("item---", item.itemData),
                    <TabPane
                      tab={item.task_name}
                      key={item.task_id}
                      // disabled={tabDisable}
                    >
                      <UpdateTaskStep
                        taskName={item.task_name}
                        taskId={item.task_id}
                        taskArray={updateTaskId}
                        campaignId={campaignId}
                        taskData={item.itemData[0]}
                        existingData={taskDetails}
                        acceptPosting={acceptPosting}

                        // handlItem={this.handleItem}
                      />
                    </TabPane>
                  ))
                : taskId.map((item, index) => (
                    <TabPane tab={item.task_name} key={item.task_id}>
                      <TaskStep
                        taskName={item.task_name}
                        taskId={item.task_id}
                        taskArray={updateTaskId}
                        campaignId={campaignId}
                        taskData={taskData}
                        acceptPosting={acceptPosting}
                        // handlItem={this.handleItem}
                      />
                    </TabPane>
                  ))}

              {/* {taskData && taskData.length > 0
                ? taskData.map(
                    (item, index) => (
                      console.log("item---", item.itemData),
                      (
                        <TabPane tab={item.task_name} key={item.task_id}>
                          <UpdateTaskStep
                            taskName={item.task_name}
                            taskId={item.task_id}
                            taskArray={updateTaskId}
                            campaignId={campaignId}
                            taskData={item.itemData[0]}
                            // handlItem={this.handleItem}
                          />
                        </TabPane>
                      )
                    )
                  )
                :taskId.map(
                  (item, index) => (
                    console.log("item---", item),
                    (
                      <TabPane tab={item.task_name} key={item.task_id}>
                        <TaskStep
                        taskName={item.task_name}
                        taskId={item.task_id}
                        taskArray={taskId}
                        campaignId={campaignId}
                        // handlItem={this.handleItem}
                      />
                      </TabPane>
                    )
                  )
                ) } */}

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
export default connect(mapStateToProps)(UpdateTask);
