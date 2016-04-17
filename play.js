require('child_process').exec('/home/pi/music.sh', function (err, stdout, stderr) {
    if (err) {
        return console.log(err);
    }
    console.log(stdout);
});