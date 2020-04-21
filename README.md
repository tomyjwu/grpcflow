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
```
 node testcli.js --server="localhost:50061" --intent="get-agent-name" --plaintext
 ```