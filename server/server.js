require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

//Enable public folder to access html
app.use(express.static(path.resolve(__dirname, '../public/')));



//Global configurations of all the routes
app.use(require('./routes/index'));

//DB Connection
mongoose.connect(process.env.URLDB, (error, res) => {
    if (error) throw error;

    console.log('DB is ready!');
});


//REST API init
app.listen(process.env.PORT, () => {
    console.log('Listen in port:', process.env.PORT);
});

//mongodb://user:123qwe@ds163764.mlab.com:63764/db-coffee

//process.env.URLDB