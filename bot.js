var request = require('request');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var util = require('util');
var fs = require('fs');

var file = fs.readFileSync("config.json");
var config = JSON.parse(file);

var ACCESS_TOKEN = config.ACCESS_TOKEN;
var BOT_URL = config.BOT_URL;

var bot = {
    users:  [],
    bot_id: 0,
    BOT_NAME: config.BOT_NAME,
    GROUP_ID: config.GROUP_ID,
    lastMessage: '',/**/

    /**
     * Displays a message in chat
     * @param message to send
     */
    echo: function(message) {
        console.log(bot.BOT_NAME + "says: " + message);
        var url = 'https://api.groupme.com/v3/bots/post';
        request({ url: url, method:'POST', body: JSON.stringify({bot_id: bot.bot_id, text: message})}, function(err, res, body){
        });
    },

    /**
     * Deletes the bot from groupme from the predefined GROUP_ID
     */
    unregister: function() {
        var url = 'https://api.groupme.com/v3/bots?token=' + ACCESS_TOKEN;
        request({url:url, method:'GET'}, function(err, res, body) {
            var json = JSON.parse(body).response;
            for (var i = 0; json[i] != undefined; i++) {
                if (json[i].group_id == bot.GROUP_ID) {
                    var url2 = 'https://api.groupme.com/v3/bots/destroy?token=' + ACCESS_TOKEN;
                    request({url:url2, method: 'POST', body: JSON.stringify({bot_id: json[i].bot_id} )},function(err, respons, body) {
                    });
                }
            }
        });
    },

    /**
     * Creates a bot with groupme from the predefined GROUP_ID
     */
    register: function() {
        var url = 'https://api.groupme.com/v3/bots?token=' + ACCESS_TOKEN;
        var name = bot.BOT_NAME;
        request( { url : url, method : 'POST', body : JSON.stringify({bot: { name: name, group_id: bot.GROUP_ID, callback_url: BOT_URL}}) },
            function(error, response, body) {
                var url2 = 'https://api.groupme.com/v3/bots?token=' + ACCESS_TOKEN;
                request({url:url2, method:'GET'}, function(err, res, body){
                    var json = JSON.parse(body).response;
                    json.forEach(function(data) {
                        if (data.group_id == bot.GROUP_ID) {
                            bot.bot_id = data.bot_id;
                        }
                    });
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
     * @param group_user_id is the group_id of a user you want to remove
     * @param group_id of the group to remove from
     */
    removeUser: function(group_user_id, group_id) {
        var url = 'https://api.groupme.com/v3/groups/'+group_id+'/members/'+group_user_id+'/remove?token=' + ACCESS_TOKEN;
        request({ url: url, method:'POST'},  function(err, res, body){});
    },

    /**
     * Removes a user from the group
     * @param group_user_id is the group_id of a user you want to remove
     * @param group_id of the group to remove from
     * @param access_token of the user removing the user
     */
    removeUserWithToken: function(group_user_id, group_id, access_token) {
        var url = 'https://api.groupme.com/v3/groups/'+group_id+'/members/'+group_user_id+'/remove?token=' + access_token;
        request({ url: url, method:'POST'},  function(err, res, body){});
    },

    /**
     * Adds a user to the group
     * @param user_id of a user
     * @param group_id of the group to add to
     * @param name of the user in the chat
     */
    addUser: function(user_id, group_id, name) {
        var url = 'https://api.groupme.com/v3/groups/'+group_id+'/members/add?token=' + ACCESS_TOKEN;
        request({ url: url, method:'POST', body: JSON.stringify({members: [{nickname: name, user_id: user_id}]})}, function(err, res, body){});
    },

    addUserWithToken: function(user_id, group_id, name, access_token) {
        var url = 'https://api.groupme.com/v3/groups/'+group_id+'/members/add?token=' + access_token;
        request({ url: url, method:'POST', body: JSON.stringify({members: [{nickname: name, user_id: user_id}]})}, function(err, res, body){});
    },

    /**
     * Gets name, group_id and user_id of each user in the group_id
     * @param group_id to get users from
     * @return array of users with name, group_id and user_id
     */
    updateUsers: function(){
        bot.users = [];
        var url = 'https://api.groupme.com/v3/groups/'+bot.GROUP_ID+'?token='+ ACCESS_TOKEN;
        request({url: url, method: 'GET'}, function(err, res, body){
            var json = JSON.parse(body).response;
            json.members.forEach(function(data) {
                bot.users.push({name: data.nickname, group_id: data.id, user_id: data.user_id});
            });
        });
    },

    /**
     * Gets users from a specified group_id
     * @param group_id
     * @return array of users
     */
    getUsers: function(group_id, callback) {
        var users = [];
        var url = 'https://api.groupme.com/v3/groups/'+group_id+'?token='+ ACCESS_TOKEN;
        request({url: url, method: 'GET'}, function(err, res, body){
            var json = JSON.parse(body).response;
            json.members.forEach(function(data) {
                users.push({name: data.nickname, group_id: data.id, user_id: data.user_id});
            });
            callback(users);
        });
    },

    /**
     * Gets users from a specified group_id and access_token
     * @param group_id, access_token, callback
     * @return array of users
     */
    getUsersWithToken: function(group_id, access_token, callback) {
        var users = [];
        var url = 'https://api.groupme.com/v3/groups/'+group_id+'?token='+ access_token;
        request({url: url, method: 'GET'}, function(err, res, body){
            var json = JSON.parse(body).response;
            if (json != null) {
                json.members.forEach(function(data) {
                    users.push({name: data.nickname, group_id: data.id, user_id: data.user_id});
                });
            }
            callback(users);
        });
    },

    /**
     * Prints out a list of groups that the user is a member of
     */
    getGroups: function(callback) {
        var groups = [];
        var url = 'https://api.groupme.com/v3/groups?token=' + ACCESS_TOKEN;
        request({url: url, method: 'GET'}, function(err, res, body){
            var json = JSON.parse(body).response;
            json.forEach(function(data) {
                groups.push({name: data.name, group_id:  data.id});
            });
            callback(groups);
        });
    },

    /**
     * Gets the 100 most recent messages
     * @param callback
     */
    getMessages: function(group_id, callback) {
        var url = 'https://api.groupme.com/v3/groups/'+group_id+'/messages?limit=100&token=' + ACCESS_TOKEN;
	    request({url: url, method: 'GET'}, function(err, res, body){
	        var json = JSON.parse(body).response;
            callback(json);
	    });
    },

    /**
     * Gets all the messages from the current point in time
     * to may 1st 2015
     * @param before_id
     */
    getAllMessagesBefore: function(group_id, before_id, callback) {
        var url = 'https://api.groupme.com/v3/groups/'+group_id+'/messages?limit=100&before_id='+before_id+'&token=' + ACCESS_TOKEN;
        request({url: url, method: 'GET'}, function(err, res, body){
            var json = JSON.parse(body).response;
            callback(json);
            //if the date is after may 1st 2015
            if (json.messages[0].created_at > 1430515720) {
                setTimeout(function() {
                    bot.getAllMessagesBefore(bot.GROUP_ID, json.messages[0].id, callback);
                }, 200);
            } else {
                console.log('done!');
            }
        });
    },

    /**
     * Like a message
     * @param message_id
     */
    like: function(message_id) {
        var url = 'https://api.groupme.com/v3/messages/'+ bot.GROUP_ID +'/' + message_id +'/like?token=' + ACCESS_TOKEN;
        request({ url: url, method:'POST'}, function(err, res, body){});
    },

    /**
     * Process an image with the groupme image processing service
     * @param imageUrl
     * @param callback
     */
    processImage: function(imageUrl, callback) {
        var url = 'https://image.groupme.com/pictures?access_token=' + ACCESS_TOKEN;
        request({ url: url, method:'POST', file: imageUrl}, function(err, res, body){
            var json = JSON.parse(body).response;
            callback(body);
        });
    }
};

module.exports = bot;
