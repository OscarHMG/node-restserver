const express = require('express');
const fs = require('fs');

//Build absolute path
const path = require('path');
const { verifyToken } = require('../middlewares/auth');

const app = express();

app.get('/image/:type/:img', verifyToken, (req, resp) => {
    let type = req.params.type;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${img}`);
    let noImgPath = path.resolve(__dirname, '../assets/no-image.jpg');

    if (fs.existsSync(pathImg))
        resp.sendFile(pathImg);
    else
        resp.sendFile(noImgPath);








});


module.exports = app;