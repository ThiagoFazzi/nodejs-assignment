const mongoose = require('mongoose')

const incidentSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    time: Number,
    gps:[String],
    msg: String ,
})

module.exports = mongoose.model("incident", incidentSchema)