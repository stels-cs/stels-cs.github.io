import {
    NEW_USER_LOADED,
    START_LOAD_USER,
} from '../constants/App'

import {
    SEARCH_PART,
    SEARCH_PART_NEXT
} from '../constants/GroupView'

const initialState = {
    users: [],
    loading: false
};


function copyToList(state, payload) {
    let userList = payload.items;
    let ourList = state.users;
    for (let i = 0; i < userList.length; i++) {
        let user = userList[i];
        ourList[user.id] = user;
    }
    return ourList;
}

export default function userRepo(state = initialState, action) {
    switch (action.type) {
        case SEARCH_PART:
            return {...state, users:copyToList(state, action.payload)};
        case SEARCH_PART_NEXT:
            return {...state, users:copyToList(state, action.payload)};
        case START_LOAD_USER:
            let uId = action.payload;
            if ( typeof state.users[uId] == 'undefined') {
                state.users[uId] = false;
                return {...state, users:state.users};
            } else {
                return state;
            }
        case NEW_USER_LOADED:
            let user = action.payload;
            state.users[user.id] = user;
            return {...state, users:state.users};
        default:
            return state;
    }

}