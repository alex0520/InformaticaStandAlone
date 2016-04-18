var gpio=require("pi-gpio");
stopMotors = false;
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
gpio.open(16,"output",function(err){     
  console.log("Pin 16 open"); // Opens pin 16 as output   
});
gpio.open(18,"output",function(err){     
  console.log("Pin 18 open"); // Opens pin 18 as output   
});
// Runs motor in the set direction
function move() {
   gpio.write(16, 1, function() { 
        sleep(1000);   
         gpio.write(16, 0, function() { 
            sleep(1000); 
            if(!stopMotors)move(); 
        });      
      }); 
}
function stopMotor() {
  stopMotors = true;
}
// Changing direction of motor
function left() {
  stopMotors = false;
  gpio.write(18, 1, function() { 
      move();
  });  
}
// Changing direction of motor
function right() {
  stopMotors = false;
  gpio.write(18, 0, function() { 
      move();
  });   
}
//- See more at: http://www.sundh.com/blog/2014/02/control-stepper-motors-with-raspberry-pi-and-node-js/#sthash.wv8W5Dl9.dpuf
