/**
|--------------------------------------------------
| COMMON CONSTANTS
|--------------------------------------------------
*/

export const PENDING = "PENDING";
export const SUCCESS = "SUCCESS";
export const FAILED = "FAILED";
export const DELETE_SUCCESS = "DELETE_SUCCESS";
export const SESSION_EXPIRED_SUCCESS = "SESSION_EXPIRED_SUCCESS";

/**
|--------------------------------------------------
| SIGN UP CONSTANTS
|--------------------------------------------------
*/

export const SIGN_UP_BEGIN = "SIGN_UP_BEGIN";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILED = "SIGN_UP_FAILED";

/**
|--------------------------------------------------
| INVITED USER REGISTER CONSTANTS
|--------------------------------------------------
*/

export const INVITED_USER_REGISTER_BEGIN = "INVITED_USER_REGISTER_BEGIN";
export const INVITED_USER_REGISTER_SUCCESS = "INVITED_USER_REGISTER_SUCCESS";
export const INVITED_USER_REGISTER_FAILED = "INVITED_USER_REGISTER_FAILED";

/**
|--------------------------------------------------
| DELET INVITED USER CONSTANTS
|--------------------------------------------------
*/

export const DELETE_USER_INVITATION_BEGIN = "DELETE_USER_INVITATION_BEGIN";
export const DELETE_USER_INVITATION_SUCCESS = "DELETE_USER_INVITATION_SUCCESS";
export const DELETE_USER_INVITATION_FAILED = "DELETE_USER_INVITATION_FAILED";

/**
|--------------------------------------------------
| INVITED USER REGISTER CONSTANTS
|--------------------------------------------------
*/

export const FETCH_INVITED_USER_LIST_BEGIN = "FETCH_INVITED_USER_LIST_BEGIN";
export const FETCH_INVITED_USER_LIST_SUCCESS = "FETCH_INVITED_USER_LIST_SUCCESS";
export const FETCH_INVITED_USER_LIST_FAILED = "FETCH_INVITED_USER_LIST_FAILED";
export const FILTER_INVITED_USER_LIST = "FILTER_INVITED_USER_LIST";

/**
|--------------------------------------------------
| LOGIN CONSTANTS
|--------------------------------------------------
*/

export const SIGN_IN_BEGIN = "SIGN_IN_BEGIN";
export const SIGN_IN_SUCCESS = "SIGN_IN_SUCCESS";
export const SIGN_IN_FAILED = "SIGN_IN_FAILED";

/**
|--------------------------------------------------
| LOGOUT CONSTANTS
|--------------------------------------------------
*/

export const SIGN_OUT_BEGIN = "SIGN_OUT_BEGIN";
export const SIGN_OUT_SUCCESS = "SIGN_OUT_SUCCESS";
export const SIGN_OUT_FAILED = "SIGN_OUT_FAILED";

/**
|--------------------------------------------------
| LOGIN WITH GOOGLE CONSTANTS
|--------------------------------------------------
*/

export const SIGN_IN_WITH_GOOGLE_BEGIN = "SIGN_IN_WITH_GOOGLE_BEGIN";
export const SIGN_IN_WITH_GOOGLE_SUCCESS = "SIGN_IN_WITH_GOOGLE_SUCCESS";
export const SIGN_IN_WITH_GOOGLE_FAILED = "SIGN_IN_WITH_GOOGLE_FAILED";

/**
|--------------------------------------------------
| UPDATE USER PROFILE
|--------------------------------------------------
*/

export const UPDATE_USER_PROFILE_BEGIN = "UPDATE_USER_PROFILE_BEGIN";
export const UPDATE_USER_PROFILE_SUCCESS = "UPDATE_USER_PROFILE_SUCCESS";
export const UPDATE_USER_PROFILE_FAILED = "UPDATE_USER_PROFILE_FAILED";

/**
|--------------------------------------------------
| FETCH VARIABLES LIST
|--------------------------------------------------
*/

export const FETCH_VARIABLE_LIST_BEGIN = "FETCH_VARIABLE_LIST_BEGIN";
export const FETCH_VARIABLE_LIST_SUCCESS = "FETCH_VARIABLE_LIST_SUCCESS";
export const FETCH_VARIABLE_LIST_FAILED = "FETCH_VARIABLE_LIST_FAILED";
export const FILTER_VARIABLES_LIST = "FILTER_VARIABLES_LIST";

/**
|--------------------------------------------------
| ADD VARIABLE
|--------------------------------------------------
*/

export const ADD_VARIABLE_BEGIN = "ADD_VARIABLE_BEGIN";
export const ADD_VARIABLE_SUCCESS = "ADD_VARIABLE_SUCCESS";
export const ADD_VARIABLE_FAILED = "ADD_VARIABLE_FAILED";

/**
|--------------------------------------------------
| UPDATE VARIABLE
|--------------------------------------------------
*/

export const UPDATE_VARIABLE_BEGIN = "UPDATE_VARIABLE_BEGIN";
export const UPDATE_VARIABLE_SUCCESS = "UPDATE_VARIABLE_SUCCESS";
export const UPDATE_VARIABLE_FAILED = "UPDATE_VARIABLE_FAILED";

/**
|--------------------------------------------------
| DELETE VARIABLE
|--------------------------------------------------
*/

export const DELETE_VARIABLE_BEGIN = "DELETE_VARIABLE_BEGIN";
export const DELETE_VARIABLE_SUCCESS = "DELETE_VARIABLE_SUCCESS";
export const DELETE_VARIABLE_FAILED = "DELETE_VARIABLE_FAILED";

/**
|--------------------------------------------------
| CLEAR SUCCESS AND ERROR MESSAGE
|--------------------------------------------------
*/

export const CLEAR_MESSAGE = "CLEAR_MESSAGE";
export const SESSION_EXPIRED = "SESSION_EXPIRED";

export const GOOGLEAUTH = {
  AUTH_URL: `${process.env.REACT_APP_API_SERVER_URL}/users/auth/google_oauth2/callback`,
  HEADERS: {
    Authorization: "Bearer ******",
    "Content-Type": "application/x-www-form-urlencoded"
  }
};
