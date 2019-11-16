import {
  PENDING,
  SUCCESS,
  FAILED,
  SIGN_IN_BEGIN,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILED,
  SIGN_UP_BEGIN,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILED,
} from "../_constants";

const initialState = {
  status: "",
  signup: "",
  userData: "",
  errorMessage: "",
  successMessage: "",
  isAuthenticated: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN_BEGIN:
      return {
        ...state,
        status: PENDING,
        signup: "",
        userData: "",
        errorMessage: "",
        isAuthenticated: false,
        successMessage: "",
      };

    case SIGN_IN_SUCCESS:
      return {
        ...state,
        status: SUCCESS,
        userData: action.data.userData,
        signup: "",
        errorMessage: "",
        isAuthenticated: true,
        successMessage: action.data.messages,
      };

    case SIGN_IN_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.messages,
        userData: "",
        signup: "",
        isAuthenticated: false,
        successMessage: "",
      };

    case SIGN_UP_BEGIN:
      return {
        ...state,
        status: PENDING,
        signup: "",
        userData: "",
        errorMessage: "",
        successMessage: "",
      };

    case SIGN_UP_SUCCESS:
      return {
        ...state,
        status: SUCCESS,
        userData: "",
        signup: action.data.userData,
        errorMessage: "",
        successMessage: action.data.messages,
      };

    case SIGN_UP_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        userData: "",
        signup: "",
        successMessage: "",
      };

    default:
      return state;
  }
};
