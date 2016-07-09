import {

} from '../constants/UserRepo'

const initialState = {
    users: [],
    loading: false
};

export default function userRepo(state = initialState, action) {

    switch (action.type) {
        default:
            return state;
    }

}