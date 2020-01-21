import {
  ADD_RETENTION_FLOW_BEGIN,
  ADD_RETENTION_FLOW_SUCCESS,
  ADD_RETENTION_FLOW_FAILED,
  CLEAR_FLOW_STATE_MESSAGE,
  FETCH_RETENTION_FLOW_LIST_BEGIN,
  FETCH_RETENTION_FLOW_LIST_FAILED,
  FETCH_RETENTION_FLOW_LIST_SUCCESS,
  UPDATE_RETENTION_FLOW_BEGIN,
  UPDATE_RETENTION_FLOW_FAILED,
  UPDATE_RETENTION_FLOW_SUCCESS,
  DELETE_RETENTION_FLOW_FAILED,
  DELETE_RETENTION_FLOW_SUCCESS,
  DELETE_RETENTION_FLOW_BEGIN,
  FILTER_RETENTION_FLOW_LIST,
  SET_SELECTED_FLOW,
  UPDATE_RETENTION_FLOW_STEP_FAILED,
  UPDATE_RETENTION_FLOW_STEP_SUCCESS,
  UPDATE_RETENTION_FLOW_STEP_BEGIN
} from "../_constants";
import { axiosRequest } from "../_requests";

export const addFlow = (headers, params, body) => async dispatch => {
  dispatch({ type: ADD_RETENTION_FLOW_BEGIN });
  if (headers) {
    try {
      const addFlowResponse = await axiosRequest(
        "POST",
        "flows",
        false,
        undefined,
        body,
        undefined,
        dispatch
      );
      if (addFlowResponse.status === 200) {
        dispatch({
          type: ADD_RETENTION_FLOW_SUCCESS,
          data: {
            flow: addFlowResponse.data,
            messages: addFlowResponse.messages
          }
        });
      } else {
        dispatch({
          type: ADD_RETENTION_FLOW_FAILED,
          data: addFlowResponse.data
        });
      }
    } catch (error) {
      dispatch({
        type: ADD_RETENTION_FLOW_FAILED,
        data: error.messages
      });
    }
  }
};

export const updateFlow = (headers, flowId, params, body) => async dispatch => {
  dispatch({ type: UPDATE_RETENTION_FLOW_BEGIN });
  if (headers) {
    try {
      const updateFlowResponse = await axiosRequest(
        "PATCH",
        "flows/" + flowId + "",
        true,
        undefined,
        body,
        undefined,
        dispatch
      );
      if (updateFlowResponse.status === 200) {
        dispatch({
          type: UPDATE_RETENTION_FLOW_SUCCESS,
          data: {
            flow: updateFlowResponse.data,
            messages: updateFlowResponse.message,
            flowId
          }
        });
      } else {
        dispatch({
          type: UPDATE_RETENTION_FLOW_FAILED,
          data: updateFlowResponse.data
        });
      }
    } catch (error) {
      dispatch({
        type: UPDATE_RETENTION_FLOW_FAILED,
        data: error.messages
      });
    }
  }
};

export const updateFlowStep = (
  headers,
  stepId,
  stepIndex,
  reasonIndex = null,
  params,
  body
) => async dispatch => {
  dispatch({ type: UPDATE_RETENTION_FLOW_STEP_BEGIN });
  if (headers) {
    try {
      const updateFlowStepResponse = await axiosRequest(
        "PATCH",
        "steps/" + stepId + "",
        true,
        params,
        body,
        undefined,
        dispatch
      );
      if (updateFlowStepResponse.status === 200) {
        dispatch({
          type: UPDATE_RETENTION_FLOW_STEP_SUCCESS,
          data: {
            flowStep: updateFlowStepResponse.data,
            messages: updateFlowStepResponse.messages,
            stepIndex,
            reasonIndex
          }
        });
      } else {
        dispatch({
          type: UPDATE_RETENTION_FLOW_STEP_FAILED,
          data: updateFlowStepResponse.data
        });
      }
    } catch (error) {
      dispatch({
        type: UPDATE_RETENTION_FLOW_STEP_FAILED,
        data: error.messages
      });
    }
  }
};

// export const updateFlowStepReason = (
//   headers,
//   stepId,
//   stepIndex,
//   reasonIndex,
//   params,
//   body
// ) => async dispatch => {
//   dispatch({ type: UPDATE_RETENTION_FLOW_STEP_REASON_BEGIN });
//   if (headers) {
//     try {
//       const updateFlowStepResponse = await axiosRequest(
//         "PATCH",
//         "steps/" + stepId + "",
//         true,
//         params,
//         body,
//         undefined,
//         dispatch
//       );
//       if (updateFlowStepResponse.status === 200) {
//         dispatch({
//           type: UPDATE_RETENTION_FLOW_STEP_SUCCESS,
//           data: {
//             flowStep: updateFlowStepResponse.data,
//             messages: updateFlowStepResponse.messages,
//             stepIndex
//           }
//         });
//       } else {
//         dispatch({
//           type: UPDATE_RETENTION_FLOW_STEP_FAILED,
//           data: updateFlowStepResponse.data
//         });
//       }
//     } catch (error) {
//       dispatch({
//         type: UPDATE_RETENTION_FLOW_STEP_FAILED,
//         data: error.messages
//       });
//     }
//   }
// };

export const deleteFlow = (
  headers,
  flowIds,
  params,
  body
) => async dispatch => {
  dispatch({ type: DELETE_RETENTION_FLOW_BEGIN });
  if (headers) {
    try {
      const deleteFlowResponse = await axiosRequest(
        "DELETE",
        "flows",
        false,
        undefined,
        body,
        undefined,
        dispatch
      );
      if (deleteFlowResponse.status === 200) {
        dispatch({
          type: DELETE_RETENTION_FLOW_SUCCESS,
          data: {
            messages: deleteFlowResponse.message,
            flowIds
          }
        });
      } else {
        dispatch({
          type: DELETE_RETENTION_FLOW_FAILED,
          data: deleteFlowResponse.data
        });
      }
    } catch (error) {
      dispatch({
        type: DELETE_RETENTION_FLOW_FAILED,
        data: error.messages
      });
    }
  }
};

export const fetchFlowList = (headers, params, body) => async dispatch => {
  dispatch({ type: FETCH_RETENTION_FLOW_LIST_BEGIN });
  if (headers) {
    try {
      const fetchFlowResponse = await axiosRequest(
        "GET",
        "flows",
        false,
        undefined,
        body,
        undefined,
        dispatch
      );
      if (fetchFlowResponse.status === 200) {
        dispatch({
          type: FETCH_RETENTION_FLOW_LIST_SUCCESS,
          data: {
            flowList: fetchFlowResponse.data
          }
        });
      } else {
        dispatch({
          type: FETCH_RETENTION_FLOW_LIST_FAILED,
          data: fetchFlowResponse.data
        });
      }
    } catch (error) {
      dispatch({
        type: FETCH_RETENTION_FLOW_LIST_FAILED,
        data: error.messages
      });
    }
  }
};

export const filterRetentionFlowList = value => dispatch => {
  dispatch({
    type: FILTER_RETENTION_FLOW_LIST,
    data: value
  });
};

export const clearFlowStateMsg = () => dispatch => {
  dispatch({
    type: CLEAR_FLOW_STATE_MESSAGE
  });
};

export const setSelectedFlow = flow => dispatch => {
  dispatch({
    type: SET_SELECTED_FLOW,
    data: flow
  });
};
