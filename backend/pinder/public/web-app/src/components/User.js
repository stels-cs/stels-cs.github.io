import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {browserHistory, Link} from 'react-router'
var classNames = require('classnames');
import '../style/User.scss'

export class User extends Component {
    goToStat() {
        browserHistory.push('/stat');
    }
    
    goToInfo() {
        browserHistory.push('/info');
    }

    render() {
        const {first_name} = this.props.user;
        const {selected, matched} = this.props.stat;
        let uLoaded = this.props.user.loaded;
        let sLoaded = this.props.stat.loaded;

        let userClass = classNames({
            'user sl': true,
            'hidden': !uLoaded
        });
        let statClass = classNames({
            'stat ss': true,
            'hidden': !sLoaded
        });
        return <div className="User">
            <div onClick={this.goToStat.bind(this)} >
                <span className={userClass}>Привет {first_name}</span>
                <span className={statClass}>{selected}/{matched} Моя статистика</span>
            </div>
            <div>
                <span onClick={ this.goToInfo.bind(this) }>Поддержка</span>
            </div>
        </div>
    }
}

User.propTypes = {
    user: PropTypes.object.isRequired,
    stat: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        user: state.user,
        stat: state.stat
    }
}

export default connect(mapStateToProps, {})(User)