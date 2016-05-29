var amqp = require('amqp');
var dispensador = require('./dispensarDulce');
var log4c = require('./log4Candy');
//var musica = require('./play');

var connection = amqp.createConnection({
    host: '52.37.50.140'
    , port: 5672
    , login: 'alozano'
    , password: 'alex506071006'
});

connection.on('ready', function () {
    log4c.log('Conexión hecha con RabbitMQ y lista para ser usada');
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
            log4c.log('Queue ' + cola.name + ' is open');

            // comodin para capturar todos los mensajes
            cola.bind('#');
            cola.subscribe({
                ack: true
            }, function (message, headers, deliveryInfo, ack) {
                log4c.log("------------------------ Se Recibe mensaje de la cola ------------------------");
                log4c.log('\t dato:[' + message + ']');
                try {
                    dispensador.entregarDulce(message, function () {
                        ack.acknowledge();
                    });
                } catch (err) {
                    log4c.log('\t !ERROR DESPACHANDO : se escribe en la cola \t dato:[' + message + ']');
                    escribirCola('{"id": "' + idProcess + '", "codigo": "2"}');
                    console.error(err.message);
                    ack.acknowledge();
                }
            });
        });
    }, 1000);
})(connection);

exports.escribirCola = escribirCola;