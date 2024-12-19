const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userModel = require('../../models/user/user');
const contactModel = require('../../models/user/contact');
const {generateToken} = require('../../middleware/helperMiddleware')
const loginAttemptsModel = require('../../models/user/loginAttempts')
const locationModel = require('../../models/user/location')
const axios=require('axios')

const signUp = async (req, res) => {
    try {

        const { firstName, lastName, confirmPassword,dateOfBirth, password, emailId, gender, maritalStatus, phone, bloodGroup } = req.body;
        console.log("Request body:", req.body);

        if (password !== confirmPassword) {
            return res.status(400).send({ message: "Password and confirm password do not match" });
        }

        let contactDoc = await contactModel.findOne({ $or: [{ emailId: emailId }, { phone: phone }] });
        console.log("Existing contact details:", contactDoc);

        if (contactDoc) {
            const existingUser = await userModel.findOne({ contact: contactDoc._id });
            if (existingUser) {
                return res.status(400).send({ message: "User with this contact already exists" });
            }
        } else {
            contactDoc = new contactModel({ emailId, phone });
            await contactDoc.save();
            console.log("New contact created:", contactDoc);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hashedPassword);

        const newUser = new userModel({
            firstName,
            lastName,
            dateOfBirth,
            password: hashedPassword,
            contact: contactDoc._id,
            gender,
            maritalStatus,
            bloodGroup,
            confirmPassword
        });

        await newUser.save();
        console.log("New user created:", newUser);

        let nloginAttempts = new loginAttemptsModel({
            userId : newUser._id
        })
        await nloginAttempts.save()

        res.status(200).send({ message: "Your profile is created successfully", user: newUser });
    } catch (error) {
        console.log( error.message);
        res.status(500).send({ message:"Internal Server Error" });
    }
};



const signIn = async (req, res) => {

    try {
      let password = req.body.password;

      let fcmToken = req.body.fcmtoken;
      console.log("password", password)
      
      let userContact = await contactModel.findOne({ $or: [{ "phone": req.body.phone }, { "emailId": req.body.emailId }] });
      console.log("pt1",userContact)

      let userData = await userModel.findOne({ contact: userContact._id });
      console.log("pt2",userData)
      
      let loginAttemptData = await loginAttemptsModel.findOne({ userId: userData._id });
  
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      console.log("password", isPasswordValid)
      console.log("password original", password)
  
      if (isPasswordValid) {
        console.log("Enter")
        await loginAttemptsModel.findOneAndUpdate({ _id: loginAttemptData._id }, {
          $set: { failedAttempts: 0, lockDuration: null },
        });

        let nlocation = new locationModel({
          latitude: req.body.location.latitude,
          longitude: req.body.location.longitude,
          accuracy: req.body.location.accuracy,
          altitude: req.body.location.altitude
        })
        await nlocation.save()
  
  
        let token = await generateToken(userData._id, userContact.phone, userContact.emailId, userData.typeOfUser)
        console.log("enter2")

  
        return res.json({
          message: "Login successfully",
          token,
          user: {
            _id: userData._id,
            username: userData.name,
            phone: userContact.phone,
            emailId: userContact.emailId,
          },
        });
      } else {
  
        if (loginAttemptData.failedAttempts == 3) {
          const update = {
            failedAttempts: 1,
            lockDuration: null,
          };
          await loginAttemptsModel.findOneAndUpdate(loginAttemptData._id, update);
  
          return res.status(401).json({ message: 'Invalid username or password' });
        } else {
  
          const update = {
            $inc: { failedAttempts: 1 },
            $set: { lockDuration: (loginAttemptData.failedAttempts + 1) >= maxFailedAttempts ? Date.now() + lockoutDuration * 60 * 1000 : null },
          };
  
          await loginAttemptsModel.findOneAndUpdate(loginAttemptData._id, update);
  
          return res.status(401).json({ message: 'Invalid username or password' });
        }
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

module.exports = {
    signUp,
    signIn
}