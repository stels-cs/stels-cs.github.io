import {
    START_LOAD_GROUPS,
    SUCCESS_LOAD_GROUPS,
    ERROR_LOAD_GROUPS,
} from '../constants/GroupList'

const initialState = {
    loaded: false,
    count: 0,
    items: [],
    error: false
};

export default function groupList(state = initialState, action) {
    switch (action.type) {
        case START_LOAD_GROUPS:
            return {...state, loaded:false};
            break;
        case SUCCESS_LOAD_GROUPS:
            return {...state, loaded:true, count:action.payload.count, items:action.payload.items};
            break;
        case ERROR_LOAD_GROUPS:
            return {...state, loaded:false, error: true};
            break;
        default:
            return state;
    }

}