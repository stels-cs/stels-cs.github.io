import {
 CHOOSE_GROUP
} from '../constants/GroupList'

const initialState = {};

export default function selectedGroup(state = initialState, action) {

    switch (action.type) {
        case CHOOSE_GROUP:
                return action.payload;
            break;
        default:
            return state;
    }

}