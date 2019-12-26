import {
  SIGN_IN_BEGIN,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILED,
  SIGN_IN_WITH_GOOGLE_BEGIN,
  SIGN_IN_WITH_GOOGLE_SUCCESS,
  SIGN_IN_WITH_GOOGLE_FAILED,
  SIGN_UP_FAILED,
  CLEAR_MESSAGE,
  SIGN_OUT_BEGIN,
  SIGN_OUT_SUCCESS,
  SIGN_OUT_FAILED,
  SESSION_EXPIRED,
  UPDATE_USER_PROFILE_BEGIN,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_FAILED,
  INVITED_USER_REGISTER_BEGIN,
  INVITED_USER_REGISTER_SUCCESS,
  INVITED_USER_REGISTER_FAILED,
  FETCH_INVITED_USER_LIST_BEGIN,
  FETCH_INVITED_USER_LIST_SUCCESS,
  FETCH_INVITED_USER_LIST_FAILED,
  FILTER_INVITED_USER_LIST,
  DELETE_USER_INVITATION_BEGIN,
  DELETE_USER_INVITATION_SUCCESS,
  DELETE_USER_INVITATION_FAILED
} from "../_constants";
import { axiosRequest } from "../_requests";

export const signIn = payload => async dispatch => {
  dispatch({ type: SIGN_IN_BEGIN });
  if (payload) {
    try {
      const response = await axiosRequest(
        "POST",
        "sign_in",
        false,
        undefined,
        payload
      );
      if (response.status === 200) {
        dispatch({
          type: SIGN_IN_SUCCESS,
          data: {
            userData: response.data,
            token: response.token,
            messages: response.message
          }
        });
      } else {
        dispatch({
          type: SIGN_IN_FAILED,
          data: response.data
        });
      }
    } catch (error) {
      dispatch({
        type: SIGN_IN_FAILED,
        data: error.messages
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
      payload
    );
    if (response) {
      dispatch({
        type: SIGN_IN_WITH_GOOGLE_SUCCESS,
        data: {
          userData: response.data,
          token: response.token,
          messages: response.message
        }
      });
    } else {
      dispatch({
        type: SIGN_IN_WITH_GOOGLE_FAILED,
        data: response.messages
      });
    }
  } catch (error) {
    dispatch({
      type: SIGN_IN_WITH_GOOGLE_FAILED,
      data: error.messages
    });
  }
};

export const signUp = (payload, user) => async dispatch => {
  if (payload) {
    try {
      const response = await axiosRequest(
        "POST",
        "sign_up",
        false,
        null,
        payload
      );
      if (response.status === 200) {
        const { email, password } = user;
        let formData = new FormData();
        formData.append("sign_in[email]", email);
        formData.append("sign_in[password]", password);
        dispatch(signIn(formData));
      } else {
        dispatch({
          type: SIGN_UP_FAILED,
          data: response.data
        });
      }
    } catch (error) {
        dispatch({
          type: SIGN_UP_FAILED,
          data: error.data
        });
      }
    }
};

export const invitedUserRegister = (payload, userId) => async dispatch => {
  dispatch({ type: INVITED_USER_REGISTER_BEGIN });
  if (payload) {
    try {
      const response = await axiosRequest(
        "PATCH",
        "user_invitations/" + userId + "",
        false,
        null,
        payload
      );
      if (response.status === 200) {
        dispatch({
          type: INVITED_USER_REGISTER_SUCCESS,
          data: {
            userData: response.data,
            messages: response.message
          }
        });
      } else {
        dispatch({
          type: INVITED_USER_REGISTER_FAILED,
          data: response.data
        });
      }
    } catch (error) {
      dispatch({
        type: INVITED_USER_REGISTER_FAILED,
        data: error.data
      });
    }
  }
};

export const fetchInvitedUsers = (header, params) => async dispatch => {
  dispatch({ type: FETCH_INVITED_USER_LIST_BEGIN });
  if (header) {
    try {
      const response = await axiosRequest(
        "POST",
        "user_invitations/invited_users_list",
        header,
        null,
        null
      );
      if (response.status === 200) {
        dispatch({
          type: FETCH_INVITED_USER_LIST_SUCCESS,
          data: response.data
        });
      } else {
        dispatch({
          type: FETCH_INVITED_USER_LIST_FAILED,
          data: response.data
        });
      }
    } catch (error) {
      dispatch({
        type: FETCH_INVITED_USER_LIST_FAILED,
        data: error.data
      });
    }
  }
};

export const filterInvitedUserList = value => dispatch => {
  dispatch({
    type: FILTER_INVITED_USER_LIST,
    data: value
  });
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
        null
      );
      if (response) {
        dispatch({
          type: SIGN_OUT_SUCCESS,
          data: {
            userData: "",
            message: response.messages
          }
        });
      } else {
        dispatch({
          type: SIGN_IN_FAILED,
          data: response.data
        });
      }
    } catch (error) {
      dispatch({
        type: SIGN_OUT_FAILED,
        data: error && error.messages && error.messages
      });
    }
  }
};

