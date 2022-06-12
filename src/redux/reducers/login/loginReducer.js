export const initialState = {
  accessToken: "",
  role: null,
};

//To Store the Actions
const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_DATA":
      return Object.assign({}, state, {
        accessToken: action.payload.accessToken,
        role: action.payload.role,
      });

    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};
export default loginReducer;
