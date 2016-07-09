import {
    SET_FILTER
} from '../constants/Filter'

import {
    SEARCH_PART,
    SEARCH_ERROR,
    START_SEARCH,
    LIKE,
    SKIP
} from '../constants/GroupView'

const initialState = {
    ageFrom: 0,
    ageTo: 0,
    sex: 1,
    inSearch: true,
    founded: { count:0, items:[] },
    searchError:false,
    offset:0
};

export default function filter(state = initialState, action) {

    switch (action.type) {
        case START_SEARCH:
            return {...state, inSearch:true, searchError:false, founded:{}};
        case SEARCH_ERROR:
            return {...state, inSearch:false, searchError:true, founded:{}};
        case SEARCH_PART:
            return {...state, inSearch:false, searchError:false, founded:action.payload, offset:0};
        case SET_FILTER:
            return Object.assign({}, state, action.payload);
            break;
        case LIKE:
            console.log(['LIKE', action.payload]);
            return {...state, offset:state.offset+1};
            break;
        case SKIP:
            console.log(['SKIP', action.payload]);
            return {...state, offset:state.offset+1};
            break;
        default:
            return state;
    }

}