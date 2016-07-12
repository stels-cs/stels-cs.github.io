import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {browserHistory, Link} from 'react-router'
import { startLoadUser } from '../actions/GroupViewActions'
var classNames = require('classnames');
import { UserView } from './UserView'
import '../style/Stat.scss'
import {share} from '../tools/share';

export class Welcome extends Component {

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
        const selectedMeEnds = this.getNumEnding(selectedMe, ['человек', 'человека', 'человек']);
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
                <span>Pinder</span>
            </div>
            <div className="wrapper">
                <p>
                    Pinder - это классный способ знакомиться с интересными людьми в сообществах ВКонтакте. Нажмите <span
                    className="heart-icon icon"></span>, что поставить пользователю "нравится", или <span
                    className="skip-icon icon"></span> его, чтобы проигнорировать. Если вы тоже кому-то понравитесь, то
                    считайте, что вы пара!
                </p>
                <div className="text-center">
                    <button onClick={this.goToGroup.bind(this)} className="btn">Начать</button>
                </div>
                <div style={ {marginTop: '10px'} } className={matchedShow}>
                    У вас уже есть пары!<br />
                    <div className="ParList" style={ {maxHeight: '400px', marginTop: '10px'} }>
                        {userList}
                    </div>
                </div>
            </div>
        </div>
    }
}

Welcome.propTypes = {
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

export default connect(mapStateToProps, { startLoadUser })(Welcome)