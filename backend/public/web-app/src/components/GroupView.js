import React, {PropTypes, Component} from 'react'
var classNames = require('classnames');
import {connect} from 'react-redux'
import {browserHistory, Link} from 'react-router'
import {
    startSearch,
    likeThis,
    skipThis,
    dropAvatar,
    avatarLoaded,
    avatarError,
    loadToPool,
    closeSync,
    startLoadUser
} from '../actions/GroupViewActions'
import '../style/GroupView.scss'
import { SyncLikesWrapper } from './SyncLikesWrapper'
import {share} from '../tools/share';
export class GroupView extends Component {

    componentDidMount() {
        if (!this.props.selectedGroup || !this.props.selectedGroup.name) {
            browserHistory.push('/');
        } else {
            this.loadMore();
        }
        this.setState({offset: 0});
    }

    goToFilter() {
        browserHistory.push('/filter');
    }

    goToGroup() {
        browserHistory.push('/group-list');
    }

    makeWallPost() {
        share();
    }

    getNotFound() {
        return ( <div className="GroupView__404">
            <div className="text-center">
                <div>К сожалению, с этим настройками поиска ничего не найдено.</div>
                <br />
                <button onClick={(this.goToFilter.bind(this))} className="btn">Изменить настройки</button>
                <br />
                <br />
                <button onClick={(this.goToGroup.bind(this))} className="btn">Выбрать другую группу</button>
            </div>
        </div> )
    }

