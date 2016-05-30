var amqp = require('amqp');
var dispensador = require('./dispensarDulce');
var log4c = require('./log4Candy');
//var musica = require('./play');

var connection = null ;
var queue = null;

function start(){
    var conn = amqp.createConnection({
    host: '52.37.50.140'
    , port: 5672
    , login: 'alozano'
    , password: 'alex506071006'
    , heartbeat : 30
},{reconnect: false});
     conn.on("error", function(err) {
      if (err.message !== "Connection closing") {
        console.error("[AMQP] conn error", err.message);
      }
      conn.close();
    });
    conn.on("close", function() {
      console.error("[AMQP] reconnecting");
        if(queue){
            queue.destroy();
        }
      conn.destroy();
      return setTimeout(start, 5000);
    });
    conn.on('ready',function(){
        console.log("[AMQP] connected");
        connection = conn;
        whenConnected();    
    });
    
}

function whenConnected(){
    log4c.log('Conexión hecha con RabbitMQ y lista para ser usada');
    dispensador.initDispensador();
    queue = connection.queue('QEntrada', {
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
    queue.on("error", function(err) {
        console.error("[AMQP] queue error", err.message);
        queue.close();
    });
    queue.on("close", function() {
      queue.destroy();
      conn.close();
      return setTimeout(start, 5000);
    });
}

function escribirCola(mensaje) {
    connection.publish('QSalida', mensaje);
}

start();

exports.escribirCola = escribirCola;