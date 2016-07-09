import React, {PropTypes, Component} from 'react'
var classNames = require('classnames');
import {connect} from 'react-redux'
import {browserHistory, Link} from 'react-router'
import {startSearch, likeThis, skipThis} from '../actions/GroupViewActions'
import '../style/GroupView.scss'


export class GroupView extends Component {

    componentDidMount() {
        if (!this.props.selectedGroup || !this.props.selectedGroup.name) {
            browserHistory.push('/');
        } else {
            this.props.startSearch(this.props.filter, this.props.selectedGroup);
        }
        this.setState( {offset:0} );
    }

    goToFilter() {
        browserHistory.push('/filter');
    }

    goToGroup() {
        browserHistory.push('/');
    }

    getNotFound() {
        return ( <div className="GroupView__404">К сожалению с этим настройками поиска ничего не найдено (</div> )
    }

    getEndUsers() {
        return ( <div className="GroupView__end">Вы просмотрели всех пользователей</div> )
    }

    getInSearch() {
        return ( <div className="GroupView__end">Подождите, мы ищем пользователей</div> )
    }

    like(user) {
        this.props.likeThis(user);
    }
    
    skip(user) {
        this.props.skipThis(user);
    }

    show(user) {
        var win = window.open('https://vk.com/id'+user.id, '_blank');
        win.focus();
    }
    
    getUserView(list, inSearch) {
        console.log(['call get users view', list, inSearch]);
        if (!inSearch) {
            if (!list.count) {
                return this.getNotFound();
            } else {
                let items = list.items;
                let offset = this.props.filter.offset;
                if (offset < items.length) {
                    let user = items[offset];
                    return (<div className="GrpupView__center">
                        <div className="GroupView__photo-wrapper">
                            <img src={user.photo_max_orig}/>
                        </div>
                        <div className="GroupView__about-box">
                            <div>
                                <div className="name">{user.first_name} {user.last_name}</div>
                                <div className="about">21 год, Москва, В активном поиске</div>
                            </div>
                            <div>

                            </div>
                        </div>
                        <div className="GroupView__like-box">
                            <div onClick={this.skip.bind(this, user)} title="Пропустить" className="skip icon"></div>
                            <div onClick={this.show.bind(this, user)} title="Открыть профиль" className="page icon"></div>
                            <div onClick={this.like.bind(this, user)} title="Лайк" className="like icon"></div>
                        </div>
                    </div>)
                } else {
                    return this.getEndUsers();
                }
            }
        } else {
            return this.getInSearch();
        }
    }

    render() {
        const {photo_100, name} = this.props.selectedGroup;
        let {filter} = this.props;
        let {
            inSearch,
            founded,
            searchError
        } = filter;
        let filterText = [];
        if (filter.sex == 1) {
            filterText.push('Женщины');
        } else {
            filterText.push('Мужчины');
        }
        if (filter.ageFrom) {
            filterText.push('от ' + filter.ageFrom);
        }
        if (filter.ageTo) {
            filterText.push('до ' + filter.ageTo);
        }
        filterText = filterText.join(' ');
        let loaderClass = classNames({
            'ui inverted dimmer': true,
            'active': ( inSearch )
        });

        return (<div className="GroupView">
            <div className="GroupView__header">
                <div className="image-wrapper">
                    <img src={photo_100}/>
                </div>
                <div className="text">{name}</div>
                <div className="fg1"></div>
                <div className="gray">{ filterText }</div>
                <span className="edit-icon icon" onClick={this.goToFilter.bind(this)}/>
                <button onClick={this.goToGroup.bind(this)} className="btn">Сменить группу</button>
            </div>
            <div className="GroupView__wrapper">
                {this.getUserView(founded, inSearch)}
            </div>
            <div className={loaderClass}>
                <div className="ui loader"></div>
            </div>
        </div>)
    }
}

GroupView.propTypes = {
    selectedGroup: PropTypes.object.isRequired,
    filter: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        selectedGroup: state.selectedGroup,
        filter: state.filter
    }
}

export default connect(mapStateToProps, {startSearch, likeThis, skipThis})(GroupView)
