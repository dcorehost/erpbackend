const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Active", "In-Active"],
        default: "In-Active",
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
    },
    maritalStatus: {
        type: String,
        enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    fcmToken: {
        type: String,
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address',
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'location',
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contact',
    },
}, { timestamps: true }); 

module.exports = mongoose.model('user', userSchema);
