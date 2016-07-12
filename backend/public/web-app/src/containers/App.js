import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import User from '../components/User'
import '../style/App.scss'
import { appStart } from '../actions/AppActions'

export class App extends Component {

    componentDidMount() {
        this.props.appStart();
    }

    render() {
        const {children} = this.props;
        return (<div className="App">
            <User />
            <div className="App__wrapper">
                {children}
            </div>
        </div>);
    }
}

function mapStateToProps(state) {
    return {
        groupList: state.groupList
    }
}


App.propTypes = {
    children: PropTypes.node
};

export default connect(mapStateToProps, { appStart })(App)