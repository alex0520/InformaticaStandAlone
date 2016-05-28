#!/bin/sh -
### BEGIN INIT INFO
# Provides:          MaquinaServicio.sh
# Required-Start:    
# Required-Stop:     
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Permite iniciar el servicio de la maquina de dulces.
# Description:       Permite iniciar el servicio de la maquina de dulces.
### END INIT INFO
pathQueueManager=/home/pi/env/dev/InformaticaStandAlone
pathLog=/var/logMaquina/maqDulces_$(date +%Y-%m-%d).log
startMusic=/home/pi/env/dev/InformaticaStandAlone/music_.mp3
case "$1" in
   "status") 
           cant_procesos=$(ps -fea | awk '/queuemanager.js/{print $0}' | wc -l)
           if [ "$cant_procesos" = "1" ]
           then
                echo -e servicio maquina de dulces ...     "\e[31mAbajo\e[0m" | tee -a $pathLog
           else
                echo -e servicio maquina de dulces ...   "\e[92m[Arriba].\e[0m" | tee -a $pathLog
           fi
           
   ;;   
   "stop") 
           echo ------------------------------------------- | tee -a $pathLog
           echo Finalizando Servicio de la maquina de dulces. | tee -a $pathLog
           echo ------------------------------------------- | tee -a $pathLog
           ps -fea | awk '/queuemanager.js/{ print "kill", -9, $2}' | sh -v 
           echo ------------------------------------------- | tee -a $pathLog | tee -a $pathLog
           echo -e Servicio Maquina de dulces Finalizada "\e[92m[OK].\e[0m" | tee -a $pathLog
           echo -e "\e[93mRUTA DEL LOG  $pathLog \e[0m" | tee -a $pathLog
           echo ------------------------------------------- | tee -a $pathLog
   ;;
   "start") 
           echo ------------------------------------------- | tee -a $pathLog
           echo Iniciando Servicio de la maquina de dulces. | tee -a $pathLog
           echo ------------------------------------------- | tee -a $pathLog
           echo Seteando volume de la maquina | tee -a $pathLog
           echo informacion de sonido: | tee -a $pathLog
           amixer controls | tee -a $pathLog
           amixer cget numid=1 | tee -a $pathLog
           echo seteamos el volume a 110%..... | tee -a $pathLog
           amixer cset numid=1 110% | tee -a $pathLog
           echo validamos que no exista una instancia ya activa | tee -a $pathLog
           cant_procesos=$(ps -fea | awk '/queuemanager.js/{print $0}' | wc -l)
           echo cantidad de procesos en ejecucion $cant_procesos | tee -a $pathLog
           if [ "$cant_procesos" = "1" ]
           then
              node $pathQueueManager/queuemanager.js >> $pathLog & 
           else
              echo | tee -a $pathLog
              echo | tee -a $pathLog
              echo -e "\e[31mSERVICIO YA INICIADO\e[0m" | tee -a $pathLog
              echo | tee -a $pathLog
              echo | tee -a $pathLog
              exit 0
           fi
           echo | tee -a $pathLog
           echo | tee -a $pathLog
           echo SERVICIO INICIADO | tee -a $pathLog
           mpg123 $startMusic
           echo | tee -a $pathLog
           echo | tee -a $pathLog
           echo ------------------------------------------- | tee -a $pathLog   
           echo -e Iniciando Servicio de la maquina de dulces   "\e[92m[OK].\e[0m" | tee -a $pathLog
           echo -e "\e[93mRUTA DEL LOG  $pathLog \e[0m" | tee -a $pathLog
           echo ------------------------------------------- | tee -a $pathLog
   ;;
   *)
           echo "Mal invocado utilizar [start|stop|status]"
esac
exit 0
