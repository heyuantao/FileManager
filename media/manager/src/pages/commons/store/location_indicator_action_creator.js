import * as actionType from "./constants"

export const changeLocation = (locationList) => {
    const action ={
        type : actionType.LOCATION_CHANGE,
        playload : locationList
    }
    return action
}
