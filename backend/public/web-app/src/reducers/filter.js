import {
    SET_FILTER
} from '../constants/Filter'

import {
    CHOOSE_GROUP
} from '../constants/GroupList'

import {
    SEARCH_PART,
    SEARCH_ERROR,
    START_SEARCH,
    LIKE,
    SKIP,
    SEARCH_PART_NEXT,
    AVATAR_LOADED,
    DROP_AVATAR,
    AVATAR_ERROR,
    LOCK_LIKE,
    UNLOCK_LIKE,
    INCREMENT_SEARCH
} from '../constants/GroupView'

const initialState = {
    ageFrom: 0,
    ageTo: 0,
    sex: 1,
    inSearch: true,
    founded: {count: 0, items: []},
    searchError: false,
    offset: 0,
    stepDiff: 1,
    canLoadMore: true,
    loadingAvatar: true,
    errorAvatar: false,
    lockLike: false,
    userPool:[],
    userPoolLoading:false
};

function mergeFounded(originalFounded, newFounded) {
    let map = {};
    for (let i = 0; i < originalFounded.items.length; i++) {
        let u = originalFounded.items[i];
        map[u.id] = true;
    }

    let newUsers = 0;
    for (let i = 0; i < newFounded.items.length; i++) {
        let u = newFounded.items[i];
        if (typeof map[u.id] == 'undefined') {
            originalFounded.items.push(u);
            newUsers++;
        }
    }
    console.log('New users addedd ' + newUsers);
    return originalFounded;
}

export default function filter(state = initialState, action) {

    switch (action.type) {
        case CHOOSE_GROUP:
            return {
                ...state,
                inSearch: true,
                searchError: false,
                founded: {count: 0, items: []},
                stepDiff: 1,
                canLoadMore: true
            };
        case START_SEARCH:
            return {
                ...state,
                inSearch: true,
                searchError: false,
                founded: {count: 0, items: []},
                stepDiff: 1,
                canLoadMore: true
            };
        case SEARCH_ERROR:
            return {...state, inSearch: false, searchError: true, founded: {count: 0, items: []}, canLoadMore: true};
        case SEARCH_PART:
            return {
                ...state,
                inSearch: false,
                searchError: false,
                founded: action.payload,
                offset: 0,
                stepDiff: 2,
                canLoadMore: true
            };
        case INCREMENT_SEARCH:
            let canLoadMore = state.stepDiff < 4;
            return {
                ...state,
                stepDiff: state.stepDiff + 1,
                canLoadMore: canLoadMore
            };
            return;
        case SEARCH_PART_NEXT:
            return {
                ...state,
                inSearch: false,
                searchError: false,
                founded: mergeFounded(state.founded, action.payload),
            };
        case SET_FILTER:
            return Object.assign({}, state, action.payload, {
                inSearch: true,
                searchError: false,
                founded: {count: 0, items: []},
                stepDiff: 1,
                canLoadMore: true
            });
            break;
        case LIKE:
            return {...state, offset: state.offset + 1};
            break;
        case SKIP:
            return {...state, offset: state.offset + 1};
            break;
        case DROP_AVATAR:
            return {...state, loadingAvatar: true, errorAvatar: false};
            break;
        case AVATAR_LOADED:
            return {...state, loadingAvatar: false};
            break;
        case AVATAR_ERROR:
            return {...state, errorAvatar: true, loadingAvatar: false};
            break;
        case LOCK_LIKE:
            return {...state, lockLike: true};
        case UNLOCK_LIKE:
            return {...state, lockLike: false};
        default:
            return state;
    }

}