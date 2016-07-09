import {

} from '../constants/Stat'

const initialState = {
    loaded: false,
    selected: 0,
    matched: 0,
    matchedUsers:[],
    selectedMe:0
};

export default function filter(state = initialState, action) {

    switch (action.type) {
        default:
            return state;
    }

}