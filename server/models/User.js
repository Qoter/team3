'use strict';

const fetch = require('node-fetch');
const createIdenticon = require('../utils/identicon');

const API_URL = `${process.env.HOST}:${process.env.PORT}/api`;

class User {
    constructor({ id, nickname, avatar }) {
        this.id = id;
        this.nickname = nickname;
        this.avatar = avatar;
    }

    static async findOrCreate({ id, username }) {
        const response = await fetch(`${API_URL}/users/${id}`);

        if (response.status === 404) {
            const newUser = User.create(id, username);

            fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            return newUser;
        }

        return await response.json();
    }

    static create(id, githubNickname) {
        const avatarInBase64 = createIdenticon();

        return new User({ id, nickname: githubNickname, avatar: avatarInBase64 });
    }

    save(dbclient) {
        return dbclient.postJson('users', this);
    }
}

module.exports = User;
