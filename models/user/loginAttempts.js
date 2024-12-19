const mongoose = require('mongoose')

const loginAttemptsSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    failedAttempts : {
        type : Number
    },
    accountLockStatus : {
        type : Boolean,
        default: false
    },
    lockDuration : {
        type : Date,
        default : null
    }
})

module.exports = new mongoose.model('loginAttempts',loginAttemptsSchema)