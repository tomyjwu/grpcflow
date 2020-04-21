const grpcflow = require('./grpcflow-client');
function grpcflowTest() {
    const argv = require('yargs')
      .option({
        server: {
          describe: 'The address of the grpcflow server.',
          demandOption: true,
          type: 'string'
        },
        intent: {
          describe: 'The intent display name',
          demandOption: true,
          type: 'string'
        },
        pk: {
          describe: 'parameter key',
          type: 'string'
        },
        pv: {
          describe: 'parameter value',
          type: 'string'
        },
        plaintext: {
          alias: 'k',
          describe: 'When set, establishes a plaintext connection. Useful for debugging locally.',
          type: 'boolean'
        }
      }).argv;
    const request = {
      "responseId": "aabbccdd-4096", 
      "session": "project/fujen-smart-iot/agent/sessions/deadbeaf", 
      "queryResult": { 
          "queryText": "your name?", 
          "parameters": {}, 
          "allRequiredParamsPresent": true, 
          "fulfillmentText": "my name is dialogflow", 
          "fulfillmentMessages": {"text": {"text":["my name is dialogflow"]}}, 
          "outputContexts": [{"name":"projects/fujen-smart-iot/agent/sessions/aabbccdd/contexts/__system_counters__"}], 
          "parameters":{
            "no-input":0,
            "no-match":0
          }, 
          "intent": {
            "name":"projects/fujen-smart-iot/agent/intents/aabbccdd",  "displayName":argv.intent
          }, 
          "intentDetectionConfidence":1, 
          "languageCode":"zh-tw",
          "entities": {"key":"value"}
          } 
      };
    if (argv.pk && argv.pv) {
      console.log("with pk pv");
      request.queryResult.parameters[argv.pk] = argv.pv;
    }
    
    grpcflow(argv.server, argv.plaintext, request).then((value) => {
      const fulfillmentText = value.fulfillmentMessages.text.text[0];
      console.log(fulfillmentText);
    }, (error) => {
      console.error(error);
    });
  }
  grpcflowTest();