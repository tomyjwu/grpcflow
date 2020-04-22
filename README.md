# grpcflow
inspired by https://github.com/grpc-ecosystem/grpc-cloud-run-example

This packaged gRPC client for Dialogflow webhook as a library, to hide the grpc proto loading, connecting server, ...etc details

# usage
```
// prepare Dialogflow webhook inline editor request json as parameter
const grpcflow = require('@tomyjwu/grpcflow-client');
grpcflow(argv.server, argv.plaintext, request).then((value) => {
      console.log(value);
    }, (error) => {
      console.error(error);
    });
```
# testing cli example

please do
```
npm install
```

then you could do
```
 node testcli.js --server="localhost:50061" --intent="get-agent-name" --plaintext
 ```

# full example for Dialogflow inline editor 

## server code
 please visit https://github.com/tomyjwu/python-grpcflow for example python server to receive the grpc Dialogflow request. Following sample assumed the server is deployed to google cloud run.

 you should replace `grpcflowServer` with your server/api address.
 
 ```
 const grpcflowServer = "grpcflow-server-xyspwhk3xq-uc.a.run.app";
 ```

## index.js
 ```
 // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const grpcflow = require('@tomyjwu/grpcflow-client');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const flowRequest = request.body;
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
  function grpcflowHandler(agent) {
    const grpcflowServer = "grpcflow-server-xyspwhk3xq-uc.a.run.app";
	  return grpcflow(grpcflowServer, false, flowRequest)
    .then((value) => {
      const fulfillmentText = value.fulfillmentMessages.text.text[0];
      agent.add(`From fulfillment ok=${fulfillmentText}`);
      console.log('calc result:' + value);
    }, (error) => {
      agent.add(`From fulfillment fail=${error}: My name is Dialogflow!`);
    });
  }
  agent.handleRequest(grpcflowHandler);
});
```
## package.json
```
{
  "name": "dialogflowFirebaseFulfillment",
  "description": "This is the default fulfillment for a Dialogflow agents using Cloud Functions for Firebase",
  "version": "0.0.1",
  "private": true,
  "license": "Apache Version 2.0",
  "author": "Google Inc.",
  "engines": {
    "node": "8"
  },
  "scripts": {
    "start": "firebase serve --only functions:dialogflowFirebaseFulfillment",
    "deploy": "firebase deploy --only functions:dialogflowFirebaseFulfillment"
  },
  "dependencies": {
    "actions-on-google": "^2.2.0",
    "firebase-admin": "^5.13.1",
    "firebase-functions": "^2.0.2",
    "dialogflow": "^0.6.0",
    "dialogflow-fulfillment": "^0.5.0",
    "@tomyjwu/grpcflow-client": "^0.1.0"
  }
}
```