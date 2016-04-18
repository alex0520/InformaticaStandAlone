ps -fea | awk ' /mpg123/ {print "sudo kill -9 ",$2}' | sh
mpg123 music.mp3

