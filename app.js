var builder = require('botBuilder');
var restify = require('restify');
var botLibrary = require('bot-library');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var indexRouter = require('./controller/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', indexRouter);

app.use(function(req, res, next) {
    next(createError(404));
  });

  app.listen(process.env.port || process.env.PORT || 3000, function () {
    console.log('%s listening to %s', server.name, server.url); 
 });

var dbConfig = {
    "DB_URL":"mongodb://make1:make123@ds133642.mlab.com:33642/bot-library",
    "dbName": "bot-library"
}


var DB = botLibrary.Database;
var database = new DB(dbConfig);

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 4201, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    // appId: "poc",
    // appPassword: "test"
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());



var networkInit = new botLibrary.NetworkCalls(database);

var messageData = {
    "lang": "en",
    "sessionId": "12345",
    "timezone": "America/New_York"
};

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    messageData["query"] = session.message.text;
    networkInit.getResponse("msbot-poc",{"body" : messageData}).then( resp => {
        console.log(resp);
        session.send(resp.result.fulfillment.speech);
    }).catch(err => {
        console.error(err);
        session.send("error in response");
    });
});