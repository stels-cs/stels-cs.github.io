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
        const { user, noMe } = this.props;
        
        let avatar, name;
        if (user) {
            avatar = (<img src={user.photo_max_orig} />);
            name = user.first_name + ' ' + user.last_name;
        } else {
            avatar = (<div className="UserView__fake-avatar"></div>);
            name = (<span className="UserView__fake-name"></span>);
        }

        let uStyle = {};
        if (noMe) {
            uStyle.justifyContent = 'flex-start';
        }

        return (<div onClick={this.openUser.bind(this, user)} style={uStyle} className="UserView">
            { !noMe ? <div className="UserView__you">ВЫ</div> : null }
            { !noMe ? <div className="UserView__plus">+</div> : null }
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