export const updateUserProfile = (headers, params, body) => async dispatch => {
  if (headers) {
    dispatch({ type: UPDATE_USER_PROFILE_BEGIN });
    try {
      const updateProfileResponse = await axiosRequest(
        "PATCH",
        "users",
        headers,
        params,
        body,
        undefined,
        dispatch
      );
      if (updateProfileResponse.status === 200) {
        dispatch({
          type: UPDATE_USER_PROFILE_SUCCESS,
          data: {
            user: updateProfileResponse.data,
            success: updateProfileResponse.message
          }
        });
      } else {
        dispatch({
          type: UPDATE_USER_PROFILE_FAILED,
          data: updateProfileResponse.data
        });
      }
    } catch (error) {
      dispatch({
        type: UPDATE_USER_PROFILE_FAILED,
        data: error.messages
      });
    }
  }
};

export const updateInvitedUserProfile = (
  headers,
  params,
  body,
  user,
  userToken
) => async dispatch => {
  if (headers) {
    dispatch({ type: INVITED_USER_REGISTER_BEGIN });
    try {
      const updateProfileResponse = await axiosRequest(
        "PATCH",
        "users",
        headers,
        params,
        body,
        undefined,
        dispatch
      );
      if (updateProfileResponse.status === 200) {
        const { email, password } = user;
        let formData = new FormData();
        formData.append("sign_in[email]", email);
        formData.append("sign_in[password]", password);
        dispatch(signIn(formData));
      } else {
        dispatch({
          type: INVITED_USER_REGISTER_FAILED,
          data: updateProfileResponse.data
        });
      }
    } catch (error) {
      dispatch({
        type: INVITED_USER_REGISTER_FAILED,
        data: error.messages
      });
    }
  }
};

export const deleteUserInvitation = (
  headers,
  userIds,
  params,
  body
) => async dispatch => {
  if (headers) {
    dispatch({ type: DELETE_USER_INVITATION_BEGIN });
    try {
      const deleteUserInvitationResponse = await axiosRequest(
        "DELETE",
        "user_invitations",
        headers,
        params,
        body,
        "formData",
        dispatch
      );
      if (deleteUserInvitationResponse.status === 200) {
        dispatch({
          type: DELETE_USER_INVITATION_SUCCESS,
          data: {
            success: deleteUserInvitationResponse.message,
            userIds
          }
        });
      } else {
        dispatch({
          type: DELETE_USER_INVITATION_FAILED,
          data: deleteUserInvitationResponse.data
        });
      }
    } catch (error) {
      dispatch({
        type: DELETE_USER_INVITATION_FAILED,
        data: error.messages
      });
    }
  }
};

export const clearMsg = () => dispatch => {
  dispatch({
    type: CLEAR_MESSAGE
  });
};

export const sessionExpired = () => dispatch => {
  dispatch({
    type: SESSION_EXPIRED
  });
};
