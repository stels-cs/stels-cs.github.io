import React, {PropTypes, Component} from 'react'
import GroupItem from './GroupItem'
var classNames = require('classnames');
import { connect } from 'react-redux'
import { loadGroups, chooseGroup } from '../actions/GroupListActions'
import '../style/GroupList.scss'

export class GroupList extends Component {

    componentDidMount() {
        this.props.loadGroups();
    }

    render() {
        let loaderClass = classNames({
            'ui inverted dimmer': true,
            'active': !this.props.groupList.loaded
        });
        var list = [];
        if (!this.props.groupList.loaded) {
            for (let i = 0; i < 5; i++) {
                var data = {};
                list.push(<GroupItem isFake={true} onChoose={function () {}} data={data} key={i} />);
            }
        } else {
            for (let i = 0; i < this.props.groupList.items.length; i++) {
                list.push(<GroupItem isFake={false} onChoose={this.props.chooseGroup} key={i} data={ this.props.groupList.items[i] }/>)
            }
        }
        return (<div className="GroupList">
            <div className="GroupList__header-box">
                <div className="GroupList__header">Выберите группу</div>
            </div>
            <div className="GroupList__wrapper">
                {list}
            </div>
            <div className={loaderClass}>
                <div className="ui loader"></div>
            </div>
        </div>)
    }
}

GroupList.propTypes = {
    groupList: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        groupList: state.groupList
    }
}

export default connect(mapStateToProps, { loadGroups, chooseGroup })(GroupList)