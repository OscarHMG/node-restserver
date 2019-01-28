const express = require('express');
let { verifyToken } = require('../middlewares/auth');

const app = express();

let Product = require('../models/product');

app.get('/product', verifyToken, (req, resp) => {

    let since = Number(req.query.since) || 0;
    let limit = Number(req.query.limit) || 5;

    Product.find({})
        .skip(since)
        .limit(limit)
        .exec((error, products) => {

            if (error) {
                return resp.status(500).json({
                    ok: false,
                    error
                });
            }

            resp.json({
                ok: true,
                products
            });
        });
});


app.get('/product/:idProduct', verifyToken, (req, resp) => {
    let idProduct = req.params.idProduct;


    Product.findById(idProduct, (error, productDB) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                error
            });
        }

        if (!productDB) {
            return resp.status(400).json({
                ok: false,
                error
            });
        }

        return resp.json({
            ok: true,
            category: productDB
        });
    });

});


app.post('/product', [verifyToken], (req, resp) => {
    let body = req.body;
    let idUser = req.user._id;

    let newProduct = new Product({
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




module.exports = app;