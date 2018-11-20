const mongoose = require('mongoose')

const vehicleSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    time: mongoose.Types.Decimal128,
    energy: mongoose.Types.Decimal128,
    gps:[String],
    odo: mongoose.Types.Decimal128,
    speed: Number,
    soc: mongoose.Types.Decimal128
})

module.exports = mongoose.model("vehicle", vehicleSchema)