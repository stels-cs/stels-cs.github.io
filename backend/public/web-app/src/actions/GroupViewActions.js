import {
    SEARCH_PART,
    SEARCH_ERROR,
    START_SEARCH,
    LIKE,
    SKIP,
    SEARCH_PART_NEXT,
    DROP_AVATAR,
    AVATAR_LOADED,
    AVATAR_ERROR,
    LOCK_LIKE,
    UNLOCK_LIKE,
    INCREMENT_SEARCH,
    CLOSE_NEW_MATCHED
} from '../constants/GroupView'

import {
    TEST_MODE,
    APP_HTTPS,
    APP_VIEWER_ID,
    APP_AUTH_KEY,
    APP_UPDATE_PROFILE,
    API_ERROR,
    START_LOAD_USER,
    NEW_USER_LOADED
} from '../constants/App'

import {api} from '../tools/api';

function userActions(dispatch, type, targetId) {
    api(type, {
        'target_id': targetId,
        'viewer_id': APP_VIEWER_ID,
        'auth_key': APP_AUTH_KEY
    }, function (data) {
        dispatch({
            type: APP_UPDATE_PROFILE,
            payload: data
        });
    }, function (data) {
        if (data.server) {
            setTimeout(() => {
                userActions(dispatch, type, targetId);
            }, 1000);
        } else {
            dispatch({
                type: API_ERROR,
                payload: type
            });
        }
    });
}


export function startSearch(filterParams, selectedGroup, skipIds) {
    return (dispatch) => {

        const {id} = selectedGroup;
        const {ageFrom, ageTo, sex, stepDiff} = filterParams;

        let props = {
            'test_mode': TEST_MODE,
            'sex': sex,
            'group_id': id,
            'sort': 0,
            'count': 1000,
            'has_photo': 1,
            'fields': 'photo_max,photo_max_orig,status,city,relation,bdate,sex',
            'https': APP_HTTPS
        };

        if (stepDiff == 1) {
            props['sort'] = 0;
            props['online'] = 1;
        } else if (stepDiff == 2) {
            props['sort'] = 0;
            props['online'] = 0;
        } else if (stepDiff == 3) {
            props['sort'] = 1;
            props['online'] = 1;
        } else if (stepDiff == 4) {
            props['sort'] = 1;
            props['online'] = 0;
        }

        if (ageFrom) {
            props['age_from'] = ageFrom
        }
        if (ageTo && ageTo >= ageFrom) {
            props['age_to'] = ageTo
        }
        
        if (stepDiff == 1) {
            dispatch({
                type: START_SEARCH,
                payload: true
            });
        } else {
            dispatch({
                type: INCREMENT_SEARCH,
                payload: true
            });
        }

        VK.api("users.search", props, function (data) {
            if (data.response) {
                let clearItems = [];
                for (var i = 0; i < data.response.items.length; i++) {
                    let user = data.response.items[i];
                    if (skipIds.indexOf(user.id) == -1) {
                        clearItems.push(user);
                    }
                }
                data.response.items = clearItems;
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

function lockLike(dispatch) {
    dispatch({
        type: LOCK_LIKE,
        payload: true
    });
    setTimeout(() => {
        dispatch({
            type: UNLOCK_LIKE,
            payload: true
        });
    }, 300);
}

export function likeThis(user) {
    return (dispatch) => {
        lockLike(dispatch);
        userActions(dispatch, 'like', user.id);
        dispatch({
            type: LIKE,
            payload: user
        });
    }
}

export function skipThis(user) {
    return (dispatch) => {
        lockLike(dispatch);
        userActions(dispatch, 'skip', user.id);
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

export function loadToPool() {
    return (dispatch) => {
        // dispatch({
        //     type: AVATAR_ERROR,
        //     payload: true
        // });
    }
}

export function closeSync() {
    return (dispatch) => {
        dispatch({
            type: CLOSE_NEW_MATCHED,
            payload: true
        });
    }
}

function loadUser(dispatch, userId) {
    let props = {
        'user_ids': userId,
        'fields': 'photo_max,photo_max_orig,status,city,relation,bdate,sex',
        'https': APP_HTTPS,
        'test_mode': TEST_MODE
    };
    VK.api("users.get", props, function (data) {
        if (data.response) {
            dispatch({
                type: NEW_USER_LOADED,
                payload: data.response[0]
            });
        } else {
            setTimeout( () => { loadUser(dispatch, userId); }, 1000 );
        }
    });
}

export function startLoadUser(userId) {
    return (dispatch) => {
        dispatch({
            type: START_LOAD_USER,
            payload: userId
        });

        loadUser(dispatch, userId);
    }
}