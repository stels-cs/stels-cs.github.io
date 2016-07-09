import {

} from '../constants/User'

const initialState = {
    loaded: false,
    first_name: '',
    photo_100: '',
    sex: 1
};

export default function filter(state = initialState, action) {

    switch (action.type) {
        default:
            return state;
    }

}