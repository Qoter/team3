import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'node-fetch';
import { connect } from 'react-redux';

import './Controls.css';

/* туду переделать на поиск по сообщениям */
class Controls extends Component {
    state = { isSearchString: false }

    showSearch = () => {
        const { isSearchString } = this.state;

        this.setState({ isSearchString: !isSearchString });
    }

    findUsers = async pressEvent => {
        if (pressEvent.keyCode !== 13 || pressEvent.target.value === '') {
            return;
        }

        const response = await fetch(`/api/users/${pressEvent.target.value}`, {
            credentials: 'include',
            method: 'GET'
        });

        if (response.status === 200) {
            const users = await response.json();

            this.props.onUsersFound([users]);
        }
    }

    showProfile = () => {
        const { user } = this.props;

        this.props.onShowProfile(user);
    }

    render() {
        const { isSearchString } = this.state;

        return isSearchString
            ?
            (
                <React.Fragment>
                    <input
                        type="text"
                        className="chats__search-input"
                        placeholder="Найти пользователя"
                        autoFocus
                    />
                    <img
                        src="/static/controls/search.svg"
                        className="control-img"
                        onClick={this.showSearch}
                        title="Поиск"
                        draggable="false"
                    />
                </React.Fragment>
            )
            :
            (
                <React.Fragment>
                    <img
                        src="/static/controls/profile.svg"
                        className="control-img"
                        onClick={this.showProfile}
                        title="Мой профиль"
                        draggable="false"
                    />
                    <img
                        src="/static/controls/chat.svg"
                        className={
                            this.props.chats.length
                                ?
                                'control-img'
                                :
                                'control-img controls_zindex_max'
                        }
                        onClick={this.props.onShowAddUser}
                        title="Добавить собеседника"
                        draggable="false"
                    />
                    <img
                        src="/static/controls/create_group_chat.svg"
                        className="control-img"
                        onClick={this.props.onShowCreateGroup}
                        title="Создать групповой чат"
                        draggable="false"
                    />
                    <img
                        src="/static/controls/search.svg"
                        className="control-img"
                        onClick={this.showSearch}
                        title="Поиск"
                        draggable="false"
                    />
                </React.Fragment>
            );
    }
}

Controls.propTypes = {
    user: PropTypes.object,
    chats: PropTypes.array,
    onUsersFound: PropTypes.func,
    onShowProfile: PropTypes.func,
    onShowAddUser: PropTypes.func,
    onShowCreateGroup: PropTypes.func
};

export default connect(
    state => ({
        user: state.user,
        chats: state.chats
    }),
    dispatch => ({
        onUsersFound: users => {
            dispatch({ type: 'FOUND_USERS', foundUsers: users });
        },
        onShowProfile: profile => {
            dispatch({ type: 'SHOW_PROFILE', profile });
        },
        onShowAddUser: () => {
            dispatch({ type: 'SHOW_ADDUSER' });
        },
        onShowCreateGroup: () => {
            dispatch({ type: 'SHOW_CREATEGROUP' });
        }
    })
)(Controls);
