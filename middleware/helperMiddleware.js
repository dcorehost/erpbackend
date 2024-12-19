const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')

const generateToken = async (id, phone, email, usertype) => {
    console.log("DATA:", id, phone, email, usertype)
    const payload = {
        _id: id,
        phone: phone,
        email: email,
        typeofuserInEng: usertype
    };
    return jwt.sign(payload, `${ process.env.JWT_SECRET }`, {
        expiresIn: '30d',
    });
};

const resetPasswordToken = async (email) => {
    const payload = {
        email: email
    };
    return jwt.sign(payload, `${ process.env.JWT_SECRET }`, {
        expiresIn: '1h',
    });
};

module.exports = { generateToken ,resetPasswordToken}