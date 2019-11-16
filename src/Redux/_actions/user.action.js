import {
  SIGN_IN_BEGIN,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILED,
  SIGN_UP_BEGIN,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILED,
} from "../_constants";
import { axiosRequest } from "../_requests";

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
        null,
        formData,
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
        dispatch({
          type: SIGN_IN_FAILED,
          data: response.messages,
        });
      }
    } catch (error) {
      console.log("error of catch", error.error);
    }
  }
};

export const signUp = payload => async dispatch => {
  dispatch({ type: SIGN_UP_BEGIN });
  if (payload) {
    const formData = {
      "company[name]": payload.nameValue,
      "user[email]": payload.email,
      "user[password]": payload.password,
    };
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
      dispatch({
        type: SIGN_UP_FAILED,
        data: response.messages,
      });
    }
  }
};
