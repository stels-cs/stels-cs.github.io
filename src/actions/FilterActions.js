import {
    SET_FILTER,
} from '../constants/Filter'

export function setFilter(params) {
    return (dispatch) => {
        dispatch({
            type: SET_FILTER,
            payload: params
        });
    }
}
