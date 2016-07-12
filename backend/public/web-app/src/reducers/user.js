import {
    VK_PROFILE_LOADED
} from '../constants/App'

const initialState = {
    loaded: false,
    first_name: '',
    photo_100: '',
    sex: 1
};

export default function filter(state = initialState, action) {

    switch (action.type) {
        case VK_PROFILE_LOADED:
            return Object.assign({}, action.payload, {loaded:true});
        default:
            return state;
    }

}