import {
    SEARCH_PART,
    SEARCH_ERROR,
    START_SEARCH,
    LIKE,
    SKIP
} from '../constants/GroupView'

import {
    TEST_MODE,
} from '../constants/App'


export function startSearch(filterParams, selectedGroup) {
    return (dispatch) => {

        dispatch({
            type: START_SEARCH,
            payload: true
        });

        const { id } = selectedGroup;
        const { ageFrom, ageTo, sex } = filterParams;

        let props = {
            'test_mode':TEST_MODE,
            'sex': sex,
            'group_id':id,
            'sort':0,
            'count':10,
            'fields':'photo_max,photo_max_orig,status,city,relation,bdate'
        };

        if (ageFrom) {
            props['age_from'] = ageFrom
        }
        if (ageTo && ageTo >= ageFrom) {
            props['age_to'] = ageTo
        }
        console.log('Start search');
        console.log(props);
        VK.api("users.search", props, function (data) {
            if (data.response) {
                console.log('search success');
                console.log(data);
                dispatch({
                    type: SEARCH_PART,
                    payload: data.response
                });
            } else {
                console.log('search error');
                console.log(data);
                dispatch({
                    type: SEARCH_ERROR,
                    payload: true
                });
            }
        });
    }
}

export function likeThis(user) {
    return (dispatch) => {
        dispatch({
            type: LIKE,
            payload: user
        });
    }
}

export function skipThis(user) {
    return (dispatch) => {
        dispatch({
            type: SKIP,
            payload: user
        });
    }
}
