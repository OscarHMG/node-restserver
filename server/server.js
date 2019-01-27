require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();


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