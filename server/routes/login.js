const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const app = express();

//LOGIN WITH NORMAL CREDENTIALS
app.post('/login', (req, resp) => {

    console.log('Start login');

    let body = req.body;
    console.log('Body', body);
    User.findOne({ email: body.email }, (error, userDB) => {

        if (error) {
            return resp.status(500).json({
                ok: false,
                error
            });
        }

        //1st get the email in DB
        if (!userDB) {
            return resp.status(400).json({
                ok: false,
                error: {
                    message: '(User) or password go wrong!'
                }
            });
        }

        //After get user, compare password
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            console.log('lasdasd');
            return resp.status(400).json({
                ok: false,
                error: {
                    message: 'User or (password) go wrong!'
                }
            });
        };

        //Generate JWT
        let token = jwt.sign({
            user: userDB
        }, process.env.SEED_SIGN, { expiresIn: process.env.EXPIRES_TOKEN });
        //Everything in order, go and log in
        return resp.json({
            ok: true,
            userDB,
            token
        });
    });


});











module.exports = app;