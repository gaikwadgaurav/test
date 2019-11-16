import axios from "axios";
import qs from 'qs';
import { isAuthenticated } from "../../common/isAuthenticated";

export const axiosRequest = (requestMethod, url, headers, params, body) => new Promise((resolve, reject) => {
    const baseUrl = `/api/v1/${url}`;
    let setHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const headerType = typeof headers;
    if (headerType === 'string') {
        setHeaders = { Authorization: headers };
    }
    if (headers && headerType !== 'string') {
        const isAuth = isAuthenticated();
        setHeaders = { Authorization: isAuth.token };
    }
    axios({
        method: requestMethod,
        url: baseUrl,
        data: qs.stringify(body),
        headers: setHeaders,
        params: params
    }).then(res => {
        if (res.data.status === 200) {
            res.data['statusCode'] = true;
            resolve(res.data)
        }
        else {
            res.data['statusCode'] = false;
            resolve(res.data)
        }
    }).catch(err => reject(err))
})