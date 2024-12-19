const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    plot: {
        type: String,
 
    },
    building: {
        type: String,
 
    },
    street: {
        type: String,
 
    },
    city: {
        type: String,
        required: true,
 
    },
    state: {
        type: String,
        required: true,
 
    },
    country: {
        type: String,
        required: true,
 
    },
    pincode: {
        type: Number,
        required: true,
    },
    typeOfAddress: {
        type: String,
        enum: ['Home', 'Office', 'Temporary', 'Permanent'],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('address', addressSchema);
