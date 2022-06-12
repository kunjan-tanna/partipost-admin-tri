import loginReducer from "./login/loginReducer";
import global from "./merchantData/dataReducer";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

// const persistConfig = {
//   key: "jwt",
//   storage,
//   whitelist: ["merchantLoginReducer"],
// };

const rootReducer = combineReducers({
  loginReducer: loginReducer,
  dataReducer: global,
});
export default rootReducer;
