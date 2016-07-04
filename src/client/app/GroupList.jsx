import React from 'react';

import classNames from 'classnames';

import 'sass/components/Tools'

class GroupList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inLoading:true
        };
        setTimeout( () => { this.setState({'inLoading': false}); }, 2000 );
    }

    render() {
        var loaderClass = classNames({
            'ui dimmer': true,
            'active': this.state.inLoading
        });
        var mokImage = classNames({
            'x-hidden': !this.state.inLoading
        });
        return (
            <div className="ui segment">
                <img className={mokImage} src="img/paragraph.png" />
                <p></p>
                <div className={loaderClass}>
                    <div className="ui loader"></div>
                </div>
            </div>
        );
    }

}

export default GroupList;