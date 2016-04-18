var amqp = require('amqp');
var dispensador = require('./dispensarDulce');

var connection = amqp.createConnection({
    host: '52.37.50.140'
    , port: 5672
    , login: 'alozano'
    , password: 'alex506071006'
});

connection.on('ready', function () {
    console.log('Conexión hecha con RabbitMQ y lista para ser usada');
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

            // comodin para capturar todos los mensajes
            cola.bind('#');

            cola.subscribe(function (message) {
                var buffer = new Buffer(message.data);
                console.log("Mensaje obtenido ", buffer.toString());
                try {
                    dispensador.entregarDulce();
                    escribirCola('{"id": "' + buffer.toString() + '”, "codigo": "0"}');
                } catch (err) {
                    console.error(err.message);
                    escribirCola('{"id": "' + buffer.toString() + '”, "codigo": "1"}');
                }
            });
        });
    }, 1000);
})(connection);