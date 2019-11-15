import {
  PENDING,
  SUCCESS,
  FAILED,
  SIGN_IN_BEGIN,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILED
} from '../_constants';

const initialState = {
  status: '',
  signup: '',
  userData: '',
  errorMessage: '',
}


export default (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN_BEGIN:
      return {
        ...state,
        status: PENDING,
        signup: '',
        userData: '',
        errorMessage: ''
      };

    case SIGN_IN_SUCCESS:
      return {
        ...state,
        status: SUCCESS,
        userData: action.data,
        signup: '',
        errorMessage: ''
      };

    case SIGN_IN_FAILED:
      return {
        ...state,
        status: FAILED,
        errorMessage: action.data,
        userData: '',
        signup: '',
      }

    default:
      return state;
  }
}