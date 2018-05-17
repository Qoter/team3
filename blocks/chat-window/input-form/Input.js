/* eslint-disable no-undef */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/self-closing-comp */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    sendMessage,
    resetAttachments,
    showInputPopup,
    hideInputPopup,
    showEmoji,
    hideEmoji,
    deleteReply,
    deleteForward } from '../../../actions/activeChat';

import Emoji from './Emoji';
import InputPopup from './popup-additional-functions/InputPopup';

import './Input.css';

class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msgText: '',
            isRecord: false,
            recognizer: null
        };
    }

    // при вводе добавляем с state
    changeText = e => this.setState({ msgText: e.target.value });

    // клик на рожицу, используется в <Emoji.../>
    toggleEmoji = () => {
        if (this.props.emojiActive) {
            this.props.hideEmoji();
        } else {
            this.props.showEmoji();
            this.props.hideInputPopup();
        }
    };

    togglePopup = e => {
        e.stopPropagation();
        if (this.props.inputPopupActive) {
            this.props.hideInputPopup();
        } else {
            this.props.showInputPopup();
            this.props.hideEmoji();
        }
    }

    // начать голосовой набор текста
    startSpeech = () => {
        const SpeechRecognition = window.SpeechRecognition ||
                        window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognizer = new SpeechRecognition();

            recognizer.lang = 'ru-RU';

            this.setState({ recognizer });

            recognizer.start();
            this.setState({ isRecord: true });

            recognizer.onresult = e => {
                const index = e.resultIndex;
                const result = e.results[index][0].transcript.trim();

                let nowMsgText = this.state.msgText.trim();

                nowMsgText += nowMsgText ? ` ${result}` : result;
                this.setState({ msgText: nowMsgText, isRecord: false });
            };
        }
    }

    // остановить голосовой набор текста
    stopSpeech = () => {
        this.state.recognizer.stop();
        this.setState({ isRecord: false });
    }

    // функция добавления emoji
    addEmoji = emoji => {
        const input = document.querySelector('.chat-input__write-field');
        let currentValue = input.value;

        currentValue += `${emoji.colons}`;
        this.setState({ msgText: currentValue });
        this.textInput.focus();
    };

    /* eslint-disable max-statements */
    submitMessage = () => {
        const { attachments, forwardMessage, replyMessage } = this.props;

        if (this.state.msgText.trim() || attachments.length) {
            this.props.resetAttachments();
            this.setState({
                msgText: ''
            });
            const input = document.querySelector('.chat-input__write-field');
            const text = input.value;

            input.value = '';

            const message = {
                text,
                author: this.props.user.nickname,
                attachments: this.props.attachments.map(a => a.url),
                replyTo: replyMessage
                // selfDestructTimer: 5000 <- сюда фигануть реальный таймер
            };

            const chatId = this.props.activeChat._id;

            this.props.sendMessage(chatId, message);

            if (replyMessage) {
                this.props.deleteReply();
            }
        }

        if (forwardMessage) {
            this.props.sendMessage(this.props.activeChat._id, forwardMessage);
            this.props.deleteForward();
        }
    };

    // прослушка отправки на Enter
    keySubmitMessage = e => {
        if (e.keyCode === 13) {
            this.submitMessage();
        }
    };

    render() {
        return (
            <React.Fragment>
                <div className={
                    'chat-input grid_' +
                    `${this.props.isForward
                        ?
                        '5_6'
                        :
                        '6_7'}`
                }>
                    <input
                        onChange={this.changeText}
                        onKeyDown={this.keySubmitMessage}
                        type="text"
                        ref={input => { this.textInput = input; }}
                        autoFocus
                        className="chat-input__write-field"
                        value={this.state.msgText}
                    />
                    {
                        this.state.isRecord ?
                            <label
                                className="chat-input__record-btn chat-input__button"
                                title="Запись"
                                onClick={this.stopSpeech}
                                >
                            </label>
                            :
                            <label
                                className="chat-input__audioinput-btn chat-input__button"
                                title="Набор голосом"
                                onClick={this.startSpeech}
                                >
                            </label>
                    }
                    <label
                        className="chat-input__emoji-btn chat-input__button"
                        onClick={event => event.stopPropagation()}
                        title="Добавить emoji"
                        >
                        <input
                            type="button"
                            onClick={this.toggleEmoji}
                            className="chat-input__input_not-visual"
                        />
                    </label>
                    <label
                        className="chat-input__burger-btn chat-input__button"
                        onClick={this.togglePopup}
                        title="Прикрепить"
                        >
                    </label>
                    <label
                        src="/static/send_message.svg"
                        onClick={this.submitMessage}
                        className="chat-input__send-btn chat-input__button"
                        title="Отправить сообщение"
                    />
                </div>
                <Emoji addEmoji={this.addEmoji} />
                <InputPopup checkFiles={this.props.checkFiles} />
            </React.Fragment>
        );
    }
}

Input.propTypes = {
    user: PropTypes.object,
    activeChat: PropTypes.object,
    forwardMessage: PropTypes.object,
    replyMessage: PropTypes.object,

    sendMessage: PropTypes.func,
    resetAttachments: PropTypes.func,
    attachments: PropTypes.array,
    showInputPopup: PropTypes.func,
    emojiActive: PropTypes.bool,
    showEmoji: PropTypes.func,
    hideEmoji: PropTypes.func,
    checkFiles: PropTypes.func,
    inputPopupActive: PropTypes.bool,
    hideInputPopup: PropTypes.func,
    deleteReply: PropTypes.func,
    deleteForward: PropTypes.func,

    isForward: PropTypes.bool
};

export default connect(
    /* eslint-disable-next-line complexity */
    state => ({
        inputPopupActive: state.activeChat && state.activeChat.showInputPopup,
        emojiActive: state.activeChat && state.activeChat.showEmoji,
        user: state.user,
        attachments: state.activeChat && state.activeChat.attachments,
        forwardMessage: state.activeChat && state.activeChat.forwardMessage,
        replyMessage: state.activeChat && state.activeChat.replyMessage
    }), {
        sendMessage,
        resetAttachments,
        showEmoji,
        hideEmoji,
        showInputPopup,
        hideInputPopup,
        deleteReply,
        deleteForward
    }
)(Input);
