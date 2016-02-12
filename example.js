var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
app.use(jsonParser);
var rugbyBot = require('./bot');

var PORT = 8080;

/**
 * Updates the bot. Ensures only 1 bot after restart.
 */
function update() {
    rugbyBot.unregister();
    rugbyBot.register();
    rugbyBot.updateUsers();
}

//update at startup then every hour
update();
setInterval(function(){
    update();
}, 3600000);

app.listen(PORT, function () {
    console.log('listening on port %s', PORT);
});
app.post('/incoming', function(req, res){
    var json = req.body;
    handleIncomingRequests(json);
    res.send('OK');
});
app.get('/users', function(req, res) {
    rugbyBot.getUsers(rugbyBot.GROUP_ID, function(json) {
        res.send(json);
        rugbyBot.updateUsers();
    });
});
app.get('/groups', function(req, res) {
   rugbyBot.getGroups(function(json) {
      res.send(json);
   });
});
app.get('/update', function(req, res) {
    update();
    res.send('OK');
});
app.get('/room', function(req, res) {
    res.send(rugbyBot.GROUP_ID.toString());
});
app.get('/debug', function(req, res) {
    res.sendFile(__dirname + '/debug.html');
});