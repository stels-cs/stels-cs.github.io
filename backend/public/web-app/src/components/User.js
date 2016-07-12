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
        const { matched} = this.props.stat;
        let sLoaded = this.props.stat.loaded;
        let statClass = classNames({
            'stat ss': true,
            'hidden': !sLoaded
        });
        return <div className="User">
            <div onClick={this.goToStat.bind(this)} >
                <span className={statClass}>Моя статистика({matched})</span>
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