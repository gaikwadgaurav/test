import {
  SIGN_IN_BEGIN,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILED,
  SIGN_IN_WITH_GOOGLE_BEGIN,
  SIGN_IN_WITH_GOOGLE_SUCCESS,
  SIGN_IN_WITH_GOOGLE_FAILED,
  SIGN_UP_BEGIN,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILED,
  CLEAR_MESSAGE,
  SIGN_OUT_BEGIN,
  SIGN_OUT_SUCCESS,
  SIGN_OUT_FAILED,
} from "../_constants";
import { axiosRequest } from "../_requests";
import qs from "qs";

export const signIn = payload => async dispatch => {
  dispatch({ type: SIGN_IN_BEGIN });
  if (payload) {
    const formData = {
      "sign_in[email]": payload.loginValue,
      "sign_in[password]": payload.password,
    };
    try {
      const response = await axiosRequest(
        "POST",
        "sign_in",
        false,
        undefined,
        qs.parse(formData),
      );
      if (response.is_success) {
        dispatch({
          type: SIGN_IN_SUCCESS,
          data: {
            userData: response.data,
            messages: response.messages,
          },
        });
      } else {
        // dispatch({
        //   type: SIGN_IN_FAILED,
        //   data: response.messages,
        // });
      }
    } catch (error) {
      dispatch({
        type: SIGN_IN_FAILED,
        data: error.messages,
      });
    }
  }
};

export const signInWithGoogle = payload => async dispatch => {
  dispatch({ type: SIGN_IN_WITH_GOOGLE_BEGIN });
  try {
    const response = await axiosRequest(
      "POST",
      "auth/request",
      false,
      null,
      payload,
    );
    if (response) {
      dispatch({
        type: SIGN_IN_WITH_GOOGLE_SUCCESS,
        data: {
          userData: response.data,
          messages: response.messages,
        },
      });
    } else {
      dispatch({
        type: SIGN_IN_WITH_GOOGLE_FAILED,
        data: response.messages,
      });
    }
  } catch (error) {
    dispatch({
      type: SIGN_IN_WITH_GOOGLE_FAILED,
      data: error.messages,
    });
  }
};

export const signUp = payload => async dispatch => {
  dispatch({ type: SIGN_UP_BEGIN });
  if (payload) {
    const formData = {
      "company[name]": payload.companyNameValue,
      "user[name]": payload.nameValue,
      "user[email]": payload.email,
      "user[password]": payload.password,
    };
    try {
      const response = await axiosRequest(
        "POST",
        "sign_up",
        false,
        null,
        formData,
      );
      if (response.is_success) {
        dispatch({
          type: SIGN_UP_SUCCESS,
          data: {
            userData: response.data,
            messages: response.messages,
          },
        });
      } else {
        // dispatch({
        //   type: SIGN_UP_FAILED,
        //   data: response.messages,
        // });
      }
    } catch (error) {
      dispatch({
        type: SIGN_UP_FAILED,
        data: error.messages,
      });
    }
  }
};

export const signOut = payload => async dispatch => {
  dispatch({ type: SIGN_OUT_BEGIN });
  if (payload) {
    const header = payload;
    try {
      const response = await axiosRequest(
        "DELETE",
        "log_out",
        header,
        null,
        null,
      );
      if (response) {
        dispatch({
          type: SIGN_OUT_SUCCESS,
          data: {
            userData: "",
            message: response.messages,
          },
        });
      } else {
        // dispatch({
        //   type: SIGN_IN_FAILED,
        //   data: response.messages,
        // });
      }
    } catch (error) {
      dispatch({
        type: SIGN_OUT_FAILED,
        data: error.messages,
      });
    }
  }
};

export const clearMsg = () => dispatch => {
  dispatch({
    type: CLEAR_MESSAGE,
  });
};
