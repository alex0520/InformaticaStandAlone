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
    connection.queue('QEntrada', {
        durable: true
        , autoDelete: false
    }, function (cola) {
        log4c.log('Queue ' + cola.name + ' is open');

        // comodin para capturar todos los mensajes
        cola.bind('#');
        cola.subscribe({
            ack: true
            , prefetchCount: 1
        }, function (message, headers, deliveryInfo, ack) {
            log4c.log("------------------------ Se Recibe mensaje de la cola ------------------------");
            log4c.log('\t dato:[' + message + ']');
            try {
                dispensador.entregarDulce(message, function () {
                    ack.acknowledge();
                    log4c.log("ack enviado");
                });
            } catch (err) {
                log4c.log('\t !ERROR DESPACHANDO : se escribe en la cola \t dato:[' + message + ']');
                escribirCola('{"id": "' + idProcess + '", "codigo": "2"}');
                log4c.log(err.message);
                ack.acknowledge();
                log4c.log("ack enviado");
            }
        });
    });
});

connection.on('error', function () {
    console.error(arguments);
});

function escribirCola(mensaje) {
    connection.publish('QSalida', mensaje);
}

exports.escribirCola = escribirCola;