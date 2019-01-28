const express = require('express');

let { verifyToken, verifyRole } = require('../middlewares/auth');

const app = express();

let Category = require('../models/category');


// CRUD to manage category requests


app.get('/category', verifyToken, (req, resp) => {

    Category.find({})
        .populate('user', 'name email')
        .exec((error, categories) => {

            if (error) {
                return resp.status(500).json({
                    ok: false,
                    error
                });
            }

            resp.json({
                ok: true,
                categories
            });
        });
});

app.get('/category/:idCategory', (req, resp) => {
    let idCategory = req.params.idCategory

    Category.findById(idCategory, (error, categoryDB) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoryDB) {
            return resp.status(400).json({
                ok: false,
                error
            });
        }

        return resp.json({
            ok: true,
            category: categoryDB
        });
    });
});


app.post('/category', [verifyToken], (req, resp) => {
    let body = req.body;
    let idUser = req.user._id;

    let newCategory = new Category({
        description: body.description,
        user: idUser
    });

    newCategory.save((error, categoryDB) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoryDB) {
            return resp.status(400).json({
                ok: false,
                error
            });
        }

        return resp.json({
            ok: true,
            category: categoryDB
        });
    });
});


app.put('/category/:idCategory', (req, resp) => {

    let idCategory = req.params.idCategory;
    let newDescription = req.body.description;

    Category.findByIdAndUpdate(idCategory, { description: newDescription }, { new: true, runValidators: true }, (error, categoryDB) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoryDB) {
            return resp.status(400).json({
                ok: false,
                error
            });
        }

        return resp.json({
            ok: true,
            category: categoryDB
        });
    });

});


app.delete('/category/:idCategory', [verifyToken, verifyRole], (req, resp) => {

    let idCategory = req.params.idCategory;

    Category.findByIdAndRemove(idCategory, (error) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                error
            });
        }

        return resp.json({
            ok: true,
            delete: 'Category was deleted succesfully: ' + idCategory
        });

    });

});

module.exports = app;