'use strict'
const nats = require('nats').connect()
const mongoose = require('mongoose')

const Vehicle = require('./src/models/vehicle-model')

const options = {
  useNewUrlParser: true
}

mongoose.connect('mongodb://root:1234@localhost/vehicle?authSource=admin', options);


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongoDB connected!')

  //check for NATS error
  nats.on('error', function(e) {
    console.log('Error [' + nats.options.url + ']: ' + e)
    process.exit()
  })

  //Define NATS subject to looking for
  var subject = 'vehicle.test-bus-1'

  //subscribe with nats for a especific subject, in this case 'vehicle.test-bus-1' to receive data
  nats.subscribe(subject, function(msg) {
    //console.log(JSON.parse(msg));
    const data = JSON.parse(msg)
    //console.log(data.time)

  const vehicle = new Vehicle({
    _id: new mongoose.Types.ObjectId(),
    time: data.time,
    energy: data.energy,
    gps: [data.gps],
    odo: data.odo,
    speed: data.speed,
    soc: data.soc
  })

vehicle.save()
.then(result => console.log('vehicle data saved!',result))
.catch(error => console.log(error.message))




  })





/*const vehicle = new Vehicle({
  _id: new mongoose.Types.ObjectId(),
  time: 1511512585495,
  energy: 85.14600000000002,
  gps: ["52.08940124511719","5.105764865875244"],
  odo: 5.381999999997788,
  speed: 12,
  soc: 88.00000000000007
})

vehicle.save()
.then(result => console.log('vehicle data saved!',result))
.catch(error => console.log(error.message))*/






});