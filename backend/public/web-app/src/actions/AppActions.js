import {
    APP_START,
    TEST_MODE,
    APP_HTTPS,
    PROFILE_LOADED,
    API_ERROR,
    APP_VIEWER_ID,
    APP_AUTH_KEY,
    VK_PROFILE_LOADED
} from '../constants/App'

import {
    START_LOAD_GROUPS,
    ERROR_LOAD_GROUPS,
    SUCCESS_LOAD_GROUPS
} from '../constants/GroupList'

import { api } from '../tools/api';

function loadUserSettings(dispatch) {
    api('me', {
        'viewer_id':APP_VIEWER_ID,
        'auth_key':APP_AUTH_KEY
    }, function (data) {
        dispatch({
            type: PROFILE_LOADED,
            payload: data
        });
    }, function (data) {
        if (data.server) {
            setTimeout( () => { loadUserSettings(dispatch); }, 500 );
        } else {
            dispatch({
                type: API_ERROR,
                payload: 'me'
            });
        }
    });
}

function loadVkUserSettings(dispatch) {
    VK.api("users.get", {"test_mode":TEST_MODE, 'https':APP_HTTPS, 'fields':"sex,photo_max_orig,photo_max,photo_100"}, function (data) {
        if (data.response) {
            dispatch({
                type: VK_PROFILE_LOADED,
                payload: data.response[0]
            });
        } else {
            setTimeout( () => { loadVkUserSettings(dispatch); }, 1000 );
        }
    });
}

export function appStart() {
    return (dispatch) => {
        loadUserSettings(dispatch);
        loadVkUserSettings(dispatch);
        VK.init(function () {
            dispatch({
                type: APP_START,
                payload: true
            });

            dispatch({
                type: START_LOAD_GROUPS,
                payload: true
            });

            VK.api("groups.get", {"extended": 1, "test_mode":TEST_MODE, "fields":'members_count', 'count':1000, 'lang':'ru', 'https':APP_HTTPS}, function (data) {
                if (data.response) {
                    dispatch({
                        type: SUCCESS_LOAD_GROUPS,
                        payload: data.response
                    });
                } else {
                    dispatch({
                        type: ERROR_LOAD_GROUPS,
                        payload: true
                    });
                }
            });

        }, function () {
            alert('Ошибка загрузки приложения, перезагрузите страницу');
        }, '5.52');

    }
}
