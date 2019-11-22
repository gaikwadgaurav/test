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
  CLEAR_MESSAGE,
  SIGN_IN_WITH_GOOGLE_BEGIN,
  SIGN_IN_WITH_GOOGLE_SUCCESS,
  SIGN_IN_WITH_GOOGLE_FAILED,
  SIGN_OUT_BEGIN,
  SIGN_OUT_SUCCESS,
  SIGN_OUT_FAILED,
} from "../_constants";

const initialState = {
  status: "",
  signUp: "",
  userData: "",
  errorMessage: "",
  successMessage: "",
  isAuthenticated: false,
  isSignOut: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN_BEGIN:
      return {
        ...state,
        status: PENDING,
        signUp: "",
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
        signUp: "",
        errorMessage: "",
        isAuthenticated: true,
        successMessage: action.data.messages,
      };

    case SIGN_IN_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        userData: "",
        signUp: "",
        isAuthenticated: false,
        successMessage: "",
      };

    case SIGN_IN_WITH_GOOGLE_BEGIN:
      return {
        ...state,
        status: PENDING,
        signUp: "",
        userData: "",
        errorMessage: "",
        isAuthenticated: false,
        successMessage: "",
      };

    case SIGN_IN_WITH_GOOGLE_SUCCESS:
      return {
        ...state,
        status: SUCCESS,
        userData: action.data.userData,
        signUp: "",
        errorMessage: "",
        isAuthenticated: true,
        successMessage: action.data.messages,
      };

    case SIGN_IN_WITH_GOOGLE_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        userData: "",
        signUp: "",
        isAuthenticated: false,
        successMessage: "",
      };

    case SIGN_UP_BEGIN:
      return {
        ...state,
        status: PENDING,
        signUp: "",
        userData: "",
        errorMessage: "",
        successMessage: "",
      };

    case SIGN_UP_SUCCESS:
      return {
        ...state,
        status: SUCCESS,
        userData: "",
        signUp: action.data.userData,
        errorMessage: "",
        successMessage: action.data.messages,
      };

    case SIGN_UP_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        userData: "",
        signUp: "",
        successMessage: "",
      };

    case SIGN_OUT_BEGIN:
      return {
        ...state,
        status: PENDING,
        signUp: "",
        userData: "",
        errorMessage: "",
        isAuthenticated: false,
        successMessage: "",
        isSignOut: false,
      };

    case SIGN_OUT_SUCCESS:
      return {
        ...state,
        status: SUCCESS,
        userData: action.data.userData,
        signUp: "",
        errorMessage: "",
        isAuthenticated: false,
        successMessage: action.data.message,
        isSignOut: true,
      };

    case SIGN_OUT_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        userData: "",
        signUp: "",
        isAuthenticated: false,
        successMessage: "",
        isSignOut: false,
      };

    case CLEAR_MESSAGE:
      return {
        ...state,
        status: "",
        errorMessage: "",
        userData: state.userData,
        signUp: state.signUp,
        successMessage: "",
        isSignOut: false
      };

    default:
      return state;
  }
};
