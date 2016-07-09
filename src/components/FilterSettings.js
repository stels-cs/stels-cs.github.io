import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {setFilter} from '../actions/FilterActions'
import '../style/FilterSettings.scss'
import 'react-select/dist/react-select.css';
import { browserHistory, Link } from 'react-router'

export class FilterSettings extends Component {

    componentDidMount() {
        if (!this.props.selectedGroup || !this.props.selectedGroup.name) {
            browserHistory.push('/');
        }
    }

    onChangeSex(e) {
        var sex = e.currentTarget.value;
        this.props.setFilter( {sex:sex} );
    }

    handleChange(e) {
        console.log(e);
    }

    number_format(number, decimals, dec_point, thousands_sep) {
        var i, j, kw, kd, km;

        // input sanitation & defaults
        if (isNaN(decimals = Math.abs(decimals))) {
            decimals = 2;
        }
        if (dec_point == undefined) {
            dec_point = ",";
        }
        if (thousands_sep == undefined) {
            thousands_sep = ".";
        }

        i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

        if ((j = i.length) > 3) {
            j = j % 3;
        } else {
            j = 0;
        }

        km = (j ? i.substr(0, j) + thousands_sep : "");
        kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
        //kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
        kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");


        return km + kw + kd;
    }

    getOptions(zeroTitle, prefix, start = 14) {
        let push = [];
        push.push(<option key={ prefix } value={0}>{zeroTitle}</option>);
        for(let i = start; i <= 40; i++) {
            push.push(<option key={ prefix + i } value={i}>{prefix} {i}</option>);
        }
        return push;
    }

    onAgeFromChange(e) {
        var v = e.currentTarget.value;
        this.props.setFilter( { ageFrom: v } );
    }

    onAgeToChange(e) {
        var v = e.currentTarget.value;
        this.props.setFilter( { ageTo: v } );
    }

    onStartClick() {
        browserHistory.push('/group');
    }

    render() {
        const {members_count, name} = this.props.selectedGroup;
        const membersCountFormat = this.number_format(members_count, '0', '', ' ');
        return (<div className="FilterSettings">
            <div className="FilterSettings__header">
                <div className="text">{name} > Участники{' '}{' '}{' '}<span className="gray">{membersCountFormat || 0}</span></div>
            </div>
            <div className="FilterSettings__wrapper">
                <div className="FilterSettings__group">
                    <div className="FilterSettings__title">Возраст</div>
                    <div className="FilterSettings__age-box">
                        <div className="FilterSettings__select">
                            <select onChange={this.onAgeFromChange.bind(this)} value={this.props.filter.ageFrom} className="ui dropdown">
                                {this.getOptions('От', 'от')}
                            </select>
                        </div>
                        <div style={ {width:'10px'} }>{' '}</div>
                        <div className="FilterSettings__select">
                            <select onChange={this.onAgeToChange.bind(this)} value={this.props.filter.ageTo} className="ui dropdown">
                                {this.getOptions('до', 'до', 15)}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="FilterSettings__group">
                    <div className="FilterSettings__title">Пол</div>
                    <div className="FilterSettings__sex-box">
                        <div className="ui radio checkbox">
                            <input onChange={this.onChangeSex.bind(this)} checked={this.props.filter.sex == 1} id="sex-female" type="radio" name="sex" value="1" tabIndex="0" className="hidden" />
                                <label htmlFor="sex-female">Женский</label>
                        </div>
                        <div style={ {width:'20px'} }>{' '}</div>
                        <div className="ui radio checkbox">
                            <input onChange={this.onChangeSex.bind(this)} checked={this.props.filter.sex == 2} id="sex-male" type="radio" name="sex" value="2" tabIndex="0" className="hidden" />
                                <label htmlFor="sex-male">Мужской</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="FilterSettings__footer">
                <button onClick={this.onStartClick.bind(this)} className="FilterSettings__start">Продолжить</button>
            </div>
        </div>)
    }
}

FilterSettings.propTypes = {
    selectedGroup: PropTypes.object.isRequired,
    filter: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        selectedGroup: state.selectedGroup,
        filter: state.filter
    }
}

export default connect(mapStateToProps, {
    setFilter
})(FilterSettings)
