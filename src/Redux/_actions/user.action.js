import {
  SIGN_IN_BEGIN,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILED,
} from "../_constants";
import { axiosRequest } from "../_requests";

export const signIn = payload => async dispatch => {
  dispatch({ type: SIGN_IN_BEGIN });
  if (payload) {
    const formData = {
      "sign_in[email]": payload.loginValue,
      "sign_in[password]": payload.password,
    };
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
        data: response.data,
      });
    } else {
      dispatch({
        type: SIGN_IN_FAILED,
        data: response.data.error_messages,
      });
    }
  }
};
