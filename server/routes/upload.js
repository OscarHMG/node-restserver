const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');


//Default options
app.use(fileUpload());

let allowedExtensions = ['png', 'jpg', 'gif', 'jpg'];
let allowedTypes = ['products', 'users'];

app.put('/upload/:type/:id', (req, resp) => {

    if (!req.files) {
        return resp.status(400).json({
            ok: true,
            error: {
                message: 'File was not selected'
            }
        });
    }

    //Get the params of the request
    let type = req.params.type;
    let id = req.params.id;

    //Get file informations
    let file = req.files.file;
    let nameFile = file.name.split('.');
    let extension = nameFile[nameFile.length - 1];


    //1st validate the type of the request (Folder)
    if (allowedTypes.indexOf(type) < 0) {
        return resp.status(400).json({
            ok: false,
            error: {
                message: 'Allowed types are ' + allowedTypes.join(', '),
                type
            }
        });
    }

    //Then validate the extensions of the file.
    if (allowedExtensions.indexOf(extension) < 0) {

        return resp.status(400).json({
            ok: false,
            error: {
                message: 'Allowed extension files are ' + allowedExtensions.join(', '),
                extension
            }
        });

    }

    //Now we have to change the img name (Add timestamp to avoid cache)
    let newNameFile = `${ id }-${ new Date().getMilliseconds() }.${ extension }`


    //Finally, save the image in the correct folder
    file.mv(`uploads/${ type }/${ newNameFile }`, (error) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                error
            });
        }

        //NOW I CAN SAVE THE IMG IN THE RESPECTIVE USER

        if (type === 'users')
            imgUser(id, resp, newNameFile);
        else
            imgProduct(id, resp, newNameFile);


    });
});


const imgUser = (idUser, resp, nameFile) => {
    User.findById(idUser, (error, userDB) => {
        if (error) {
            deleteFile(nameFile, 'users');
            return resp.status(500).json({
                ok: false,
                error
            });
        }

        if (!userDB) {
            deleteFile(nameFile, 'users');
            return resp.status(400).json({
                ok: false,
                error: {
                    message: 'User not exist in DB'
                }
            });
        }

        //Get the actual img path of the actual img and update delete the old one
        deleteFile(userDB.img, 'users');

        userDB.img = nameFile;

        userDB.save((error, userSaved) => {
            resp.json({
                ok: true,
                user: userSaved,
                img: nameFile
            });
        });

    });
}

const imgProduct = (idProduct, resp, nameFile) => {
    Product.findById(idProduct, (error, productDB) => {
        if (error) {
            deleteFile(nameFile, 'products');
            return resp.status(500).json({
                ok: false,
                error
            });
        }

        if (!productDB) {
            deleteFile(nameFile, 'products');
            return resp.status(400).json({
                ok: false,
                error: {
                    message: 'User not exist in DB'
                }
            });
        }

        //Get the actual img path of the actual img and update delete the old one
        deleteFile(productDB.img, 'products');

        productDB.img = nameFile;

        productDB.save((error, productSaved) => {
            resp.json({
                ok: true,
                product: productSaved,
                img: nameFile
            });
        });

    });
}


const deleteFile = (nameImg, type) => {

    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${nameImg}`);

    if (fs.existsSync(pathImg)) {
        //Exist, need to delete the img to update with the new one
        fs.unlinkSync(pathImg);
    }
}
module.exports = app;