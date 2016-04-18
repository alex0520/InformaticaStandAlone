var gpio = require('rpi-gpio');

ultimoEstado=false;
motorIniciado=false;


function dispensarDulce(){
    iniciarMotor();
    motorIniciado =true; 
}

gpio.on('change', function(channel, value) {
    if(ultimoEstado!=value){        
        //Al cambio de estado del sensor se detiene el motor, si esta iniciado
        console.log('cambio el sensor');
        if(motorIniciado){
            console.log('paso el dulce');
            detenerMotor();
            motorIniciado=false;
        }        
        ultimoEstado=value;
    }

});



function iniciarMotor(){
//    if(estadoSensor()){
        console.log('Inicia el motor');
        gpio.write(8, 500000);
        gpio.write(10, 0);
//    }else{
//        console.error('No se puede dispensar el dulce, el sensor parece estar obstruido')
//    }
    
}

function detenerMotor(){
    console.log('Detiene el motor');    
    gpio.write(8, 0);
    gpio.write(10, 0);
}

function inicializarPins(){
console.log('Se inician los pines 08,10,12');
    gpio.setup(12, gpio.DIR_IN, gpio.EDGE_BOTH , lecturaPin);
    gpio.setup(08, gpio.DIR_OUT,on);
    gpio.setup(10, gpio.DIR_OUT,on);        
    setTimeout(function() {
        detenerMotor()
    }, 1000);
    ;
}

function on(){
    console.log(' Inicializa pin output Ok');
}


function lecturaPin(){
    console.log('Obtenemos el estado actual del PIN del sensor');
    gpio.read(12, function(err, value) {
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
  initDispensador: function(){
    inicializarPins();
  },
  entregarDulce: function(){
    dispensarDulce();
  },
  estadoSensor: function(){
    return estadoSensor();
  }
}


function estadoSensor(){
    var estado;
    estado = gpio.read(12, function(err, value ,estado){
            estado = value;
        return value;
    });
    setTimeout( function(){},2000);
    return estado;
}




//inicializarPins();
//setTimeout(function() {
//    dispensarDulce();
//}, 3000);
console.log('Ok.');

