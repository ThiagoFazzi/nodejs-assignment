var express = require('express')
var Vehicle = express.Router()
const VehicleModel = require('../models/vehicle-model')

Vehicle.get('/:vehicle/limit/:limit', function (req, res) {
  var vehicles = VehicleModel.find({ name: req.params.vehicle })
  .limit(Number(req.params.limit))
  .sort('-_id')

  vehicles
  .then(vehicles => res.send({vehicles}))
  .catch(error => console.log(error.message))
})

Vehicle.get('/', function (req, res) {
   res.send('welcome to data-storage API')

})
module.exports = Vehicle