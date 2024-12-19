const express = require('express');
const { signUp,signIn } = require('../controller/user/user');

const routes = express.Router(); 

routes.post('/sign-up', signUp);
routes.post('/sign-in', signIn);


module.exports = routes; 
