'use strict';
var nats = require('nats').connect();

//check for NATS error
nats.on('error', function(e) {
    console.log('Error [' + nats.options.url + ']: ' + e);
    process.exit();
});

//Define NATS subject to looking for
var subject = 'vehicle.test-bus-1';

//subscribe with nats for a especific subject, in this case 'vehicle.test-bus-1' to receive data
nats.subscribe(subject, function(msg) {
    console.log(msg);
});
