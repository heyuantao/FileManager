import {combineReducers} from "redux";
import UserReducer from "../pages/commons/store/user_reducer";

export default combineReducers(
    {
        user:UserReducer,
    }
)
