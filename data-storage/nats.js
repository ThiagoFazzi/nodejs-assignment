'use strict'
const NATS = require('nats')


export const connection = NATS.connect({url: "nats://localhost:4222", json: true })
//Start connection with NATS
//const nc = NATS.connect({
//    url: "nats://localhost:4222",
//    json: true
//});

//module.exports