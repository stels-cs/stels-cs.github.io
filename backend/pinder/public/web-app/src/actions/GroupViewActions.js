import {
    SEARCH_PART,
    SEARCH_ERROR,
    START_SEARCH,
    LIKE,
    SKIP,
    SEARCH_PART_NEXT,
    DROP_AVATAR,
    AVATAR_LOADED,
    AVATAR_ERROR
} from '../constants/GroupView'

import {
    TEST_MODE,
    APP_HTTPS
} from '../constants/App'


export function startSearch(filterParams, selectedGroup) {
    return (dispatch) => {

        const { id } = selectedGroup;
        const { ageFrom, ageTo, sex, stepDiff } = filterParams;

        let props = {
            'test_mode':TEST_MODE,
            'sex': sex,
            'group_id':id,
            'sort':0,
            'count':1000,
            'has_photo':1,
            'fields':'photo_max,photo_max_orig,status,city,relation,bdate,sex',
            'https':APP_HTTPS
        };

        if (stepDiff == 1) {
            props['sort'] = 0;
            props['online'] = 1;
        } else if( stepDiff == 2 ) {
            props['sort'] = 0;
            props['online'] = 0;
        } else if ( stepDiff == 3 ) {
            props['sort'] = 1;
            props['online'] = 1;
        } else if ( stepDiff == 4 ) {
            props['sort'] = 1;
            props['online'] = 0;
        }

        if (ageFrom) {
            props['age_from'] = ageFrom
        }
        if (ageTo && ageTo >= ageFrom) {
            props['age_to'] = ageTo
        }

        console.log('LOAD '+stepDiff);

        if (stepDiff == 1) {
            dispatch({
                type: START_SEARCH,
                payload: true
            });
        }

        VK.api("users.search", props, function (data) {
            if (data.response) {
                if (stepDiff == 1) {
                    dispatch({
                        type: SEARCH_PART,
                        payload: data.response
                    });
                } else {
                    dispatch({
                        type: SEARCH_PART_NEXT,
                        payload: data.response,
                        stepDiff: stepDiff
                    });
                }
            } else {
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


export function dropAvatar() {
    return (dispatch) => {
        dispatch({
            type: DROP_AVATAR,
            payload: true
        });
    }
}

export function avatarLoaded() {
    return (dispatch) => {
        dispatch({
            type: AVATAR_LOADED,
            payload: true
        });
    }
}

export function avatarError() {
    return (dispatch) => {
        dispatch({
            type: AVATAR_ERROR,
            payload: true
        });
    }
}