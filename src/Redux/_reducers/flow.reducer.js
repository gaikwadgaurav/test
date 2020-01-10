import {
  SUCCESS,
  FAILED,
  PENDING,
  DELETE_SUCCESS,
  FETCH_RETENTION_FLOW_LIST_BEGIN,
  FETCH_RETENTION_FLOW_LIST_SUCCESS,
  FETCH_RETENTION_FLOW_LIST_FAILED,
  ADD_RETENTION_FLOW_BEGIN,
  ADD_RETENTION_FLOW_SUCCESS,
  ADD_RETENTION_FLOW_FAILED,
  FILTER_RETENTION_FLOW_LIST,
  CLEAR_FLOW_STATE_MESSAGE,
  UPDATE_RETENTION_FLOW_SUCCESS,
  UPDATE_RETENTION_FLOW_FAILED,
  UPDATE_RETENTION_FLOW_BEGIN,
  DELETE_RETENTION_FLOW_BEGIN,
  DELETE_RETENTION_FLOW_SUCCESS,
  DELETE_RETENTION_FLOW_FAILED,
  SET_SELECTED_FLOW,
  UPDATE_RETENTION_FLOW_STEP_BEGIN,
  UPDATE_RETENTION_FLOW_STEP_SUCCESS,
  UPDATE_RETENTION_FLOW_STEP_FAILED
} from "../_constants";

const initialState = {
  status: "",
  flowList: [],
  flowListClone: [],
  selectedFlow: {},
  errorMessage: "",
  successMessage: ""
};

export default (state = initialState, action) => {
  let flowList;
  switch (action.type) {
    case FETCH_RETENTION_FLOW_LIST_BEGIN:
      return {
        ...state,
        status: PENDING,
        errorMessage: "",
        successMessage: ""
      };

    case FETCH_RETENTION_FLOW_LIST_SUCCESS:
      return {
        ...state,
        status: SUCCESS,
        flowList: action.data.flowList,
        flowListClone: action.data.flowList,
        errorMessage: "",
        successMessage: ""
      };

    case FETCH_RETENTION_FLOW_LIST_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        successMessage: ""
      };

    case SET_SELECTED_FLOW:
      return {
        ...state,
        status: SUCCESS,
        selectedFlow: action.data,
        errorMessage: "",
        successMessage: ""
      };

    case FILTER_RETENTION_FLOW_LIST:
      const searchValue = action.data;
      let updatedFlowList = state.flowListClone;
      if (searchValue) {
        updatedFlowList = updatedFlowList.filter(flow => {
          return (
            flow &&
            flow.name &&
            flow.name.toLowerCase().search(searchValue.toLowerCase()) !== -1
          );
        });
      } else {
        updatedFlowList = state.flowListClone;
      }
      return {
        ...state,
        status: SUCCESS,
        flowList: updatedFlowList
      };

    case ADD_RETENTION_FLOW_BEGIN:
      return {
        ...state,
        status: PENDING,
        errorMessage: "",
        successMessage: ""
      };

    case ADD_RETENTION_FLOW_SUCCESS:
      flowList = state.flowList;
      flowList.push(action.data.flow);
      return {
        ...state,
        status: "ADD_FLOW_SUCCESS",
        flowList: flowList,
        flowListClone: flowList,
        selectedFlow: action.data.flow,
        errorMessage: "",
        successMessage: action.data.messages
      };

    case ADD_RETENTION_FLOW_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        successMessage: ""
      };

    case UPDATE_RETENTION_FLOW_BEGIN:
      return {
        ...state,
        status: PENDING,
        errorMessage: "",
        successMessage: ""
      };

    case UPDATE_RETENTION_FLOW_SUCCESS:
      flowList = state.flowList;
      const flowIndex = flowList.findIndex(
        flow => flow.id === parseInt(action.data.flowId)
      );
      if (flowIndex > -1) {
        flowList[flowIndex] = action.data.flow;
      }
      return {
        ...state,
        status: SUCCESS,
        flowList: flowList,
        flowListClone: flowList,
        errorMessage: "",
        successMessage: action.data.messages
      };

    case UPDATE_RETENTION_FLOW_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        successMessage: ""
      };

    case UPDATE_RETENTION_FLOW_STEP_BEGIN:
      return {
        ...state,
        status: PENDING,
        errorMessage: "",
        successMessage: ""
      };

    case UPDATE_RETENTION_FLOW_STEP_SUCCESS:
      const stepIndex = action.data.stepIndex;
      let selectedFlow = state.selectedFlow;
      if (stepIndex > -1) {
        selectedFlow.steps[stepIndex] = action.data.flowStep;
      }
      return {
        ...state,
        status: SUCCESS,
        selectedFlow,
        errorMessage: "",
        successMessage: action.data.messages
      };

    case UPDATE_RETENTION_FLOW_STEP_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        successMessage: ""
      };

    case DELETE_RETENTION_FLOW_BEGIN:
      return {
        ...state,
        status: PENDING,
        errorMessage: "",
        successMessage: ""
      };

    case DELETE_RETENTION_FLOW_SUCCESS:
      flowList = state.flowList;
      flowList.slice(0);
      const selectedFlows = action.data.flowIds;
      if (selectedFlows.length) {
        selectedFlows.map(selectedFlow => {
          const flowIndex = flowList.findIndex(flow => {
            return flow.id === selectedFlow;
          });
          if (flowIndex > -1) {
            return flowList.splice(flowIndex, 1);
          }
        });
      }
      return {
        ...state,
        status: DELETE_SUCCESS,
        flowList: flowList,
        flowListClone: flowList,
        errorMessage: "",
        successMessage: action.data.messages
      };

    case DELETE_RETENTION_FLOW_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        successMessage: ""
      };

    case CLEAR_FLOW_STATE_MESSAGE:
      return {
        ...state,
        status: "",
        errorMessage: "",
        successMessage: ""
      };

    default:
      return state;
  }
};
