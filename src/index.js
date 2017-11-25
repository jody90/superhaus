// 'use strict';

// const Alexa = require('alexa-sdk');
// const config = {
//     "APP_ID": "amzn1.ask.skill.a0984a52-c59b-42d1-b887-240c5a8c94e5"
// };
// const handlers = require('./handlers');

// exports.handler = function(event, context, callback){
//     const alexa = Alexa.handler(event, context, callback);

//     alexa.appId = config.APP_ID;
//     alexa.registerHandlers(handlers);

//     console.log(`Beginning execution for skill with APP_ID=${alexa.appId}`);
//     alexa.execute();
//     console.log(`Ending execution  for skill with APP_ID=${alexa.appId}`);
// };

// 'use strict';

/*
 * App ID for the skill
 */
var APP_ID = "amzn1.ask.skill.a0984a52-c59b-42d1-b887-240c5a8c94e5";

/*
 * Environment Configuration
 */
var config = {};
config.IOT_BROKER_ENDPOINT      = "a2nljurxozn6qg.iot.eu-west-1.amazonaws.com";
config.IOT_BROKER_REGION        = "eu-west-1";

//Loading AWS SDK libraries
var AWS = require('aws-sdk');
AWS.config.region = config.IOT_BROKER_REGION;
//Initializing client for IoT
var iotData = new AWS.IotData({endpoint: config.IOT_BROKER_ENDPOINT});
// var iot
var topic = "topic_1";

var Alexa = require("alexa-sdk");

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'PushMessage': function (payload, tell) {

        var that = this;

        var params = {
            topic: 'topic_1', /* required */
            payload: payload,
            qos: 0
          };
          iotData.publish(params, function(err, data) {
                if (!err){
                    that.emit(':tell', tell);
                }   
          });
    },
    'LaunchRequest': function () {
        this.emit('PushMessage', 'start', 'wird gestartet');
    },
    'StartIntent': function () {
        // var channel = "foobar";
        // handlers.PushMessage("foobar", "foobar");
        this.emit('PushMessage', 'start', 'wird gestartet');
        // this.emit(':tell', 'Willkommen beim AraCom-<phoneme alphabet="ipa" ph="ˈhæ-kɐrˌ-thɔn">hackathon</phoneme>!');
    },
    'StopIntent': function () {
        this.emit('PushMessage', 'stop', 'wird heruntergefahren');
    },
    'ChangeTemperatureIntent': function () {
        var temp = this.event.request.intent.slots.Temperature.value;
        var answerString = "ok. Ich habe die Temperatur auf " + temp + " Grad eingestellt.";
        this.emit('PushMessage', temp, answerString);
    },
    'VolUpIntent': function () {
        this.emit('PushMessage', 'volup', 'ok');
    },
    'VolDownIntent': function () {
        this.emit('PushMessage', 'voldown', 'ok');
    },
    "Unhandled": function () {
        this.emit(':tell', 'keine ahnung');
    }
};