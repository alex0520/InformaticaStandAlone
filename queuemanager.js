var amqp = require('amqp');
var dispensador = require('./dispensarDulce');
var musica = require('./play');

var connection = amqp.createConnection({
    host: '52.37.50.140'
    , port: 5672
    , login: 'alozano'
    , password: 'alex506071006'
});

connection.on('ready', function () {
    console.log('Conexión hecha con RabbitMQ y lista para ser usada');
    dispensador.initDispensador();
});

connection.on('error', function () {
    console.error(arguments);
});

function escribirCola(mensaje) {
    connection.publish('QSalida', mensaje);
}

(function (connection) {
    setTimeout(function () {

        connection.queue('QEntrada', {
            durable: true
            , autoDelete: false
        }, function (cola) {
            console.log('Queue ' + cola.name + ' is open');

            // comodin para capturar todos los mensajes
            cola.bind('#');

            cola.subscribe(function (message) {
                console.log('dato:[' + message + ']');
                console.log("Mensaje obtenido ", message);
                try {
                    dispensador.entregarDulce();
                    musica.reproducirMusica();
                    escribirCola('{"id": "' + message + '”, "codigo": "0"}');
                } catch (err) {
                    console.error(err.message);
                    escribirCola('{"id": "' + message + '”, "codigo": "1"}');
                }
            });
        });
    }, 1000);
})(connection);
