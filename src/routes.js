import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import GroupList from './components/GroupList'
import GroupView from './components/GroupView'
import Stat from './components/Stat'
import FilterSettings from './components/FilterSettings'

export default (
    <Route path="/" component={App}>
        <IndexRoute component={GroupList} />
        <Route path="/group"
               component={GroupView} />
        <Route path="/filter"
               component={FilterSettings} />
        <Route path="/stat"
               component={Stat} />
    </Route>
)        
