var express = require('express')
var Incident = express.Router()
const IncidentModel = require('../models/incident-model')

Incident.get('/:vehicle/limit/:limit', function (req, res) {
  var incidents = IncidentModel.find({ name: req.params.vehicle })
  .limit(Number(req.params.limit))
  .sort('-_id')

  incidents
  .then(incidents => res.send({incidents}))
  .catch(error => console.log(error.message))
})

Incident.get('/', function (req, res) {
   res.send('welcome to Incident Report API')

})
module.exports = Incident