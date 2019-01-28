const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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


//This function return a promise
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();


    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }


}

// Async arrow function to use the await promise wit ht everify function
app.post('/google', async(req, resp) => {
    let googleToken = req.body.googleToken;

    let googleUser = await verify(googleToken)
        .catch(error => {
            return resp.status(403).json({
                ok: false,
                error
            });
        });

    //Now I hace the google information, now I need save the DB, before that I need to validate 
    User.findOne({ email: googleUser.email }, (error, userDB) => {

        if (error) {
            return resp.status(500).json({
                ok: false,
                error
            });
        }

        //If user exist, validate google auth
        if (userDB) {
            if (userDB.google == false) {
                return resp.status(400).json({
                    ok: false,
                    error: {
                        message: 'Use your normal auth without google'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED_SIGN, { expiresIn: process.env.EXPIRES_TOKEN });

                return resp.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }
        } else {
            //Not exist, now I have to save in DB

            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.picture;
            user.google = true;
            user.password = ':)';

            user.save((error, userDB) => {
                if (error) {
                    return resp.status(500).json({
                        ok: false,
                        error
                    });
                }

                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED_SIGN, { expiresIn: process.env.EXPIRES_TOKEN });

                return resp.json({
                    ok: true,
                    user: userDB,
                    token
                });

            });
        }
    });
});

module.exports = app;