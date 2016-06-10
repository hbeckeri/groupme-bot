var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
app.use(jsonParser);
var exampleBot = require('./bot');

var PORT = 80;

/**
 * Updates the bot. Ensures only 1 bot after restart.
 */
function update() {
    exampleBot.unregister();
    exampleBot.register();
    exampleBot.updateUsers();
}

//update at startup then every hour
update();
setInterval(function(){
    update();
}, 3600000);

app.listen(PORT, function () {
    console.log('listening on port %s', PORT);
});
app.get('/say', function(req, res){
    var message = req.query.message;
    exampleBot.echo(message);
    res.send('OK');
});
app.get('/users', function(req, res) {
    exampleBot.getUsers(exampleBot.GROUP_ID, function(json) {
        res.send(json);
        exampleBot.updateUsers();
    });
});
app.get('/groups', function(req, res) {
   exampleBot.getGroups(function(json) {
      res.send(json);
   });
});
app.get('/update', function(req, res) {
    update();
    res.send('OK');
});
app.get('/room', function(req, res) {
    res.send(exampleBot.GROUP_ID.toString());
});
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/debug.html');
});