'use strict'
const NATS = require('nats')
const mongoose = require('mongoose')
const Vehicle = require('./src/models/vehicle-model')
const express = require('express')
const http = require('http')
const WebSocket = require('ws')


const app = express();

app.get('/', (req,res) => {
  res.send('response')
})

//initialize a simple http server
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('close', function close() {
    console.log('disconnected');
  });
});



//Start connection with NATS
const nc = NATS.connect({
  url: "nats://localhost:4222",
  json: true
});

//Start connection to mongoDB through mongoose
mongoose.connect('mongodb://root:1234@localhost/vehicle?authSource=admin', {useNewUrlParser: true});

//Mongoose ckecks for error when try to connect, if no errors the connection is open
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongoDB connected!')

  //mongoDB connection was open, then is time to ckeck for nats error
  nc.on('error', function(e) {
    console.log('Error [' + nats.options.url + ']: ' + e)
    process.exit()
  })

  //Setup what subject you looking for in NATS server
  const subject = 'vehicle.test-bus-1'

  //subscribe with nats for a especific subject, in this case 'vehicle.test-bus-1' to receive data
  nc.subscribe(subject, (data) => {
    
    //for each vehicle data, one instance of Vehicle Model is created
    const vehicle = new Vehicle()
    //for each attribute of Vehicle model is 
    //asign a correspondent value from vehicle data, 
    //also subject that comes from a vehicle name
    vehicle._id = new mongoose.Types.ObjectId(),
    vehicle.name = subject
    vehicle.time = data.time,
    vehicle.energy = data.energy,
    vehicle.gps = data.gps.split('|');
    vehicle.odo =  data.odo,
    vehicle.speed = data.speed,
    vehicle.soc = data.soc

    //the vehicle try to persist on mongoDB, if it works, 
    //mongoDB return a response which contain a object vehicle persisted,
    //then this object is provided to the client 
    vehicle.save()
    .then(result => {
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(result))
        }
      });
    })
    .catch(error => console.log(error.message))
  })

});

//start our server
server.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});