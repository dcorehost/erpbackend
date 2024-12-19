const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    latitude : {
        type : String,
    },
    longitude : {
        type : String
    },
    altitude : {
        type : Date,
    },
    accuracy : {
        type : String,
    }
},{timestamps:true})

module.exports = new mongoose.model('location',locationSchema)