import axios from "axios";
import qs from "qs";
import { isAuthenticated } from "../../common/isAuthenticated";
import { GOOGLEAUTH } from "../_constants/index";

export const axiosRequest = (requestMethod, url, headers, params, body) =>
  new Promise((resolve, reject) => {
    const baseUrl = `/api/v1/${url}`;
    let setHeaders = {};
    const headerType = typeof headers;
    if (headerType === "string") {
      setHeaders = { Authorization: headers };
    }
    if (headers && headerType !== "string") {
      const isAuth = isAuthenticated();
      setHeaders = { Authorization: isAuth.token };
    }
    axios({
      method: requestMethod,
      url: baseUrl,
      data: qs.stringify(body),
      headers: setHeaders,
      params: params,
    })
      .then(res => {
        if (res.status === 200) {
          res.data["statusCode"] = true;
          resolve(res.data);
        } else {
          res.data["statusCode"] = false;
          resolve(res.data);
        }
      })
      .catch(err => {
        reject(err.response.data);
      });
  });

export const googleAuth = params =>
  new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: GOOGLEAUTH.AUTH_URL,
      data: qs.stringify(params),
      headers: GOOGLEAUTH.HEADERS,
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