    getEndUsers() {
        return ( <div className="GroupView__end">
            <div className="text-center">
                <span>Вы просмотрели всех пользователей.</span><br />
                <br />
                <button onClick={(this.goToGroup.bind(this))} className="btn">Выбрать другую группу</button>
                <br />
                <br />
                <button onClick={(this.makeWallPost.bind(this))} className="btn">Рассказать друзьям</button>
                <br />
                <br />
                <span className="gray">Рассказывая друзьям об этом приложении,<br />вы увеличиваете свои шансы найти пару.</span>
            </div>
        </div>)
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

    getInSearch() {
        return ( <div className="GroupView__in-search">
            <div className="text-center">
                <div className="icon icon-wait"></div>
                <div>Подождите, мы ищем пользователей</div>
            </div>
        </div> )
    }

    loadMore() {
        if (this.props.filter.canLoadMore) {
            this.props.startSearch(this.props.filter, this.props.selectedGroup, this.props.stat.selectedIds);
        }
    }

    like(user) {
        if (!this.props.filter.lockLike) {
            this.props.dropAvatar();
            this.props.likeThis(user);
            this.loadMore();
        }
    }

    skip(user) {
        if (!this.props.filter.lockLike) {
            this.props.dropAvatar();
            this.props.skipThis(user);
            this.loadMore();
        }
    }

    show(user) {
        var win = window.open('https://vk.com/id' + user.id, '_blank');
        win.focus();
    }

    calculateAge(birthMonth, birthDay, birthYear) {
        let todayDate = new Date();
        let todayYear = todayDate.getFullYear();
        let todayMonth = todayDate.getMonth();
        let todayDay = todayDate.getDate();
        let age = todayYear - birthYear;

        if (todayMonth < birthMonth - 1) {
            age--;
        }

        if (birthMonth - 1 == todayMonth && todayDay < birthDay) {
            age--;
        }
        return age;
    }

    getMonth(month) {
        const map = {
            1: 'января',
            2: 'февраля',
            3: 'марта',
            4: 'апреля',
            5: 'мая',
            6: 'июня',
            7: 'июля',
            8: 'августа',
            9: 'сентября',
            10: 'октября',
            11: 'ноября',
            12: 'декабря'
        };
        if (typeof map[month] != 'undefined') {
            return map[month];
        } else {
            return '';
        }
    }

    onLoadAvatar() {
        this.props.avatarLoaded();
    }

    onErrorAvatar() {
        this.props.errorAvatar();
    }

    getUserView(list, inSearch) {
        if (!inSearch) {
            if (!list.count) {
                return this.getNotFound();
            } else {
                let items = list.items;
                let offset = this.props.filter.offset;
                if (offset < items.length) {
                    let user = items[offset];
                    const {city, relation, bdate, sex} = user;
                    let str = [];
                    if (bdate) {
                        let parts = bdate.split('.');
                        if (parts.length == 3) {
                            let age = this.calculateAge(parts[1], parts[0], parts[2]);
                            str.push(age + ' ' + this.getNumEnding(age, ['год', 'года', 'лет']));
                        } else if (parts.length == 2) {
                            str.push(parts[0] + ' ' + this.getMonth(parts[1]));
                        }
                    }
                    if (relation != 0) {
                        let map = {
                            1: ['не женат', 'не замужем'],
                            2: ['есть подруга', 'есть друг'],
                            3: ['помолвлен', 'помолвлена'],
                            4: ['женат', 'замужем'],
                            5: 'всё сложно',
                            6: 'в активном поиске',
                            7: ['влюблён', 'влюблена'],
                            0: 'не указано'
                        };
                        if (typeof map[relation] != 'undefined') {
                            let line = map[relation];
                            if (line && line.length == 2) {
                                if (sex == 1) {
                                    line = line[1];
                                } else {
                                    line = line[0];
                                }
                            }
                            str.push(line)
                        }
                    }
                    if (city) {
                        str.push(city.title);
                    }
                    str = str.join(', ');

                    let photoWrapperClass = classNames({
                        'GroupView__photo-wrapper': true,
                        'loading': ( this.props.filter.loadingAvatar ),
                        'error': ( this.props.filter.errorAvatar )
                    });

                    let avatarClass = classNames({
                        'hidden': ( this.props.filter.loadingAvatar || this.props.filter.errorAvatar )
                    });

                    let likeBoxClass = classNames({
                        'GroupView__like-box': true,
                        'lock': this.props.filter.lockLike
                    });

                    return (<div className="GrpupView__center">
                        <div className={photoWrapperClass}>
                            <img className={avatarClass} onError={this.onErrorAvatar.bind(this)}
                                 onLoad={this.onLoadAvatar.bind(this)} src={user.photo_max_orig}/>
                        </div>
                        <div className="GroupView__about-box">
                            <div>
                                <div className="name">{user.first_name} {user.last_name}</div>
                                <div className="about">{str}</div>
                            </div>
                            <div>

                            </div>
                        </div>
                        <div className={likeBoxClass}>
                            <div onClick={this.skip.bind(this, user)} title="Пропустить" className="skip icon"></div>
                            <div onClick={this.show.bind(this, user)} title="Открыть профиль"
                                 className="page icon"></div>
                            <div onClick={this.like.bind(this, user)} title="Нравится" className="like icon"></div>
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
        const {stat, userRepo} = this.props;
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
        if (filter.ageFrom > 0) {
            filterText.push('от ' + filter.ageFrom);
        }
        if (filter.ageTo > 0) {
            filterText.push('до ' + filter.ageTo);
        }
        filterText = filterText.join(' ');
        let loaderClass = classNames({
            'ui inverted dimmer': true,
            'active': ( inSearch )
        });

        let people = {
            'total': founded.items.length,
            'skipped': (this.props.filter.offset)
        };

        filterText = people.skipped + ' из ' + people.total + ' ' + filterText;

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
            <SyncLikesWrapper stat={stat} userRepo={userRepo} startLoadUser={this.startLoadUser.bind(this)} onClose={ this.onCloseSync.bind(this) } />
        </div>)
    }

    onCloseSync() {
        this.props.closeSync();
    }

    startLoadUser(userId) {
        this.props.startLoadUser(userId);
    }
}

GroupView.propTypes = {
    selectedGroup: PropTypes.object.isRequired,
    filter: PropTypes.object.isRequired,
    stat: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        selectedGroup: state.selectedGroup,
        filter: state.filter,
        stat: state.stat,
        userRepo: state.userRepo
    }
}

export default
connect(mapStateToProps, {
    loadToPool,
    startSearch,
    likeThis,
    skipThis,
    dropAvatar,
    avatarError,
    avatarLoaded,
    closeSync,
    startLoadUser
})(GroupView)
