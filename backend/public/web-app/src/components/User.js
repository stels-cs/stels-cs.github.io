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
        let { matched, watched_ids, matchedUsers, selectedMe } = this.props.stat;
        let sLoaded = this.props.stat.loaded;
        let statClass = classNames({
            'stat ss': true,
            'hidden': !sLoaded
        });
        if (matched > 0) {
            matched = '(' + matched + ')';
        } else {
            matched = '';
        }

        let x = watched_ids.concat(matchedUsers);
        x = x.filter( (item, pos) => { return x.indexOf(item) == pos } );
        let showMoreWatchBox = selectedMe > x.length;

        let anonClass = classNames({
            'stat ss': true,
            'hidden': !showMoreWatchBox
        });

        return <div className="User">
            <div onClick={this.goToStat.bind(this)} >
                <span className={statClass}>Мои пары {matched}</span>
                <span className={anonClass}>Мои поклонники +{selectedMe - x.length}</span>
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