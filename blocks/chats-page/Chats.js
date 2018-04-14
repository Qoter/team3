'use strict';

import React from 'react';

import ChatIcon from '../common-components/ChatIcon';

import './Chats.css';

export default function Chats({ chatsList, click }) {
    if (!chatsList) {
        return <div>No chats</div>;
    }

    return chatsList.map(chat => (
        <ChatIcon key={chat.id} chatProps={chat} click={click} />
    ));
}
