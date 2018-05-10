'use strict';
/* eslint-disable react/jsx-no-bind */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import '../../../pages/global-const.css';
import './Profile.css';
import { connect } from 'react-redux';

import { hideProfile } from '../../../actions/modals';
import { changeAvatar } from '../../../actions/user';

function getGroupInviteLink(url, id) {
    return `${url}invite/g_${id}`;
}

class Profile extends Component {
    hideProfile = () => {
        this.props.hideProfile();
    };

    componentDidMount() {
        document.addEventListener('keydown', e => {
            if (e.keyCode === 27) {
                this.props.hideProfile();
            }
        });
    }

    whoIsMyInterlocutor(profile) {
        if (profile.type === 'group') {
            return {
                avatar: profile.avatar,
                nickname: profile.title
            };
        }

        const { members } = profile;

        if (members[0].nickname === this.props.user.nickname) {
            return members[1];
        }

        return members[0];
    }

    onFileChange = e => {
        const [file] = e.target.files;

        this.props.changeAvatar(file, this.props.user);
    }

    render() {
        const { profile } = this.props;

        if (!profile) {
            return (<div />);
        }

        // ЕСЛИ СВОЙ ПРОФИЛЬ
        if (profile.nickname) {
            return (
                <div className="darkness" onClick={this.hideProfile}>
                    <div className="profile" onClick={event => event.stopPropagation()}>
                        <div className="profile__avatar-box">
                            <label htmlFor="imginput">
                                <img
                                    className="profile__avatar"
                                    src={profile.avatar}
                                    alt="avatar"
                                />
                            </label>
                            <label htmlFor="imginput">
                                <div className="profile__avatar-hover" />
                            </label>
                            <input
                                onChange={this.onFileChange}
                                name="userAvatar" id="imginput"
                                className="profile__input"
                                type="file"
                            />
                        </div>
                        <div className="profile__info-box">
                            <span className="profile__nickname">
                                {profile.nickname}
                            </span>
                            <CopyToClipboard text={`${window.location}invite/${profile.nickname}`}>
                                <span className="profile__invite-link">
                                    Copy invite link
                                </span>
                            </CopyToClipboard>
                        </div>
                    </div>
                </div>
            );
        }

        const displayData = this.whoIsMyInterlocutor(profile);
        // туду отделить профиль пользователя от группы

        return (
            <div className="darkness" onClick={this.hideProfile}>
                <div className="profile" onClick={event => event.stopPropagation()}>
                    <div className="profile__avatar-box">
                        <img className="profile__avatar" src={displayData.avatar} alt="avatar" />
                    </div>
                    <div className="profile__info-box">
                        <span className="profile__nickname">
                            {displayData.nickname}
                        </span>
                        <span>{this.inviteLink(profile)}</span>
                        <ul>
                            {profile.members
                                ? profile.members.map(m => <li key={m.nickname}>{m.nickname}</li>)
                                : null}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    inviteLink(profile) {
        const groupInviteLink = getGroupInviteLink(window.location, profile.inviteId);

        if (profile.inviteId) {
            return (
                <CopyToClipboard text={groupInviteLink}>
                    <span className="profile__invite-link">
                        Copy invite link
                    </span>
                </CopyToClipboard>);
        }

        return <div />;
    }
}

Profile.propTypes = {
    profile: PropTypes.object,
    user: PropTypes.object,
    hideProfile: PropTypes.func,
    changeAvatar: PropTypes.func
};

export default connect(
    state => ({
        profile: state.modal.profile,
        user: state.user
    }), {
        hideProfile,
        changeAvatar
    }
)(Profile);