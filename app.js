const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { connectDatabase } = require('./confid/database'); 
const userRoutes = require('./routes/userRoutes'); 

const app = express();

const NODE_ENV = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 5000;

console.log('MONGO_URI:', process.env.MONGO_URI); 
console.log('PORT:', process.env.PORT);

connectDatabase();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(compression());

app.use('/erp', userRoutes);

app.listen(port, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log(`Example app listening on port ${port}`);
    }
});
