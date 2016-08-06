import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {browserHistory, Link} from 'react-router'
var classNames = require('classnames');
import { UserView } from './UserView'
import { startLoadUser } from '../actions/GroupViewActions'
import { updateUserSettings } from '../actions/AppActions'
import '../style/Stat.scss'
import {share} from '../tools/share';

export class Stat extends Component {

    constructor(props) {
        super(props);
        this.state = {showUpdate:false, inLoad:false};
    }

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

    getUserView(user, key, noMe = false) {
        return (<UserView user={user} key={key} noMe={noMe} />);
    }

    getFakeView(key, noMe = false) {
        return (<UserView user={false} key={key} noMe={noMe} />);
    }

    showPayment() {
        var params = {
            type: 'item',
            item: 'item1'
        };
        VK.callMethod('showOrderBox', params);
    }

    preloadUsers() {
        const { stat, userRepo } = this.props;
        let { matchedUsers, watched_ids } = stat;
        matchedUsers = matchedUsers.concat(watched_ids);
        matchedUsers = matchedUsers.filter(function(item, pos) {
            return matchedUsers.indexOf(item) == pos;
        });
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
        VK.addCallback('onOrderSuccess', this.onOrderSuccess.bind(this));
    }

    componentWillUnmount() {
        VK.removeCallback('onOrderSuccess', this.onOrderSuccess.bind(this));
    }

    onOrderSuccess() {
        console.log('On oder success');
        this.props.updateUserSettings();
        this.setState( {showUpdate:true} );
    }

    updateWatchList() {
        if (!this.state.inLoad) {
            this.setState({showUpdate: true, inLoad: true});
            this.props.updateUserSettings();
        }
    }

    render() {
        let uLoaded = this.props.user.loaded;
        let sLoaded = this.props.stat.loaded;
        const {selected, matched, selectedMe, matchedUsers, watched_ids} = this.props.stat;
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

        let x = watched_ids.concat(matchedUsers);
        x = x.filter( (item, pos) => { return x.indexOf(item) == pos } );
        let showMoreWatchBox = selectedMe > x.length;

        let watched = [];
        for(let i = 0; i < x.length; i++) {
            let uId = x[i];
            if (userRepo.users[uId]) {
                watched.push( this.getUserView(userRepo.users[uId], i, true) );
            } else {
                watched.push( this.getFakeView( i, true ) );
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
                { watched.length ? <div>
                    <br />
                    <div className="ParList">
                        {watched}
                    </div>
                    <br />
                </div> : null }
                { (showMoreWatchBox && !this.state.showUpdate) ? <div onClick={ () => this.showPayment() } className="stat red pointer">Посмотреть кому { watched_ids.length ? "еще" : null } за 5 голосов</div> : null }
                { (this.state.showUpdate && (showMoreWatchBox)) ? <div><button onClick={this.updateWatchList.bind(this)} className="btn">{ this.state.inLoad ? 'Подождите...' : 'Обновить'}</button><br /></div> : null }
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
    startLoadUser: PropTypes.func.isRequired,
    updateUserSettings: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        user: state.user,
        stat: state.stat,
        userRepo: state.userRepo
    }
}

export default connect(mapStateToProps, { startLoadUser, updateUserSettings })(Stat)