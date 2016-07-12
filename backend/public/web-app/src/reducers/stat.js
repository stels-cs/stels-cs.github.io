import {} from '../constants/Stat'

import {
    PROFILE_LOADED,
    APP_UPDATE_PROFILE
} from '../constants/App'

import {
    LIKE,SKIP,
    CLOSE_NEW_MATCHED
} from '../constants/GroupView'

const initialState = {
    loaded: false,
    selected: 0,
    matched: 0,
    matchedUsers: [],
    selectedIds: [],
    selectedMe: 0,
    hasNewMatched:false,
    newMatchedIds:[]
};

function arr_diff (a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
};

export default function filter(state = initialState, action) {

    switch (action.type) {
        case CLOSE_NEW_MATCHED:
            return {...state, hasNewMatched: false, newMatchedIds:[]};
        case PROFILE_LOADED:
            return Object.assign({}, state, action.payload, {loaded: true});
        case APP_UPDATE_PROFILE:
            let o = {
                hasNewMatched: false,
                newMatchedIds: arr_diff(state.matchedUsers, action.payload.matchedUsers)
            };
            if (o.newMatchedIds.length > 0) {
                o.hasNewMatched = true;
            }
            return Object.assign({}, state, action.payload, {loaded: true}, o);
        case LIKE:
            let selectedIds = state.selectedIds;
            if (selectedIds.push) {
                selectedIds.push(action.payload.id);
                return {...state, selectedIds: selectedIds, selected: state.selected + 1};
            } else {
                return {...state, selected: state.selected + 1};
            }
        case SKIP:
            let sIds = state.selectedIds;
            if (sIds.push) {
                sIds.push(action.payload.id);
                return {...state, selectedIds: sIds};
            } else {
                return state;
            }
        default:
            return state;
    }

}