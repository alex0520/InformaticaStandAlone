var music = require('child_process');

function reproducirMusica() {
    music.exec('/home/pi/env/dev/InformaticaStandAlone/music.sh', function (err, stdout, stderr) {
        if (err) {
            return console.log(err);
        }
        console.log(stdout);
    });
}

export.reproducirMusica = reproducirMusica;