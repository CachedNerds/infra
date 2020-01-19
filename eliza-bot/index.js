const Eliza = require('eliza-as-promised');

const http = require('http');


const access_token = process.env.ACCESS_TOKEN;
const matrix_server_uri = process.env.MATRIX_SERVER_URI;
const MatrixClient = require("matrix-bot-sdk").MatrixClient;
const AutojoinRoomsMixin = require("matrix-bot-sdk").AutojoinRoomsMixin;
const client = new MatrixClient(matrix_server_uri, access_token);
AutojoinRoomsMixin.setupOnClient(client);
client.start().then(() => console.log("Client started!"));

let _userId = null;

client.getUserId().then((userId) => {
  _userId = userId;
});

var elizas = {};
client.on("room.join", (roomId) => {
  elizas[roomId] = {
    eliza: new Eliza(),
    last: (new Date()).getTime()
  }
  client.sendMessage(roomId, {
    "msgtype": "m.notice",
    "body": elizas[roomId].eliza.getInitial()
  });
});
client.on("room.message", (roomId, event) => {
  if (event["sender"] === _userId) return;
  if (! event.content || ! event.content.body) return;
  console.log('GETTING ELIZA RESPONSE...');

  elizas[roomId].eliza.getResponse(event.content.body)
    .then((response) => {
      console.log('GOT ELIZA RESPONSE: ' + event.content.body);
      var responseText = '';
      if (response.reply) { responseText = response.reply; }
      if (response.final) { responseText = response.final; }

      client.sendMessage(roomId, {
        "msgtype": "m.notice",
        "body": responseText,
        "responds": {
          "sender": event.sender,
          "message": event.content.body
        }
      }).then((eventId) => {
        if (response.final) {
          client.leaveRoom(roomId);
        }
      });
    });
});

//create a server object:
http.createServer(function (req, res) {
  if (client) {
    res.statusCode = 200;
    res.write('OK'); //write a response to the client
    res.end(); //end the response
  }
  else {
    res.statusCode = 500;
    res.write('NOT READY'); //write a response to the client
    res.end(); //end the response
  }
}).listen(8080); //the server object listens on port 8080

// this block is magic
process.on( 'SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  // some other closing procedures go here
  client.stop();
  process.exit( );
});