var gpio = require('rpi-gpio');

ultimoEstado=false;
valor08=0;
valor10=0;

gpio.on('change', function(channel, value) {
    if(ultimoEstado!=value){
        console.log('\tSENSOR : Cambio el estado del pin 12 ' + value);
        if(value==true){
            console.log('\tSENSOR : el senso esta libre, detiene el motor');
            iniciarMotor();

        }else{
            console.log('\tSENSOR : el sensor esta ocupado, inicio el motor');
            detenerMotor();
        }
        ultimoEstado=value;
    }

});



function iniciarMotor(){
    console.log('Inicia el motor');
    valor08=1;
    valor10=0;
    gpio.write(8, 5000);
    gpio.write(10, 0);
}

function detenerMotor(){
    console.log('Detiene el motor');
    valor08=1;
    valor10=1;
    gpio.write(8, 0);
    gpio.write(10, 0);
}

function inicializarPins(){
    gpio.setup(08, gpio.DIR_OUT);
    gpio.setup(10, gpio.DIR_OUT);
}


function lecturaPin(){
    gpio.read(12, function(err, value) {
        console.log('\tSENSOR : El valor inicial es?  ' + value);
        ultimoEstado = value;
        if(value==true){
            iniciarMotor();
        }else{
            detenerMotor();
        }
    });
}


inicializarPins();
gpio.setup(12, gpio.DIR_IN, gpio.EDGE_BOTH , lecturaPin);
