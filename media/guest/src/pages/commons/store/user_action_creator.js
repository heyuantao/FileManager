import {fromJS} from "immutable";
import * as actionType from "./constants"
import Settings from "../../../settings";

const req = Settings.request;
const userAPIURL = Settings.userAPIURL;
const loginAPIURL = Settings.loginAPIURL;
const captchaAPIURL = Settings.captchaAPIURL;
const autoLogin = Settings.autoLogin;

export const getUser = () => {
    return (dispatch)=>{
        const fetching_user_action = {type:actionType.USER_FETCHING,playload:fromJS({})};
        dispatch(fetching_user_action);
        req.get(userAPIURL,{}).then((response)=>{
            const fetched_user_action = {type:actionType.USER_FETCHED,playload:fromJS(response.data)};
            dispatch(fetched_user_action);
            //if ((response.data.dashboard_url !== undefined)&&(autoLogin===true)) {
            //    window.location.href = response.data.dashboard_url;
            //}
        }).catch((error)=>{
            const user_error_action = {type:actionType.USER_ERROR,playload:fromJS({})};
            dispatch(user_error_action);
        })
    }
}

export const login = (username,password,captcha) => {
    return (dispatch)=>{
        const action = {type:actionType.USER_LOGIN,playload:fromJS({})};
        dispatch(action);
        const params = {username:username,password:password,captcha:captcha};
        req.post(loginAPIURL,params).then((response)=>{
            dispatch(getUser());
        }).catch((error)=>{
        })
    }
}

