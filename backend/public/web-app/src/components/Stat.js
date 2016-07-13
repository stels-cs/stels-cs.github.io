import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {browserHistory, Link} from 'react-router'
var classNames = require('classnames');
import { UserView } from './UserView'
import { startLoadUser } from '../actions/GroupViewActions'
import '../style/Stat.scss'
import {share} from '../tools/share';

export class Stat extends Component {

    wallPost() {
        share();
    }

    goToGroup() {
        browserHistory.push('/group-list');
    }

    buildPars(photo, matchedUsers) {
        return [];
    }

    getNumEnding(iNumber, aEndings) {
        var sEnding, i;
        iNumber = iNumber % 100;
        if (iNumber >= 11 && iNumber <= 19) {
            sEnding = aEndings[2];
        }
        else {
            i = iNumber % 10;
            switch (i) {
                case (1):
                    sEnding = aEndings[0];
                    break;
                case (2):
                case (3):
                case (4):
                    sEnding = aEndings[1];
                    break;
                default:
                    sEnding = aEndings[2];
            }
        }
        return sEnding;
    }

    getUserView(user, key) {
        return (<UserView user={user} key={key} />);
    }

    getFakeView(key) {
        return (<UserView user={false} key={key} />);
    }

    preloadUsers() {
        const { stat, userRepo } = this.props;
        const { matchedUsers } = stat;
        if (matchedUsers.length) {
            for (let i = 0; i < matchedUsers.length; i++) {
                let userId = matchedUsers[i];
                if (userRepo.users[userId]) {

                } else {
                    if (typeof userRepo.users[userId] == 'undefined') {
                        this.props.startLoadUser(userId);
                    }
                }
            }
        }
    }

    componentWillReceiveProps() {
        this.preloadUsers();
    }

    componentDidUpdate() {
        this.preloadUsers();
    }

    componentDidMount() {
        this.preloadUsers();
    }

    render() {
        let uLoaded = this.props.user.loaded;
        let sLoaded = this.props.stat.loaded;
        const {selected, matched, selectedMe, matchedUsers} = this.props.stat;
        const { userRepo } = this.props;
        const selectedEnds = this.getNumEnding(selected, ['человек', 'человека', 'человек']);
        const selectedMeEnds = this.getNumEnding(selectedMe, ['человеку', 'пользователям', 'пользователям']);
        let matchedShow = classNames({
            'hidden': ((matched == 0) || !uLoaded || !sLoaded )
        });
        let matchedStatShow = classNames({
            'hidden': ((matched == 0) || !uLoaded || !sLoaded )
        });
        let helpShow = classNames({
            'help': true,
            'hidden': ((matched > 0) || !uLoaded || !sLoaded )
        });
        let loaderClass = classNames({
            'ui inverted dimmer': true,
            'active': ( !uLoaded || !sLoaded )
        });

        let userList = [];
        for(let i = 0; i < matchedUsers.length; i++) {
            let userId = matchedUsers[i];
            if (userRepo.users[userId]) {
                userList.push( this.getUserView(userRepo.users[userId], i) );
            } else {
                userList.push( this.getFakeView( i ) );
            }
        }

        return <div className="Stat">
            <div className="header">
                <span>Статистика</span>
                <button onClick={this.goToGroup.bind(this)} className="btn">Назад</button>
            </div>
            <div className="wrapper">
                <div className="stat">Вам понравилось {selected} {selectedEnds}</div>
                <div className="stat">Вы понравились {selectedMe} {selectedMeEnds}</div>
                <div className={matchedStatShow}>Пары {matched}</div>
                <div className={matchedShow}>
                    <br />
                    <div className="ParList">
                        {userList}
                    </div>
                </div>
                <div className={helpShow}>
                    <p>Не расстраивайтесь, мы пришлем вам уведомления, как только у вас появится пара.
                        Чтобы это скорей произошло, расскажите об этом приложении своим друзьям.</p>
                    <button className="btn" onClick={this.wallPost.bind(this)}>Рассказать друзьям</button>
                </div>
            </div>
            <div className={loaderClass}>
                <div className="ui loader"></div>
            </div>
        </div>
    }
}

Stat.propTypes = {
    user: PropTypes.object.isRequired,
    stat: PropTypes.object.isRequired,
    userRepo: PropTypes.object.isRequired,
    startLoadUser: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        user: state.user,
        stat: state.stat,
        userRepo: state.userRepo
    }
}

export default connect(mapStateToProps, { startLoadUser })(Stat)