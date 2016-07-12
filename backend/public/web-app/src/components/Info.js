import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {browserHistory, Link} from 'react-router'
import '../style/Stat.scss'

import {share} from '../tools/share';

export class Info extends Component {

    wallPost() {
        share();
    }

    goToGroup() {
        browserHistory.push('/group-list');
    }

    buildPars(photo, matchedUsers) {
        return [];
    }

    getNumEnding(iNumber, aEndings) {
        var sEnding, i;
        iNumber = iNumber % 100;
        if (iNumber >= 11 && iNumber <= 19) {
            sEnding = aEndings[2];
        }
        else {
            i = iNumber % 10;
            switch (i) {
                case (1):
                    sEnding = aEndings[0];
                    break;
                case (2):
                case (3):
                case (4):
                    sEnding = aEndings[1];
                    break;
                default:
                    sEnding = aEndings[2];
            }
        }
        return sEnding;
    }

    render() {
        return <div className="Stat">
            <div className="header">
                <span>Поддержка</span>
                <button onClick={this.goToGroup.bind(this)} className="btn">Назад</button>
            </div>
            <div className="wrapper">
                <p>По любым вопросам пишите на stels-cs@yandex.ru или <a target="_blank" href="https://vk.com/stelscs">мне</a></p>
            </div>
        </div>
    }
}

Info.propTypes = {

};

function mapStateToProps() {
    return {

    }
}

export default connect(mapStateToProps, {})(Info)