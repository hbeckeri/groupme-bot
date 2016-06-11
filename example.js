var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
app.use(jsonParser);
var exampleBot = require('./bot');

app.listen(process.env.PORT, function () {
    console.log('listening on port %s', process.env.PORT);
});

app.get('/', (req, res) => {
   res.send({ name: 'groupme-bot api', version: 'beta 1.0' });
});