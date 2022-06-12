export const initialState = {
  viewData: [],
  taskList: [],
};

//To Store the Actions
const global = (state = initialState, action) => {
  switch (action.type) {
    case "MERCHANT_PROFILE":
      return Object.assign({}, state, { viewData: action.payload });
    case "TASK_LIST":
      return Object.assign({}, state, { taskList: action.payload });

    default:
      return state;
  }
};

export default global;
