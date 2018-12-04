'use strict'
const NATS = require('nats')
const mongoose = require('mongoose')
const IncidentModel = require('./models/incident-model')
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
//const socketIo = require('socket.io')
const Incident = require('./routers/incident')

const app = express()
const server = http.createServer(app)
//const io = socketIo(server)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next();
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/incident', Incident)


mongoose.connect('mongodb://mongo-incident-report/incident', {useNewUrlParser: true});
const db = mongoose.connection
db
.on('error', () => {
  console.error.bind(console, 'connection error:')
})

const nc = NATS.connect({
  url: 'nats://nats:4222',
  json: true
})

const subject = 'vehicle.error.test-bus-1'

nc
.on('error', function(e) {
  console.log('Error', e)
  process.exit()
})
.subscribe(subject, (data) => {
  const incident = new IncidentModel()
  incident._id = new mongoose.Types.ObjectId(),
  incident.name = subject.split('.')[2]
  incident.time = data.time,
  incident.gps = data.gps.split('|');
  incident.msg = data.msg

  incident.save()
  .then(result => console.log('mongoDB OK:', result))
  .catch(error => console.log('mongoDB error:',error.message))
})

server.listen(8080, () => {
  console.log(`Server started on port ${server.address().port}`);
})