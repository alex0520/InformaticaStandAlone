pathQueueManager=/home/pi/env/dev/InformaticaStandAlone
echo -------------------------------------------
echo Iniciando Servicio de la maquina de dulces.
echo -------------------------------------------
echo Seteando volume de la maquina
echo informacion de sonido:
amixer controls
amixer cget numid=1
echo seteamos el volume a 110%.....
amixer cset numid=1 110%
echo validamos que no exista una instancia ya activa
cant_procesos=$(ps -fea | awk '/queuemanager.js/{print $0}' | wc)
if[$cant_procesos -eq 1];
then
   node $pathQueueManager/queuemanager.js
fi
echo servicio arriba!

