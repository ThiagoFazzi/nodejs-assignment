const mongoose = require('mongoose')

const vehicleSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    time: Number,
    energy: String,
    gps:[String],
    odo: String,
    speed: Number,
    soc: String
})

module.exports = mongoose.model("vehicle", vehicleSchema)