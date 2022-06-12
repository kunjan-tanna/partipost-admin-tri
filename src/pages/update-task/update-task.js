import React, { Component, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import Header from "../../components/header/header";
import "antd/dist/antd.css";
import * as campaignAction from "../../redux/actions/Campaign/index";
import { connect, useDispatch } from "react-redux";
import { displayLog } from "../../utils/functions";

import { Checkbox, Divider } from "antd";
import TaskStep from "../../components/create-task-step/taskStep";
import StepTwo from "../../components/create-task-step/step2";
import { apiCall } from "../../utils/common";

const CheckboxGroup = Checkbox.Group;
const plainOptions = [
  "Instagram Post",
  "Facebook Post",
  "YouTube Post",
  "Twitter Post",
  "Tik Tok Posts",
];
// const defaultCheckedList = ["Instagram Post", "Facebook Post"];
const defaultCheckedList = [1];
const defaultTaskLabel = [{ taskLabel: "Instagram" }];

function UpdateTask(props) {
  let search = props && props.location?.search;
  let campaignId = search.split("=")[1];
  const { accept_posting } = useLocation().state;

  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [taskDetails, setTaskDetails] = useState([]);
  const [updatetaskID, setUpdateTaskID] = useState([]);

  const [taskID, setTaskID] = useState([]);
  const [showButton, setShowButton] = useState(true);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(async () => {
    dispatch(campaignAction.getTaskList()).then((response) => {
      // console.log("RESSSS", response);
      if (response.data.code == 1) {
        // displayLog(response.data.code, response.data.message);
        setTaskList(response.data.data);
      } else if (response.data.code == 0) {
        displayLog(response.data.code, response.data.message);
      }
    });
    getCampaignTaskDetail();
    // let req_data = {
    //   merchant_id: localStorage.getItem("merchant_id")
    //     ? +localStorage.getItem("merchant_id")
    //     : 1,
    //   campaign_id: campaignId,
    //   role: +localStorage.getItem("role"),
    // };
    // let response = await apiCall("POST", "getCampaignTaskName", req_data);
    // console.log("RESS-----", response);
    // if (response.code == 1) {
    //   let task = response.data.map((item) => item.task_id);

    //   setCheckedList(task);
    //   setTaskList(response.data);
    //   setShowButton(false);
    // } else if (response.code == 0) {
    //   displayLog(response.code, response.message);
    // }
  }, []);
  // console.log("hhh", taskList);
  const getCampaignTaskDetail = async () => {
    let taskIds = [];
    let req_data = {
      merchant_id: localStorage.getItem("merchant_id")
        ? +localStorage.getItem("merchant_id")
        : 1,
      campaign_id: campaignId,
      role: +localStorage.getItem("role"),
    };
    let response = await apiCall("POST", "getCampaignTaskName", req_data);
    // console.log("RESS-----getCamp", response);
    if (response.code == 1) {
      let task = response.data.map((item) => {
        // console.log("ITWEMMMMM", item);
        taskIds.push(item);
        return item.task_id;
      });
      // let task = response.data.map((item) => {
      //   if(item.task_id == )
      // });
      // console.log("TASSS", task);
      // displayLog(response.data.code, response.data.message);
      // setTaskList(response.data);
      setUpdateTaskID(task);
      setCheckedList(task);
      setShowButton(false);
      // setTaskDetails(response.data);
    } else if (response.code == 0) {
      displayLog(response.code, response.message);
    }
    setTaskID(taskIds);
  };
  const options1 = taskList.map((item) => {
    // return { label: "Instagram", value: 1 };
    return { label: item.task_name, value: item.task_id };
  });

  const onChange = (list) => {
    if (list.length == 0) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
    let tasks = [];

    taskList.map((task) => {
      if (list.includes(task.task_id)) {
        // console.log("task-------", task);
        // console.log("taskID---", taskID);
        tasks.push(task);
      }
    });

    setTaskID(tasks);
    setUpdateTaskID(list);
    // console.log("GGG", taskID);

    // setTaskID(list);
    // setShowButton(false);
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < options1.length);
    setCheckAll(list.length === options1.length);
  };

  const onCheckAllChange = (e) => {
    if (e.target.checked == true) {
      setShowButton(false);
    } else {
      setShowButton(true);
    }
    const selectedOption = options1.map((item, index) => {
      return item.value;
    });
    let tasks = [];

    taskList.map((task) => {
      // console.log(
      //   "list.includes(task.task_id)-----",
      //   selectedOption.includes(task.task_id)
      // );
      if (selectedOption.includes(task.task_id)) {
        // console.log("task-------", task);
        // console.log("taskID---", taskID);
        tasks.push(task);
      }
    });
    setTaskID(tasks);
    // setShowButton(false);
    setCheckedList(e.target.checked ? selectedOption : []);
    setIndeterminate(false);
    setUpdateTaskID(selectedOption);

    // setTaskID(selectedOption);
    setCheckAll(e.target.checked);
  };

  // const onCheckAllChange = (e) => {
  //   console.log(e.target.checked);
  //   setCheckedList(e.target.checked ? taskListName : []);
  //   // setTaskID(options1);
  //   // setTaskList(e.target.checked ? options1 : []);
  //   setIndeterminate(false);
  //   setCheckAll(e.target.checked);
  // };
  const handleSubmit = (data) => {
    setTaskDetails([]);
    // console.log("dddd", taskID);

    // console.log("00000000000000000000000000000");
    let taskArray = [];
    const mapLoop = async (_) => {
      // ...
      const promises = taskID.map(async (item, index) => {
        // console.log("taskID", item);
        let req_data = {
          merchant_id: localStorage.getItem("merchant_id")
            ? +localStorage.getItem("merchant_id")
            : 1,
          campaign_id: campaignId,
          task_id: item.task_id,
          role: +localStorage.getItem("role"),
        };
        // console.log("BODY---", req_data);
        let response = await apiCall("POST", "getCampaignTaskDetail", req_data);
        // console.log("RESPONSEE===", response);

        if (response.code == 1) {
          // if (response.data.legend > 0) {
          //   return response.data;
          // } else {
          //   return taskID;
          // }
          return response.data;
        } else if (response.code == 2) {
          displayLog(response.code, response.message);
        }
      });
      const taskArray = await Promise.all(promises);
      // console.log("TASKAEEAR", taskArray[0]);
      // const abc = taskArray.map((item) => {
      //   return item;
      // });
      // const finalData = abc.map((item) => {
      //   return item.task_id;
      // });
      // setUpdateTaskID(abc);
      // console.log("NUMMM", finalData);
      // console.log("TASKKK", taskArray);
      setTaskDetails(taskArray);

      history.push({
        pathname: Routes.UPDATETASKSTEP,
        state: {
          campaign_id: campaignId,
          task_id: taskID,
          taskDetails: taskArray,
          update_task_id: updatetaskID,
          // taskLabel: taskLabel,
          accept_posting: accept_posting,
        },
      });
      // ...
    };
    mapLoop();
  };

  // console.log("updatetaskID", updatetaskID);
  // console.log("option1", taskLabel);

  return (
    <div>
      <Header />
      <section className="merchantsList">
        <div className="container">
          <div className="row align-items-center breadcrumbOuter">
            <div className="col-md-12">
              <ul className="d-flex breadcrumbTop">
                <li>
                  <NavLink to={Routes.MERCHANTSLIST}>
                    {" "}
                    {localStorage.getItem("merchant_name")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to={Routes.MERCHANTSCAMPAIGNS}>Campaigns</NavLink>
                </li>
                <li className="active">Update Campaign</li>
              </ul>
            </div>
          </div>
          <div className="colBg colForm defaultForm chooseTaskForm">
            <h2>Choose Tasks</h2>
            <div className="selectTask">
              <CheckboxGroup
                options={options1}
                value={checkedList}
                onChange={(data) => onChange(data)}
              />
              <Checkbox
                className="checkAll"
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                Select All
              </Checkbox>{" "}
            </div>
            <div className="formBtn btnChooseTasks">
              {/* <NavLink to={Routes.CREATCAMPAIGN} class="btn btn-default-white">
                Back
              </NavLink> */}
              <button
                className="btn btn-default-blue"
                onClick={() => handleSubmit()}
                disabled={showButton}
              >
                Next
              </button>
              {/* <NavLink to={Routes.CREATTASKSTEP} class="btn btn-default-blue">
                Next
              </NavLink> */}
            </div>
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
