const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    phone : {
        type : Number,
        required:true
    },
    emailId : {
        type : String,
        required:true
    },
    whatsapp :{
        type : Number
    },
    alterMobile : {
        type : Number
    },
    helpline : {
        type : Date,
    }
},{timestamps:true})

module.exports = new mongoose.model('contact',contactSchema)