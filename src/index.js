'use strict';

const Alexa = require('alexa-sdk');
const config = {
    "APP_ID": "amzn1.ask.skill.a0984a52-c59b-42d1-b887-240c5a8c94e5"
};
const handlers = require('./handlers');

exports.handler = function(event, context, callback){
    const alexa = Alexa.handler(event, context, callback);

    alexa.appId = config.APP_ID;
    alexa.registerHandlers(handlers);

    console.log(`Beginning execution for skill with APP_ID=${alexa.appId}`);
    alexa.execute();
    console.log(`Ending execution  for skill with APP_ID=${alexa.appId}`);
};