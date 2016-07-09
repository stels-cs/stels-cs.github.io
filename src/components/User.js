import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
var classNames = require('classnames');
import '../style/User.scss'

export  class User extends Component {
    goToStat() {
        browserHistory.push('/stat');
    }
    render() {
        const { first_name } = this.props.user;
        const { selected, matched } = this.props.stat;
        let uLoaded = this.props.user.loaded;
        let sLoaded = this.props.stat.loaded;

        let userClass = classNames({
            'user ss': true,
            'hidden': !uLoaded
        });
        let statClass = classNames({
            'stat ss':true,
            'hidden': !sLoaded
        });
        return <div onClick={this.goToStat.bind(this)} className="User">
            <span className="logo sl">Pinder</span>
            <span className={userClass}>Привет {first_name}</span>
            <span className={statClass}>{selected}/{matched}</span>
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

export default connect(mapStateToProps, {  })(User)