import React, { Component, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Routes from "../../Routes/Routes";
import { NavLink, useHistory } from "react-router-dom";
import Header from "../../components/header/header";
import "antd/dist/antd.css";
import * as campaignAction from "../../redux/actions/Campaign/index";
import { connect, useDispatch } from "react-redux";
import { displayLog } from "../../utils/functions";

import { Checkbox, Divider } from "antd";
import TaskStep from "../../components/create-task-step/taskStep";
import StepTwo from "../../components/create-task-step/step2";

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

function CreatTask(props) {
  let search = props && props.location?.search;
  let campaignId = search.split("=")[1];
  // console.log("EVVV", props);
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [taskID, setTaskID] = useState(defaultCheckedList);
  const [showButton, setShowButton] = useState(true);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(campaignAction.getTaskList()).then((response) => {
      // console.log("RESSSS", response);
      if (response.data.code == 1) {
        // displayLog(response.data.code, response.data.message);
        setTaskList(response.data.data);
      } else if (response.data.code == 0) {
        displayLog(response.data.code, response.data.message);
      }
    });
  }, []);

  const options1 = taskList.map((item) => {
    // return { label: "Instagram", value: 1 };
    return { label: item.task_name, value: item.task_id };
  });

  const onChange = (list) => {
    // console.log("GGG", list.length);
    if (list.length == 0) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }

    setTaskID(list);

    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < options1.length);
    setCheckAll(list.length === options1.length);
  };

  const onCheckAllChange = (e) => {
    const selectedOption = options1.map((item, index) => {
      return item.value;
    });
    // console.log("gggg", e.target.checked);
    if (e.target.checked == true) {
      setShowButton(false);
    } else {
      setShowButton(true);
    }

    setCheckedList(e.target.checked ? selectedOption : []);
    setIndeterminate(false);
    setTaskID(selectedOption);
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
    // console.log("taskID", taskID);

    history.push({
      pathname: Routes.CREATTASKSTEP,
      state: {
        campaign_id: campaignId,
        task_id: taskID,
        // taskLabel: taskLabel,
      },
    });
  };

  // console.log("gggg", options);
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
                    {localStorage.getItem("merchant_name")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to={Routes.MERCHANTSCAMPAIGNS}>Campaigns</NavLink>
                </li>
                <li className="active">Choose Tasks</li>
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
export default connect(mapStateToProps)(CreatTask);
