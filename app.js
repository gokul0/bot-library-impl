var builder = require('botBuilder');
var restify = require('restify');
var botLibrary = require('bot-library');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var indexRouter = require('./controller/index');
var Botkit = require('botkit');


//bot configurations
let nlp_name = "dialogFlow";
let nlp_personality = "men";
let googleEnabled = false;
let weatherEnabled = false;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);





var dbConfig = {
    "DB_URL":"mongodb://make1:make123@ds133642.mlab.com:33642/bot-library",
    "dbName": "bot-library"
}



var database = new botLibrary.Database(dbConfig);

var admin = new botLibrary.Admin(database);


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


var networkCalls = new botLibrary.NetworkCalls(database);
var nlp = new botLibrary.NLP(database);


var controller = Botkit.slackbot({
    debug: false
});

controller.spawn({
    token: 'xoxb-184010346548-430880011079-dD8fgBJbIdWVHMHDWKOPA6Lj',
 }).startRTM();

 controller.hears('.*', ['direct_message','direct_mention','mention'],function(bot,message) {


        console.log("inside bot");

        nlp.changePersonality(admin.config.personality);

        //messageData["query"] = message.text;
        // messageData["lang"] = "en";
        // messageData["sessionId"] = "1234V";
        // messageData["v"]="20150910";
        nlp.getResponse(admin.config.nlp,message.text).then( resp => {
        console.log(resp);

            var botReplayMsg = "";

            if(resp.type == "default" || resp.type == "noIntent"){

                var isGoogleSearchActive = admin.config.googleEnabled;

                //check if the googleSearch is enabled or not
                if((isGoogleSearchActive == true || isGoogleSearchActive == "true") && isGoogleSearchActive != "false" ){

                    //make external network call
                    botReplayMsg = "Google External Call will be made. !!!"


                }else{

                    botReplayMsg = resp.text;
                }

            }else if( resp.type == "weather"){

                //check if the weather is enabled or not

                var isWheatherEnabled = admin.config.weatherEnabled;
                
                console.log(isWheatherEnabled+"  "+typeof(isWheatherEnabled));


                if((isWheatherEnabled == true || isWheatherEnabled == "true") && isWheatherEnabled != "false"){
                    
                    //make external network call

                    

                    try{
                        botReplayMsg = "Getting weather response...\nThe weather is clear sky"; 

                    }catch(err){
                        botReplayMsg = "Weather External Call will be made. !!!";
                    }

                    

                }else{

                    botReplayMsg = "Weather service is currently down. "
                }

            }else{

                botReplayMsg = resp.text;

            }

        bot.reply(message,botReplayMsg);
        console.log("after bot reply");


    }).catch(err => {
        console.error(err);
        bot.reply(message,"Error in response");
    });
 });

 app.use('/admin',admin.router);


 app.use(function(req, res, next) {
    next(createError(404));
  });

  app.listen(process.env.port || process.env.PORT || 3000, function () {
    console.log('%s listening to %s', server.name, server.url); 
 });


// var messageData = {
//     "lang": "en",
//     "sessionId": "12345",
//     "timezone": "America/New_York"
// };

// // Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
// var bot = new builder.UniversalBot(connector, function (session) {
//     messageData["query"] = session.message.text;
//     nlp.getResponse("msbot-poc",{"body" : messageData}).then( resp => {
//         console.log(resp);
//         session.send(resp.result.fulfillment.speech);
//     }).catch(err => {
//         console.error(err);
//         session.send("error in response");
//     });
// });