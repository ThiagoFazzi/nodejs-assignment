'use strict'
const NATS = require('nats')
const mongoose = require('mongoose')
const VehicleModel = require('./models/vehicle-model')
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const socketIo = require('socket.io')
const Vehicle = require('./routers/vehicle')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next();
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/vehicle', Vehicle)

const socket = io.on("connection", socket => {
  console.log('New client connected')
  return socket
})

socket.on('disconnect', () => {
  console.log('Client disconnected')
})

mongoose.connect('mongodb://mongo-data-storage/vehicle', {useNewUrlParser: true});
const db = mongoose.connection
db
.on('error', () => {
  console.error.bind(console, 'connection error:')
})

const nc = NATS.connect({
  url: 'nats://nats:4222',
  json: true
});

nc
.on('error', function(e) {
  console.log('Error', e)
  process.exit()
})

.subscribe('vehicle.*.test-bus-1', function(data, reply, subject) {

  switch (subject) {
    case 'vehicle.done.test-bus-1':
      const vehicle = new VehicleModel()
      vehicle._id = new mongoose.Types.ObjectId(),
      vehicle.name = subject.split('.')[2]
      vehicle.time = data.time,
      vehicle.energy = data.energy,
      vehicle.gps = data.gps.split('|');
      vehicle.odo =  data.odo,
      vehicle.speed = data.speed,
      vehicle.soc = data.soc

      vehicle.save()
      .then(vehicle => {
        socket.emit("Vehicle", vehicle)
        console.log(vehicle)
      })
      .catch(error => console.log('mongoDB error:',error))
      break

    case 'vehicle.error.test-bus-1':
      socket.emit("Error", data)
      break
      
    default:
  }
})

server.listen(8080, () => {
  console.log(`Server started on port ${server.address().port}`);
})