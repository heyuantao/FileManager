import {combineReducers} from "redux";
import UserReducer from "../pages/commons/store/user_reducer";
import LocationIndicatorReducer from "../pages/commons/store/location_indicator_reducer"

export default combineReducers(
    {
        user:UserReducer,
        location:LocationIndicatorReducer
    }
)
