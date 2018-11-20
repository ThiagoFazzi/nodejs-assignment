'use strict'
const nats = require('nats').connect()
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/vehicle');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongoDB connected!')

    






});





//check for NATS error
nats.on('error', function(e) {
    console.log('Error [' + nats.options.url + ']: ' + e)
    process.exit()
})

//Define NATS subject to looking for
var subject = 'vehicle.test-bus-1'

//subscribe with nats for a especific subject, in this case 'vehicle.test-bus-1' to receive data
nats.subscribe(subject, function(msg) {
    console.log(msg);
})