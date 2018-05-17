'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ChatIcon from './ChatIcon';

class Chats extends React.Component {
    render() {
        const { chats } = this.props;

        if (chats.length === 0) {
            return (
                <React.Fragment>
                    <div className="darkness" />
                    <div className="chats__no-chats" />
                </React.Fragment>
            );
        }

        return chats.map(chat => (
            <ChatIcon key={chat._id} chatProps={chat} />
        ));
    }
}

Chats.propTypes = {
    chats: PropTypes.array
};

export default connect(
    state => ({
        chats: state.chats
    })
)(Chats);
