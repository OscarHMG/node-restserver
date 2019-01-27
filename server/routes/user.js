const express = require('express');

const bcrypt = require('bcrypt-nodejs');

const _ = require('underscore');
const app = express();
const User = require('../models/user');

const { verifyToken, verifyRole } = require('../middlewares/auth');

const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.get('/user', verifyToken, (request, response) => {

    let since = Number(request.query.since) || 0;
    let limit = Number(request.query.limit) || 5;


    User.find({ status: true }, 'name email img status role google')
        .skip(since)
        .limit(limit)
        .exec((error, users) => {
            if (error) {
                return response.json({
                    ok: false,
                    error
                });
            }

            User.count({ status: true }, (error, count) => {
                response.json({
                    ok: true,
                    users,
                    numOfUsers: count
                });
            });

        });

});


app.post('/user', [verifyToken, verifyRole], (request, response) => {
    let body = request.body;

    let salt = bcrypt.genSaltSync(10);
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, salt),
        role: body.role
    });

    user.save((error, userDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        return response.json({
            ok: true,
            user: userDB
        });

    });


});


app.put('/user/:id', [verifyToken, verifyRole], (request, response) => {
    let id = request.params.id;
    let body = _.pick(request.body, ['name', 'email', 'img', 'role', 'status']);


    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, userDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }
        response.json({
            ok: true,
            user: userDB
        });
    });
});

app.delete('/user/:id', [verifyToken, verifyRole], (request, response) => {
    let id = request.params.id;

    User.findByIdAndUpdate(id, { status: false }, { new: true }, (error, userDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }
        response.json({
            ok: true,
            user: userDB
        });
    });

});

module.exports = app;