import { combineReducers } from "redux";
import userReducer from "./user.reducer";
import variableReducer from "./variable.reducer";
import flowReducer from "./flow.reducer";

export default combineReducers({
  userData: userReducer,
  variables: variableReducer,
  flows: flowReducer,
});
