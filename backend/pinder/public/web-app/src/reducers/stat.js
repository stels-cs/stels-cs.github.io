import {

} from '../constants/Stat'

import {
    LIKE
} from '../constants/GroupView'

const initialState = {
    loaded: false,
    selected: 0,
    matched: 0,
    matchedUsers:[],
    selectedMe:0
};

export default function filter(state = initialState, action) {

    switch (action.type) {
        case LIKE:
            return {...state, selected: state.selected + 1};
        default:
            return state;
    }

}