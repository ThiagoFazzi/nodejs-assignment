'use strict'
require('dotenv').load();
const NATS = require('nats')
const mongoose = require('mongoose')
const VehicleModel = require('./src/models/vehicle-model')
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const Vehicle = require('./src/routers/vehicle')

//create instance of express
const app = express();

//initialize a simple http server
const server = http.createServer(app);

//create intance of websocket server
const io = socketIo(server); // < Interesting!

//Rest API 
app.use('/vehicle', Vehicle)

//Start connection to mongoDB through mongoose
mongoose.connect('mongodb://'+ process.env.MONGODB_USERNAME + ':' + process.env.MONGODB_PASSWORD + '@localhost/vehicle?authSource=admin', {useNewUrlParser: true});

//listen for clients connection events througt websockets
const socket = io.on("connection", socket => {
  console.log("New client connected")
  return socket
  
  //socket.on("disconnect", () => console.log("Client disconnected"));
});






//Mongoose ckecks for error when try to connect, if no errors the connection is open
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongoDB connected')

  //Start connection with NATS
  const nc = NATS.connect({
    url: process.env.NATS_URL + ':' + process.env.NATS_PORT,
    json: true
  });
  
  //mongoDB connection was open, then is time to ckeck for nats error
  nc.on('error', function(e) {
    console.log('Error [' + nats.options.url + ']: ' + e)
    process.exit()
  })

  nc.on('finish', (e)=>{
    console.log('finish trip',e)
  })

  //Setup what subject you looking for in NATS server
  const subject = 'vehicle.test-bus-1'
  //subscribe with nats for a especific subject, in this case 'vehicle.test-bus-1' to receive data
  nc.subscribe(subject, (data) => {
    
    //for each vehicle data, one instance of Vehicle Model is created
    const vehicle = new VehicleModel()
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

      socket.emit("Vehicle", result)
      //wss.clients.forEach(function each(client) {
      //  if (client.readyState === WebSocket.OPEN) {
      //    client.send(JSON.stringify(result))
      //  }
      //});
    })
    .catch(error => console.log('mongoDB error:',error.message))

  })
});

//start our server
server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${server.address().port}`);
});