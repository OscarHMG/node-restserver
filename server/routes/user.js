const express = require('express');
const app = express();
const User = require('../models/user');

const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.get('/user', (request, response) => {
    response.json('getUser');
});


app.post('/user', (request, response) => {
    let body = request.body;

    console.log(body);


    let user = new User({
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.role
    });

    user.save((error, userDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        } else {
            return response.json({
                ok: true,
                user: userDB
            });
        }
    });


});


app.put('/user/:id', (request, response) => {
    let id = request.params.id;
    response.json('putUser');
});

app.delete('/user', (request, response) => {
    response.json('deleteUser');
});

module.exports = app;