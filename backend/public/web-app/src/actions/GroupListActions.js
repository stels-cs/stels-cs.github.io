import {
    START_LOAD_GROUPS,
    SUCCESS_LOAD_GROUPS,
    ERROR_LOAD_GROUPS,
    CHOOSE_GROUP
} from '../constants/GroupList'

export function loadGroups() {
    return (dispatch) => {
        
    }
}

export function chooseGroup(group) {
    return (dispatch) => {
        dispatch({
            type: CHOOSE_GROUP,
            payload: group
        });
    }
}