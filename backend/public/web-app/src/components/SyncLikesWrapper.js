import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {browserHistory, Link} from 'react-router'
import { UserView } from './UserView'
var classNames = require('classnames');
import '../style/SyncLikesWrapper.scss'

export class SyncLikesWrapper extends Component {

    getUserView(user, key) {
        return (<UserView user={user} key={key} />);
    }

    getFakeView(key) {
        return (<UserView user={false} key={key} />);
    }

    componentWillReceiveProps() {
        const { stat, userRepo } = this.props;
        const { hasNewMatched, newMatchedIds } = stat;
        if (newMatchedIds.length && hasNewMatched) {
            for (let i = 0; i < newMatchedIds.length; i++) {
                let userId = newMatchedIds[i];
                if (userRepo.users[userId]) {

                } else {
                    this.props.startLoadUser(userId);
                }
            }
        }
    }

    componentDidUpdate() {
        const { stat, userRepo } = this.props;
        const { hasNewMatched, newMatchedIds } = stat;
        if (newMatchedIds.length && hasNewMatched) {
            for (let i = 0; i < newMatchedIds.length; i++) {
                let userId = newMatchedIds[i];
                if (userRepo.users[userId]) {

                } else {
                    this.props.startLoadUser(userId);
                }
            }
        }
    }

    render() {
        const { stat, userRepo } = this.props;
        const { hasNewMatched, newMatchedIds } = stat;

        let boxClass = classNames({
            'SyncLikesWrapper': true,
            'hidden': !hasNewMatched
        });

        let userList = [];
        for(let i = 0; i < newMatchedIds.length; i++) {
            let userId = newMatchedIds[i];
            if (userRepo.users[userId]) {
                userList.push( this.getUserView(userRepo.users[userId], i) );
            } else {
                userList.push( this.getFakeView( i ) );
            }
        }
        
        let title = userList.length == 1 ? 'У вас новая пара' : 'Новые пары';

        return (<div className={boxClass}>
            <div onClick={this.closeSyncLike.bind(this)} className="wrapper">
                <div onClick={ (e) => { e.stopPropagation(); } } className="window">
                    <div className="header">
                        <span>{title}</span>
                        <span className="close-icon" onClick={this.closeSyncLike.bind(this)}></span>
                    </div>
                    <div className="window-wrapper">
                        {userList}
                    </div>
                </div>
            </div>
        </div>)
    }

    closeSyncLike() {
        this.props.onClose();
    }
}

SyncLikesWrapper.propTypes = {
    stat: PropTypes.object.isRequired,
    userRepo: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    startLoadUser: PropTypes.func.isRequired
};