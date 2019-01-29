const express = require('express');
let { verifyToken } = require('../middlewares/auth');
const _ = require('underscore');
const app = express();

let Product = require('../models/product');

app.get('/product', verifyToken, (req, resp) => {

    let since = Number(req.query.since) || 0;
    let limit = Number(req.query.limit) || 5;

    Product.find({ avalaible: true })
        .skip(since)
        .limit(limit)
        .populate('user', 'name email')
        .populate('category', 'description')
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


    Product.findById(idProduct)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((error, productDB) => {
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
                product: productDB
            });
        });

});

//Search product
app.get('/product/search/:text', verifyToken, (req, resp) => {

    let textToSearch = req.params.text;
    let regex = new RegExp(textToSearch, 'i');

    Product.find({ name: textToSearch })
        .populate()
        .exec((error, products) => {
            if (error) {
                return resp.status(500).json({
                    ok: false,
                    error
                });
            }

            return resp.json({
                ok: true,
                products: products
            });
        });

});



app.post('/product', verifyToken, (req, resp) => {
    let body = req.body;
    let idUser = req.user._id;

    let newProduct = new Product({
        name: body.name,
        priceUni: Number(body.priceUni),
        description: body.description,
        category: body.category,
        user: idUser
    });

    newProduct.save((error, productDB) => {
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
            product: productDB
        });
    });
});


app.put('/product/:idProduct', verifyToken, (req, resp) => {
    let idProduct = req.params.idProduct;

    let body = _.pick(req.body, ['name', 'priceUni', 'description', 'avalaible']);

    Product.findByIdAndUpdate(idProduct, body, { new: true, runValidators: true }, (error, productDB) => {
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
            product: productDB
        });
    });
});


app.delete('/product/:idProduct', verifyToken, (req, resp) => {
    let idProduct = req.params.idProduct;

    Product.findByIdAndUpdate(idProduct, { avalaible: false }, { new: true, runValidators: true }, (error, productDB) => {
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
            product: productDB
        });
    });

});


module.exports = app;