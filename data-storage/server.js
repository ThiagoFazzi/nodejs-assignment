const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('close', function close() {
    console.log('disconnected');
  });
  //ws.on('message', function incoming(data) {
    // Broadcast to everyone else.

  //});
});

wss.clients.forEach(function each(client) {
  if (client.readyState === WebSocket.OPEN) {
    client.send(Date.now());
  }
});

//start our server
server.listen(process.env.PORT || 8080, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});