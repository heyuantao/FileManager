import { fromJS } from "immutable";
import * as actionType from "./constants"

let initState=fromJS({
    "user":{"is_superuser":false,"username":"无"},
    "isLogin":false,
});

export default function UserReducer(state=initState, action) {
    switch (action.type) {
        case  actionType.USER_FETCHING:
            return state.set("isLogin",false).set("user",fromJS({"is_superuser":false,"username":""}));
        case  actionType.USER_FETCHED:
            const user = state.get("user").merge(action.playload);
            return state.set("isLogin",true).set("user",user);
        case actionType.USER_ERROR:
            return state.set("isLogin",false).set("user",action.playload);
        case  actionType.USER_LOGIN:
            return state.set("isLogin",false).set("user",fromJS({}));
        case  actionType.USER_LOGOUT:
            return state.set("isLogin",false).set("user",fromJS({}));
        default:
            return state;
    }
}
