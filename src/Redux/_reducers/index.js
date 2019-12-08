import { combineReducers } from "redux";
import userReducer from "./user.reducer";
import variableReducer from "./variable.reducer";

export default combineReducers({
  userData: userReducer,
  variables: variableReducer,
});
