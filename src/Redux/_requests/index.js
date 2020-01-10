import axios from "axios";
import qs from "qs";
import { isAuthenticatedToken } from "../../common/isAuthenticated";
import { GOOGLEAUTH } from "../_constants/index";
import { sessionExpired } from "../_actions/user.action";
import { toast } from "react-toastify";

export const axiosRequest = (
  requestMethod,
  url,
  headers,
  params,
  body,
  contentType = "json",
  dispatch = null
) =>
  new Promise((resolve, reject) => {
    let baseUrl = "";
    if (process.env.NODE_ENV === "production") {
      baseUrl += process.env.REACT_APP_API_SERVER_URL;
    }
    baseUrl = `${process.env.REACT_APP_API_BASE_URL}/${url}`;
    let setHeaders = { "Content-Type": "application/json" };
    // let setHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const headerType = typeof headers;
    if (headerType === "string") {
      setHeaders = { Authorization: headers };
    }
    if (headers && headerType !== "string") {
      const token = isAuthenticatedToken();
      setHeaders = { Authorization: "Bearer " + token };
    }

    if (contentType !== "json") {
      setHeaders["Content-Type"] = "multipart/form-data";
    }

    axios({
      method: requestMethod,
      url: baseUrl,
      data: body,
      headers: setHeaders,
      params: params
    })
      .then(res => {
        if (res.status === 200) {
          res.data["statusCode"] = true;
          resolve(res.data);
          if (res.data.status === 400) {
            dispatch(sessionExpired());
          }
        } else if (res.status === 400) {
          dispatch(sessionExpired());
          res.data["statusCode"] = false;
          resolve(res.data && res.data);
        } else {
          res.data["statusCode"] = false;
          resolve(res.data && res.data);
        }
      })
      .catch(err => {
        toast.configure({
          autoClose: 4000,
          draggable: true
        });
        if (
          err &&
          err.response &&
          err.response &&
          err.response.status &&
          err.response.status === 401
        ) {
          dispatch(sessionExpired());
        } else if (
          err &&
          err.response &&
          err.response &&
          err.response.status &&
          err.response.status === 400
        ) {
          toast.error(err.response.data.message);
        }
        reject(err && err.response && err.response.data);
      });
  });

export const googleAuth = params =>
  new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: GOOGLEAUTH.AUTH_URL,
      data: qs.stringify(params),
      headers: GOOGLEAUTH.HEADERS
    })
      .then(res => {
        // if (res.status === 200) {
        //   res.data["statusCode"] = true;
        //   resolve(res.data);
        // } else {
        //   res.data["statusCode"] = false;
        //   resolve(res.data);
        // }
      })
      .catch(err => reject(err));
  });
