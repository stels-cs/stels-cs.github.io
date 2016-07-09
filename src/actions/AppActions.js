import {
    APP_START,
    TEST_MODE
} from '../constants/App'

import {
    START_LOAD_GROUPS,
    ERROR_LOAD_GROUPS,
    SUCCESS_LOAD_GROUPS
} from '../constants/GroupList'

export function appStart() {
    return (dispatch) => {
        VK.init(function () {
            console.log('VK API Init successful');
            dispatch({
                type: APP_START,
                payload: true
            });

            dispatch({
                type: START_LOAD_GROUPS,
                payload: true
            });

            VK.api("groups.get", {"extended": 1, "test_mode":TEST_MODE, "fields":'members_count', 'count':1000, 'lang':'ru'}, function (data) {
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
