'use strict'
const NATS = require('nats')
const mongoose = require('mongoose')
const Vehicle = require('./src/models/vehicle-model')

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

  //check for NATS error
  nc.on('error', function(e) {
    console.log('Error [' + nats.options.url + ']: ' + e)
    process.exit()
  })

  //Define NATS subject to looking for
  var subject = 'vehicle.test-bus-1'

  //subscribe with nats for a especific subject, in this case 'vehicle.test-bus-1' to receive data
  nc.subscribe(subject, function(data) {
    
    //for each vehicle data, one instance of Vehicle Model is created
    const vehicle = new Vehicle()
    //for each attribute of Vehicle is asign a correspondent value from vehicle data
    vehicle._id = new mongoose.Types.ObjectId(),
    vehicle.time = data.time,
    vehicle.energy = data.energy,
    vehicle.gps = data.gps.split('|');
    vehicle.odo =  data.odo,
    vehicle.speed = data.speed,
    vehicle.soc = data.soc

    //vehicle is persisted on mongoDB
    vehicle.save()
    .then(result => console.log('vehicle data saved!',result))
    .catch(error => console.log(error.message))
  })

});