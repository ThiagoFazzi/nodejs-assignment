var express = require('express')
var Vehicle = express.Router()

// define the home page route
Vehicle.get('/', function (req, res) {
  res.send({
    method: 'GET',
    data: 'vehicle'
  })
})

module.exports = Vehicle