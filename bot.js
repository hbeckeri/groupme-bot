'use strict';

// Get environment variables
require('dotenv').config({silent: true});

let request = require('request');

let API_URL = 'https://api.groupme.com/v3/';

let bot = {

    /**
     * Post a message from a bot
     * POST bots/post
     * @param message, bot_id
     */
    echo: function(message, bot_id) {
        return new Promise((resolve, reject) => {
            var url = API_URL + 'bots/post?token=' + process.env.ACCESS_TOKEN;
            request({ url: url, method:'POST', body: JSON.stringify({ bot_id: bot_id, text: message }) }, (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
    },

    /**
     * Remove a bot that you have created by bot_id
     * POST bots/destroy
     * @param bot_id
     */
    leave: function(bot_id) {
        return new Promise((resolve, reject) => {
            let url = API_URL + 'bots/destroy?token=' + process.env.ACCESS_TOKEN;
            request({ url: url, method:'POST', body: JSON.stringify({ bot_id: bot_id })}, (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
    },

    /**
     * Create a bot, bot joins a room with specified json
     * POST bot
     * @param json.name (required), json.group_id (required), json.avatar_url (optional), json.callback_url (recommended)
     */
    join: function(json) {
        return new Promise((resolve, reject) => {
            let bot = {};

            if (!json.name || !json.group_id) { reject({error: 'Must declare bot name and group_id'}); }

            bot.name = json.name;
            bot.group_id = json.group_id;
            if (json.avatar_url) { bot.avatar_url = json.avatar_url }
            if (json.callback_url) { bot.callback_url = json.callback_url; }


            let url = API_URL + 'bots?token=' + process.env.ACCESS_TOKEN;
            request({ url: url, method:'POST', body: JSON.stringify(bot) }, (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
    },

    /**
     * List bots that you have created
     * GET bots
     */
    list: function() {
        return new Promise((resolve, reject) => {
            var url = API_URL + 'bots?token=' + process.env.ACCESS_TOKEN;
            request.get({url: url, json: true }, (err, res, group) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(group);
                }
            });
        });
    },

    /**
     * Note: you can add, remove, or get a user from any chat that your groupme account is currently
     * a member of without the need to register the bot in the group. Registering is needed only for the
     * bot to send messages into the group it was registered with.
     */

    /**
     * Removes a user from the group
     * POST /groups/:group_id/members/:membership_id/remove
     * @param group_user_id is the group_id of a user you want to remove
     * @param group_id of the group to remove from
     */
    removeUser: function(group_user_id, group_id) {
        return new Promise((resolve, reject) => {
           let url = API_URL + 'groups/'+group_id+'/members' + group_user_id + '/remove?token=' + process.env.ACCESS_TOKEN;
            request({ url: url, method:'POST' }, (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
    },

    /**
     * TODO : add by phone and email
     * Adds a members to a group (determined by user_id)
     * POST /groups/:group_id/members/add
     * @param user_id of a user
     * @param group_id of the group to add to
     * @param name of the user in the chat
     */
    addUser: function(user_id, group_id, name) {
        return new Promise((resolve, reject) => {
            let url = API_URL + 'groups/'+group_id+'/members/add?token=' + process.env.ACCESS_TOKEN;
            request({ url: url, method:'POST',body: JSON.stringify({members: [{nickname: name, user_id: user_id}]})}, (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
    },

    /**
     * List the authenticated user's active groups.
     * GET groups
     */
    getGroups: function() {
        return new Promise((resolve, reject) => {
            var url = API_URL + 'groups?token=' + process.env.ACCESS_TOKEN;
            request.get({url: url, json: true }, (err, res, group) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(group);
                }
            });
        });
    },

    /**
     * Gets the 100 most recent messages
     * GET groups/:group_id/messages
     * @param group_id
     */
    getMessages: function(group_id) {
        return new Promise((resolve, reject) => {
            var url = API_URL + 'groups'+group_id+'/messages?limit=100&token=' + process.env.ACCESS_TOKEN;
            request.get({url: url, json: true }, (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
    },

    /**
     * Like a message
     * POST messages/:group_id/:message_id/like
     * @param message_id, group_id
     */
    like: function(message_id, group_id) {
        return new Promise((resolve, reject) => {
            let url = API_URL + 'messages/'+ group_id + '/' + message_id + '/like?token=' + process.env.ACCESS_TOKEN;
            request({ url: url, method:'POST'}, (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
    }

    // TODO : unlike
};

module.exports = bot;

