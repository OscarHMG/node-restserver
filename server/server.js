require('./config/config');

const express = require('express');
const mongoose = require('mongoose');


const app = express();

app.use(require('./routes/user'));






mongoose.connect('mongodb://localhost:27017/db-coffee', (error, res) => {
    if (error) throw error;

    console.log('DB is ready!');
});



app.listen(process.env.PORT, () => {
    console.log('Listen in port:', process.env.PORT);
});