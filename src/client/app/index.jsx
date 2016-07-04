import React from 'react';
import {render} from 'react-dom';
import GroupList from './GroupList.jsx';

class App extends React.Component {
    render () {
        return (
            <div className="ui middle aligned center aligned grid">
                <div className="column">
                    <h2 className="ui teal image header">
                        <div className="content">
                            Like Tinder
                        </div>
                    </h2>
                    <GroupList />
                </div>
            </div>
        );
    }
}

render(<App/>, document.getElementById('app'));