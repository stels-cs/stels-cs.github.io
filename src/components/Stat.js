import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {browserHistory, Link} from 'react-router'
var classNames = require('classnames');
import '../style/Stat.scss'

export class Stat extends Component {

    wallPost() {

    }

    goToGroup() {
        browserHistory.push('/');
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

    render() {
        let uLoaded = this.props.user.loaded;
        let sLoaded = this.props.stat.loaded;
        const {photo_200} = this.props.user;
        const {selected, matched, selectedMe, matchedUsers} = this.props.stat;
        const selectedEnds = this.getNumEnding(selected, ['человек', 'человека', 'человек']);
        const selectedMeEnds = this.getNumEnding(selectedMe, ['человек', 'человека', 'человек']);
        let matchedShow = classNames({
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
        return <div className="Stat">
            <div className="header">
                <span>Статистика</span>
                <button onClick={this.goToGroup.bind(this)} className="btn">Назад</button>
            </div>
            <div className="wrapper">
                <div className="stat">Вы лайкнули {selected} {selectedEnds}</div>
                <div className="stat">Вас лайкнули {selectedMe} {selectedMeEnds}</div>
                <div className="stat">Пары {matched}</div>
                <div className={matchedShow}>
                    <div className="stat">Пары</div>
                    {this.buildPars(photo_200, matchedUsers)}
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
    userRepo: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        user: state.user,
        stat: state.stat,
        userRepo: state.userRepo
    }
}

export default connect(mapStateToProps, {})(Stat)