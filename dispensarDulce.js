var gpio = require('rpi-gpio');
var musica = require('./play');
var qmanager = require('./queuemanager');
var log4c = require('./log4Candy');

ultimoEstado = false;
motorIniciado = false;
pasoDulce = false;
idProcess = "";

gpio.on('change', function (channel, value) {
    log4c.log('value: ' + value);
    if (value == false) {
        //Al cambio de estado del sensor se detiene el motor, si esta iniciado        
        if (motorIniciado) {
            log4c.log('paso el dulce');
            pasoDulce = true;
            musica.reproducirMusica();
            detenerMotor();
            motorIniciado = false;
        }
    }
});



function iniciarMotor() {
    //    if(estadoSensor()){
    log4c.log('Inicia el motor');
    gpio.write(8, 500000);
    gpio.write(10, 0);
    //    }else{
    //        console.error('No se puede dispensar el dulce, el sensor parece estar obstruido')
    //    }

}

function detenerMotor() {
    log4c.log('Detiene el motor');
    gpio.write(8, 0);
    gpio.write(10, 0);
}

function inicializarPins() {
    log4c.log('Se inician los pines 08,10,12');
    gpio.setup(12, gpio.DIR_IN, gpio.EDGE_BOTH, lecturaPin);
    gpio.setup(08, gpio.DIR_OUT, on);
    gpio.setup(10, gpio.DIR_OUT, on);
    setTimeout(function () {
        detenerMotor()
    }, 1000);;
}

function on() {
    log4c.log(' Inicializa pin output Ok');
}


function lecturaPin() {
    log4c.log('Obtenemos el estado actual del PIN del sensor');
    gpio.read(12, function (err, value) {
        log4c.log('\tSENSOR : El valor inicial es?  ' + value);
        ultimoEstado = value;
        /*if(value==true){
            iniciarMotor();
        }else{
            detenerMotor();
        }*/
    });
}

module.exports = {
    initDispensador: function () {
        inicializarPins();
    }
    , entregarDulce: function dispensarDulce(_id, success) {
        success = (typeof success === 'function') ? success : function () {};
        idProcess = _id;
        pasoDulce = false;
        iniciarMotor();
        motorIniciado = true;
        setTimeout(function () {
            if (!pasoDulce) {
                detenerMotor();
                motorIniciado = false;
                log4c.log("\t NO HAY DULCE!");
                qmanager.escribirCola('{"id": "' + idProcess + '", "codigo": "1"}');
            } else {
                qmanager.escribirCola('{"id": "' + idProcess + '", "codigo": "0"}');
            }
            success();
        }, 2500);
    }
    , estadoSensor: function () {
        return estadoSensor();
    }
}


function estadoSensor() {
    var estado;
    estado = gpio.read(12, function (err, value, estado) {
        estado = value;
        return value;
    });
    setTimeout(function () {}, 2000);
    return estado;
}




//inicializarPins();
//setTimeout(function() {
//    dispensarDulce();
//}, 3000);
log4c.log('Ok.');