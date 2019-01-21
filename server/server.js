require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();



app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/user', (request, response) => {
    response.json('getUser');
});


app.post('/user', (request, response) => {
    let body = request.body;
    response.json('postUser');
});


app.put('/user/:id', (request, response) => {
    let id = request.params.id;
    response.json('putUser');
});

app.delete('/user', (request, response) => {
    response.json('deleteUser');
});

app.listen(process.env.PORT, () => {
    console.log('Listen in port:', process.env.PORT);
});