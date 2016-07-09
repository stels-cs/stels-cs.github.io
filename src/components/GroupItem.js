import React, {PropTypes, Component} from 'react'
var classNames = require('classnames');
import { browserHistory, Link } from 'react-router'
import { chooseGroup } from '../actions/GroupListActions'
import { connect } from 'react-redux'
import '../style/FakeMenuItem.scss'
import '../style/GroupItem.scss'

export default class GroupItem extends Component {
    componentDidMount() {

    }

    onSelectGroup(group) {
        this.props.chooseGroup(group);
        browserHistory.push(`/filter`);
    }

    render() {
        if (this.props.isFake) {
            var fakeClass = classNames([
                'FakeMenuItem',
                'FakeMenuItem__w' + (([40, 20, 10, 16, 3])[(Math.floor(Math.random() * 4))])
            ]);
            return (<div className="GroupItem">
                <div className="GroupItem__wrapper">
                    <div className="GroupItem__content">
                        <div className="GroupItem__photo-wrapper">
                            <div className="GroupItem__fake-image"></div>
                        </div>
                        <div className="GroupItem__name">
                            <div className={fakeClass}></div>
                        </div>
                    </div>
                </div>
            </div>)
        } else {
            return (
            <div className="GroupItem" onClick={ () => { this.onSelectGroup(this.props.data) } }>
                <div className="GroupItem__wrapper">
                    <div className="GroupItem__content">
                        <div className="GroupItem__photo-wrapper">
                            <img className="" src={this.props.data.photo_100}/>
                        </div>
                        <div className="GroupItem__name">
                            {this.props.data.name}
                        </div>
                    </div>
                </div>
            </div>)
        }
    }
}

GroupItem.propTypes = {
    isFake: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired
};

export default connect(() => { return {} }, {
    chooseGroup
})(GroupItem)