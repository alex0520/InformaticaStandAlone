var music = require('child_process');
var log4c = require('./log4Candy');

function reproducirMusica() {
    log4c.log("\t Reproduccion Cancion.")
    music.exec('/home/pi/env/dev/InformaticaStandAlone/music.sh', function (err, stdout, stderr) {
        if (err) {
            return log4c.log("!!! Reproduccion Error : ", err);
        }
        log4c.log(stdout);
    });
}

exports.reproducirMusica = reproducirMusica;