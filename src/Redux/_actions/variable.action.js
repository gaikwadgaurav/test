import {
  FETCH_VARIABLE_LIST_FAILED,
  FETCH_VARIABLE_LIST_BEGIN,
  FETCH_VARIABLE_LIST_SUCCESS,
  ADD_VARIABLE_BEGIN,
  ADD_VARIABLE_SUCCESS,
  ADD_VARIABLE_FAILED,
  UPDATE_VARIABLE_BEGIN,
  UPDATE_VARIABLE_SUCCESS,
  UPDATE_VARIABLE_FAILED,
  DELETE_VARIABLE_BEGIN,
  DELETE_VARIABLE_SUCCESS,
  DELETE_VARIABLE_FAILED,
  CLEAR_MESSAGE,
} from "../_constants";
import { axiosRequest } from "../_requests";

export const fetchVariables = (headers, params, body) => async dispatch => {
  if (headers) {
    dispatch({ type: FETCH_VARIABLE_LIST_BEGIN });
    try {
      const variableListResponse = await axiosRequest(
        "GET",
        "variables",
        headers,
        params,
        body,
        undefined,
        dispatch,
      );
      if (variableListResponse.status === 200) {
        dispatch({
          type: FETCH_VARIABLE_LIST_SUCCESS,
          data: {
            variableList: variableListResponse.data,
            messages: variableListResponse.messages,
          },
        });
      } else {
        dispatch({
          type: FETCH_VARIABLE_LIST_FAILED,
          data: variableListResponse.data,
        });
      }
    } catch (error) {
      dispatch({
        type: FETCH_VARIABLE_LIST_FAILED,
        data: error.messages,
      });
    }
  }
};

export const addVariable = (headers, params, body) => async dispatch => {
  if (headers) {
    dispatch({ type: ADD_VARIABLE_BEGIN });
    try {
      const addVariableResponse = await axiosRequest(
        "POST",
        "variables",
        headers,
        params,
        body,
        undefined,
        dispatch,
      );
      if (addVariableResponse.status === 200) {
        dispatch({
          type: ADD_VARIABLE_SUCCESS,
          data: {
            variable: addVariableResponse.data,
            messages: addVariableResponse.message,
          },
        });
      } else {
        dispatch({
          type: ADD_VARIABLE_FAILED,
          data: addVariableResponse.data,
        });
      }
    } catch (error) {
      dispatch({
        type: ADD_VARIABLE_FAILED,
        data: error.messages,
      });
    }
  }
};

export const updateVariable = (
  headers,
  variableId,
  params,
  body,
) => async dispatch => {
  if (headers) {
    dispatch({ type: UPDATE_VARIABLE_BEGIN });
    try {
      const updateVariableResponse = await axiosRequest(
        "PATCH",
        "variables/" + variableId + "",
        headers,
        params,
        body,
        undefined,
        dispatch,
      );
      if (updateVariableResponse.status === 200) {
        dispatch({
          type: UPDATE_VARIABLE_SUCCESS,
          data: {
            updatedVariable: updateVariableResponse.data,
            messages: updateVariableResponse.message,
            variableId,
          },
        });
      } else {
        dispatch({
          type: UPDATE_VARIABLE_FAILED,
          data: updateVariableResponse.data,
        });
      }
    } catch (error) {
      dispatch({
        type: UPDATE_VARIABLE_FAILED,
        data: error.messages,
      });
    }
  }
};

export const deleteVariable = (
  headers,
  variableIds,
  params,
  body,
) => async dispatch => {
  if (headers) {
    dispatch({ type: DELETE_VARIABLE_BEGIN });
    try {
      const deleteVariableResponse = await axiosRequest(
        "DELETE",
        "variables",
        headers,
        params,
        body,
        "formData",
        dispatch,
      );
      if (deleteVariableResponse.status === 200) {
        dispatch({
          type: DELETE_VARIABLE_SUCCESS,
          data: {
            messages: deleteVariableResponse.message,
            variableIds,
          },
        });
      } else {
        dispatch({
          type: DELETE_VARIABLE_FAILED,
          data: deleteVariableResponse.data,
        });
      }
    } catch (error) {
      dispatch({
        type: DELETE_VARIABLE_FAILED,
        data: error.messages,
      });
    }
  }
};

export const clearMsgForVariable = () => dispatch => {
  dispatch({
    type: CLEAR_MESSAGE,
  });
};
