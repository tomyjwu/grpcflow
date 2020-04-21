// The package @grpc/grpc-js can also be used instead of grpc here
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
  __dirname + '/grpcflow.proto',
  {keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true
  });
const grpcflowProto = grpc.loadPackageDefinition(packageDefinition);

function grpcflow(serverAddress, plaintext, flowRequest) {
  let credentials;
  if (plaintext) {
    credentials = grpc.credentials.createInsecure();
  } else {
    credentials = grpc.credentials.createSsl();
  }
  const dialogflowWebhook = new grpcflowProto.DialogflowWebhook(serverAddress, credentials);
  return new Promise((resolve, reject) => {
    dialogflowWebhook.fulfillmentWebhook(flowRequest, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    })
  })
}


module.exports = grpcflow;

