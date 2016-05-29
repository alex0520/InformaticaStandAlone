ps -fea | awk ' /mpg123/ {print "sudo kill -9 ",$2}' | sh
ruta=$(dirname $0)
mpg123 $ruta/music.mp3