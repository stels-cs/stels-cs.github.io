import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import '../style/UserView.scss'

export class UserView extends Component {

    openUser(user) {
        if (user) {
            let url = 'https://vk.com/id' + user.id;
            let win = window.open(url, '_blank');
            win.focus();
        }
    }

    render() {
        const { user } = this.props;
        
        let avatar, name;
        if (user) {
            avatar = (<img src={user.photo_max_orig} />);
            name = user.first_name + ' ' + user.last_name;
        } else {
            avatar = (<div className="UserView__fake-avatar"></div>);
            name = (<span className="UserView__fake-name"></span>);
        }

        return (<div onClick={this.openUser.bind(this, user)} className="UserView">
            <div className="UserView__you">ВЫ</div>
            <div className="UserView__plus">+</div>
            <div className="UserView__user">
                {avatar}
            </div>
            <div className="UserView__name">
                {name}
            </div>
        </div>)
    }
}

UserView.propTypes = {

};