'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import moment from 'moment';

import './SearchMessageIcon.css';

class SearchMessageIcon extends Component {
    prettyDate(date) {
        return moment(date)
            .locale('ru')
            .format('LT');
    }

    openChat = id => {
        this.props.openChat(id);
    }

    render() {
        /* eslint react/jsx-no-bind: 0 */
        /* eslint complexity: 0 */
        const { user, message } = this.props;

        const title = message.group ? message.group : message.ls;

        // who - тот кто написал (смотря в каком чате)
        let who = '';

        if (message.group) {
            who = `${message.author}: `;
        } else if (message.author === user.nickname) {
            who = 'Я: ';
        } else {
            who = '';
        }

        return (
            <div className="searchmsg-icon" onClick={() => this.openChat(message.chatId)}>
                <div className="searchmsg-icon__logo-box">
                    <img className="searchmsg-icon__logo" src={message.avatar} draggable="false" />
                </div>
                <div className="searchmsg-icon__info-box">
                    <div className="searchmsg-icon__upper-box">
                        <div className="searchmsg-icon__title">{title}</div>
                        <div className="searchmsg-icon__date">
                            {message && this.prettyDate(message.date)}
                        </div>
                    </div>
                    <div className="searchmsg-icon__lower-box">
                        {/* ТУДУ оверфлоу не работает */}
                        <div className="searchmsg-icon__lastmsg">
                            <div className="searchmsg-icon__who">{who}</div>
                            {message.text}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

SearchMessageIcon.propTypes = {
    user: PropTypes.object,
    message: PropTypes.object,
    openChat: PropTypes.func
};

export default connect(
    state => ({
        user: state.user,
        searchMessages: state.searchMessages.messages
    }),
    dispatch => ({
        openChat: id => {
            dispatch({ type: 'OPEN_CHAT', id });
        }
    })
)(SearchMessageIcon);
