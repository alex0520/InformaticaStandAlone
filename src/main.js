var menuHandler;

var dispensador = require('./dispensarDulce');
var menu = require('node-menu');

//inicializa
function inicializar(){
    
    dispensador.initDispensador();
    setTimeout(function() {
        mostrarMenu();
        process.stdin.setEncoding('utf8');
        process.stdin.on('readable', checkMenu);
    }, 3000);
    function checkMenu() {
        
            var input = process.stdin.read();
            if(input !== null) {
                menuHandler(input.trim());
            }
        
    }
}

function mostrarMenu(){
    console.log(
        '1 = Dispensar Dulce' + '\n' +
        '2 = Reproducir Cancion'  + '\n' +
        '3 = Estado Sensor'  + '\n' +
        '4 = Exit'  + '\n\n' +
        'Choose number, then press ENTER:'
        );
    menuHandler = function(input){
        switch(input) {
            case '1': dispensador.entregarDulce(); break;
            case '2': console.log('no integrado aun'); break;
            case '3': console.log('Estado del sensor ' + dispensador.estadoSensor()); break;
            case '4': process.exit(); break;            
        }
        mostrarMenu();
    };
}


inicializar();

