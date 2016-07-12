import groupList from './groupList'
import selectedGroup from './selectedGroup'
import filter from './filter'
import user from './user'
import stat from './stat'
import userRepo from './userRepo'
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

export default combineReducers({
    groupList,
    selectedGroup,
    filter,
    routing,
    user,
    stat,
    userRepo
})