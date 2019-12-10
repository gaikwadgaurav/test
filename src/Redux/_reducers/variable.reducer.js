import {
  SUCCESS,
  FAILED,
  PENDING,
  DELETE_SUCCESS,
  FETCH_VARIABLE_LIST_SUCCESS,
  FETCH_VARIABLE_LIST_BEGIN,
  FETCH_VARIABLE_LIST_FAILED,
  ADD_VARIABLE_BEGIN,
  ADD_VARIABLE_SUCCESS,
  ADD_VARIABLE_FAILED,
  UPDATE_VARIABLE_BEGIN,
  UPDATE_VARIABLE_SUCCESS,
  UPDATE_VARIABLE_FAILED,
  CLEAR_MESSAGE,
  DELETE_VARIABLE_SUCCESS,
  DELETE_VARIABLE_BEGIN,
  DELETE_VARIABLE_FAILED,
} from "../_constants";

const initialState = {
  status: "",
  variableList: [],
  errorMessage: "",
  successMessage: "",
};

export default (state = initialState, action) => {
  let variableList;
  switch (action.type) {
    case FETCH_VARIABLE_LIST_BEGIN:
      return {
        ...state,
        status: PENDING,
        variableList: "",
        errorMessage: "",
        successMessage: "",
      };

    case FETCH_VARIABLE_LIST_SUCCESS:
      return {
        ...state,
        status: SUCCESS,
        variableList: action.data.variableList,
        errorMessage: "",
        successMessage: action.data.messages,
      };

    case FETCH_VARIABLE_LIST_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        successMessage: "",
      };

    case ADD_VARIABLE_BEGIN:
      return {
        ...state,
        status: PENDING,
        errorMessage: "",
        successMessage: "",
      };

    case ADD_VARIABLE_SUCCESS:
      variableList = state.variableList;
      variableList.push(action.data.variable);
      return {
        ...state,
        status: SUCCESS,
        variableList: variableList,
        errorMessage: "",
        successMessage: action.data.messages,
      };

    case ADD_VARIABLE_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        successMessage: "",
      };

    case UPDATE_VARIABLE_BEGIN:
      return {
        ...state,
        status: PENDING,
        errorMessage: "",
        successMessage: "",
      };

    case UPDATE_VARIABLE_SUCCESS:
      variableList = state.variableList;
      const variableIndex = variableList.findIndex(
        variable => variable.id === parseInt(action.data.variableId),
      );
      if (variableIndex > -1) {
        variableList[variableIndex] = action.data.updatedVariable;
      }
      return {
        ...state,
        status: SUCCESS,
        variableList: variableList,
        errorMessage: "",
        successMessage: action.data.messages,
      };

    case UPDATE_VARIABLE_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        successMessage: "",
      };

    case DELETE_VARIABLE_BEGIN:
      return {
        ...state,
        status: PENDING,
        errorMessage: "",
        successMessage: "",
      };

    case DELETE_VARIABLE_SUCCESS:
      variableList = state.variableList;
      variableList.slice(0);
      const selectedVariables = action.data.variableIds;
      if (selectedVariables.length) {
        selectedVariables.map(selectedVariable => {
          const variableIndex = variableList.findIndex(
            variable => variable.id === selectedVariable,
          );
          if (variableIndex > -1) {
            variableList.splice(variableIndex, 1);
          }
        });
      }
      return {
        ...state,
        status: DELETE_SUCCESS,
        variableList: variableList,
        errorMessage: "",
        successMessage: action.data.messages,
      };

    case DELETE_VARIABLE_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        successMessage: "",
      };

    case CLEAR_MESSAGE:
      return {
        ...state,
        status: "",
        errorMessage: "",
        successMessage: "",
      };

    default:
      return state;
  }
};
