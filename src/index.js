/*
 * App ID for the skill
 */
var APP_ID = "amzn1.ask.skill.a0984a52-c59b-42d1-b887-240c5a8c94e5";

/*
 * Environment Configuration
 */
var config = {};
config.IOT_BROKER_ENDPOINT = "a2nljurxozn6qg.iot.eu-west-1.amazonaws.com";
config.IOT_BROKER_REGION = "eu-west-1";

//Loading AWS SDK libraries
var AWS = require('aws-sdk');
AWS.config.region = config.IOT_BROKER_REGION;
//Initializing client for IoT
var iotData = new AWS.IotData({ endpoint: config.IOT_BROKER_ENDPOINT });

var Alexa = require("alexa-sdk");

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'PushMessage': function (payload, topic, tell) {

        var that = this;

        var params = {
            topic: topic, /* required */
            payload: payload,
            qos: 0
        };
        iotData.publish(params, function (err, data) {
            if (!err) {
                that.emit(':ask', tell + " <break time='1s' /> Kann ich sonst noch etwas für dich tun?");
            }
        });
    },
    'LaunchRequest': function () {
        this.emit('StartIntent');
    },
    'StartIntent': function () {
        this.emit(':ask', "Was kann ich für dich tun?");
    },
    'ChangeTemperatureIntent': function () {
        var temp = this.event.request.intent.slots.Temperature.value;

        if (isNaN(temp)) {
            this.emit(':ask', "Entschuldige aber ich habe dich nicht genau verstanden. Bitte wiederhole deinen Wunsch noch einmal.");            
        }

        var answerString = "ok. Ich habe die Temperatur auf " + temp + " Grad eingestellt.";
        var topic = "topic_1";

        this.emit('PushMessage', temp, topic, answerString);
    },
    "Unhandled": function () {
        this.emit(':tell', 'keine ahnung');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Auf wiedersehen! Bis bald.');
    },
    'AMAZON.NoIntent': function () {
        this.emit("AMAZON.StopIntent");
    },
    'AMAZON.CancelIntent': function () {
        this.emit("AMAZON.StopIntent");
    }
};
