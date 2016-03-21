var express = require('express');
var app = express();

app.post('/hw.v1.entrega', function (req, res) {
    res.header("Content-Type", "application/json");
    console.log("recibe peticion para entregar dulce");
    //TO-DO: logica para enviar dulce
    res.status(200);
    res.send('{"codigo": "0”, “descripcion”: “descripción: [Recibido]”}');
});

app.get('/hw.v1.entrega', function (req, res) {
    res.header("Content-Type", "application/json");
    console.log("recibe peticion para entregar dulce");
    //TO-DO: logica para enviar dulce
    res.status(200);
    res.send('{"codigo": "0”, “descripcion”: “descripción: [Recibido]”}');
});


var server = app.listen(80, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("Escuchando por http://%s:%s", host, port);

});