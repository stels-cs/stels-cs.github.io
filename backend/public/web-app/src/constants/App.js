export const APP_START = 'APP_START';
export const TEST_MODE = 1;
export const APP_HTTPS = (window.location.protocol == 'https:') ? 1 : 0;
export const PROFILE_LOADED = 'PROFILE_LOADED';
export const API_ERROR = 'API_ERROR';

let appParams = window.location.search;
appParams = appParams.split('&');
let getParams = {};
for(let i = 0; i < appParams.length; i++) {
    let param = appParams[i];
    param = param.split('=');
    if (param.length == 2) {
        getParams[param[0]] = param[1];
    }
}

const { viewer_id, auth_key } = getParams;

export const APP_VIEWER_ID = viewer_id;
export const APP_AUTH_KEY = auth_key;
export const VK_PROFILE_LOADED = 'VK_PROFILE_LOADED';
export const APP_UPDATE_PROFILE = 'APP_UPDATE_PROFILE';
export const START_LOAD_USER = 'START_LOAD_USER';
export const NEW_USER_LOADED = 'NEW_USER_LOADED';
