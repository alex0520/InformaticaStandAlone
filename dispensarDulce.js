var gpio = require('rpi-gpio');
var musica = require('./play');
var qmanager = require('./queuemanager');

ultimoEstado = false;
motorIniciado = false;
pasoDulce = false;
idProcess = "";

gpio.on('change', function (channel, value) {
    console.log('value: ' + value);
    if (value == false) {
        //Al cambio de estado del sensor se detiene el motor, si esta iniciado        
        if (motorIniciado) {
            console.log('paso el dulce');
            pasoDulce = true;
            musica.reproducirMusica();
            detenerMotor();
            motorIniciado = false;
        }
    }
});



function iniciarMotor() {
    //    if(estadoSensor()){
    console.log('Inicia el motor');
    gpio.write(16, 500000);
    gpio.write(10, 0);
    //    }else{
    //        console.error('No se puede dispensar el dulce, el sensor parece estar obstruido')
    //    }

}

function detenerMotor() {
    console.log('Detiene el motor');
    gpio.write(16, 0);
    gpio.write(10, 0);
}

function inicializarPins() {
    console.log('Se inician los pines 08,10,12');
    gpio.setup(12, gpio.DIR_IN, gpio.EDGE_BOTH, lecturaPin);
    gpio.setup(16, gpio.DIR_OUT, on);
    gpio.setup(10, gpio.DIR_OUT, on);
    setTimeout(function () {
        detenerMotor()
    }, 1000);;
}

function on() {
    console.log(' Inicializa pin output Ok');
}


function lecturaPin() {
    console.log('Obtenemos el estado actual del PIN del sensor');
    gpio.read(12, function (err, value) {
        console.log('\tSENSOR : El valor inicial es?  ' + value);
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
                console.log("No hay dulce");
                qmanager.escribirCola('{"id": "' + idProcess + '", "codigo": "1"}');
            } else {
                qmanager.escribirCola('{"id": "' + idProcess + '", "codigo": "0"}');
            }
            success();
        }, 3500);
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
console.log('Ok.');