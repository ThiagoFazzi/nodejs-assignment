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

//mongoose.connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo-vehicle/vehicle?authSource=admin`, {useNewUrlParser: true});
mongoose.connect('mongodb://mongo-vehicle/vehicle', {useNewUrlParser: true});
const db = mongoose.connection
db
.on('error', () => {
  console.error.bind(console, 'connection error:')
})

const nc = NATS.connect({
  url: 'nats://nats:4222',
  json: true
});

const subject = 'vehicle.test-bus-1'

nc
.on('error', function(e) {
  console.log('Error', e)
  process.exit()
})
.subscribe(subject, (data) => {

  const vehicle = new VehicleModel()
  vehicle._id = new mongoose.Types.ObjectId(),
  vehicle.name = subject
  vehicle.time = data.time,
  vehicle.energy = data.energy,
  vehicle.gps = data.gps.split('|');
  vehicle.odo =  data.odo,
  vehicle.speed = data.speed,
  vehicle.soc = data.soc

  vehicle.save()
  .then(result => socket.emit("Vehicle", result))
  .catch(error => console.log('mongoDB error:',error.message))
})

server.listen(8080, () => {
  console.log(`Server started on port ${server.address().port}`);
})