const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const protectUser = async (req, res, next) => {
    try {
        let token;

        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
            return res.status(401).send({ message: "Authorization header missing or invalid" });
        }

        token = req.headers.authorization.split(' ')[1];
        console.log("DEBUG:", token);
        if (!token) {
            return res.status(401).send({ message: "Token not available" });
        }

        try {
            console.log("DEBUG2");
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.payload = decoded;
            console.log("Debug11:", req.payload);
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send({ message: "Token Expired" });
            }
            return res.status(401).send({ message: "Invalid Token" });
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
}


// const authResetPassword = async (req, res, next) => {
//     try {
//         let token;
//         console.log(req.query.token)

//          if (req.query.token) {
//             token = req.query.token;
//         }else{
//             return res.status(401).send({ message: "Token not available" });

//         }

//       try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             console.log(decoded)
//             req.payload = decoded;  
//             next();  
//         } catch (err) {
//             if (err.name === 'TokenExpiredError') {
//                 return res.status(401).send({ message: "Token Expired" });
//             }
//             return res.status(401).send({ message: "Invalid Token" });
//         }

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send(err.message);
//     }
// };



module.exports = { protectUser };