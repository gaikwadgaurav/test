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
  SESSION_EXPIRED,
  SESSION_EXPIRED_SUCCESS,
  SIGN_IN_WITH_GOOGLE_BEGIN,
  SIGN_IN_WITH_GOOGLE_SUCCESS,
  SIGN_IN_WITH_GOOGLE_FAILED,
  SIGN_OUT_BEGIN,
  SIGN_OUT_SUCCESS,
  SIGN_OUT_FAILED,
  UPDATE_USER_PROFILE_BEGIN,
  UPDATE_USER_PROFILE_FAILED,
  UPDATE_USER_PROFILE_SUCCESS,
  INVITED_USER_REGISTER_BEGIN,
  INVITED_USER_REGISTER_SUCCESS,
  INVITED_USER_REGISTER_FAILED
} from "../_constants";

const initialState = {
  status: "",
  userData: "",
  token: "",
  errorMessage: "",
  successMessage: "",
  isAuthenticated: false,
  isSignOut: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN_BEGIN:
      return {
        ...state,
        status: PENDING,
        userData: "",
        token: "",
        errorMessage: "",
        isAuthenticated: false,
        successMessage: ""
      };

    case SIGN_IN_SUCCESS:
      return {
        ...state,
        status: SUCCESS,
        userData: action.data.userData,
        token: action.data.token,
        errorMessage: "",
        isAuthenticated: true,
        successMessage: action.data.messages
      };

    case SIGN_IN_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        userData: "",
        token: "",
        isAuthenticated: false,
        successMessage: ""
      };

    case SIGN_IN_WITH_GOOGLE_BEGIN:
      return {
        ...state,
        status: PENDING,
        userData: "",
        errorMessage: "",
        isAuthenticated: false,
        successMessage: ""
      };

    case SIGN_IN_WITH_GOOGLE_SUCCESS:
      return {
        ...state,
        status: SUCCESS,
        userData: action.data.userData,
        token: action.data.token,
        isAuthenticated: true,
        successMessage: action.data.messages
      };

    case SIGN_IN_WITH_GOOGLE_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        userData: "",
        isAuthenticated: false,
        successMessage: ""
      };

    case SIGN_UP_BEGIN:
      return {
        ...state,
        status: PENDING,
        userData: "",
        errorMessage: "",
        successMessage: ""
      };

    case SIGN_UP_SUCCESS:
      return {
        ...state,
        status: SUCCESS,
        userData: action.data.userData,
        token: action.data.userData.token,
        errorMessage: "",
        successMessage: "Sign in successfully...!"
      };

    case SIGN_UP_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        successMessage: ""
      };

    case INVITED_USER_REGISTER_BEGIN:
      return {
        ...state,
        status: PENDING,
        userData: "",
        errorMessage: "",
        successMessage: ""
      };

    case INVITED_USER_REGISTER_SUCCESS:
      return {
        ...state,
        status: SUCCESS,
        userData: action.data.user,
        token: action.data.token,
        errorMessage: "",
        successMessage: action.data.success
      };

    case INVITED_USER_REGISTER_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        successMessage: ""
      };

    case SIGN_OUT_BEGIN:
      return {
        ...state,
        status: PENDING,
        userData: "",
        errorMessage: "",
        isAuthenticated: false,
        successMessage: "",
        isSignOut: false
      };

    case SIGN_OUT_SUCCESS:
      return {
        ...state,
        status: SUCCESS,
        userData: action.data.userData,
        errorMessage: "",
        isAuthenticated: false,
        successMessage: action.data.message,
        isSignOut: true
      };

    case SIGN_OUT_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: "",
        userData: "",
        isAuthenticated: false,
        successMessage: "",
        isSignOut: false
      };

    case UPDATE_USER_PROFILE_BEGIN:
      return {
        ...state,
        status: PENDING,
        errorMessage: "",
        successMessage: ""
      };

    case UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        status: SUCCESS,
        userData: action.data.user,
        errorMessage: "",
        successMessage: action.data.success
      };

    case UPDATE_USER_PROFILE_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        successMessage: ""
      };

    case CLEAR_MESSAGE:
      return {
        ...state,
        status: "",
        errorMessage: "",
        successMessage: "",
        isSignOut: false
      };

    case SESSION_EXPIRED:
      return {
        ...state,
        status: SESSION_EXPIRED_SUCCESS,
        errorMessage: "Access denied!. Token has expired.",
        userData: "",
        successMessage: "",
        isSignOut: true
      };

    default:
      return state;
  }
};
