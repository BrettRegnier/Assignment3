
// Retrieved from
//https://codepen.io/Nvagelis/pen/yaQGAL


var canvas = document.getElementById('lightning');
var ctx = canvas.getContext('2d');

var lightning = [];
var lightTimeCurrent = 0;
var lightTimeTotal = 0;

var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;
window.addEventListener('resize', function() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

function random(min, max) {
  return Math.random() * (max - min + 1) + min;
}

function clearCanvas3() {
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
};

// TODO add x and y parameters.
// TODO make list of leds that will have lightning attached to it.
// TODO delete no longer needed lightning after a refresh of tweets.
// TODO create list of lightnings
// TODO make random placement of lighting within a box of tweets.
// TODO change frequency of lightning stikes.
// TODO end position can be the center of the LED.
// TODO choose random position within a square to start the lightning tendrils.
function createLightning() {
  var x = 100;
  var y = 100;

  var createCount = random(1, 3);
  for (var i = 0; i < createCount; i++) {
    single = {
      x: x,
      y: y,
      xRange: 3,
      yRange: 3,
      path: [{
        x: x,
        y: y
      }],
      pathLimit: random(40, 55)
    };
    lightning.push(single);
  }
};

function drawLightning() {
  for (var i = 0; i < lightning.length; i++) {
    var light = lightning[i];

    light.path.push({
      x: light.path[light.path.length - 1].x + (random(0, light.xRange) - (light.xRange / 2)),
      y: light.path[light.path.length - 1].y + (random(0, light.yRange))
    });

    if (light.path.length > light.pathLimit) {
      lightning.splice(i, 1);
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, .5)';
    ctx.lineWidth = 3;
    if (random(0, 15) === 0) {
      ctx.lineWidth = 6;
    }
    if (random(0, 30) === 0) {
      ctx.lineWidth = 8;
    }

    ctx.beginPath();
    ctx.moveTo(light.x, light.y);
    for (var pc = 0; pc < light.path.length; pc++) {
      ctx.lineTo(light.path[pc].x, light.path[pc].y);
    }
    ctx.lineJoin = 'miter';
    ctx.stroke();
  }
};

function animateLightning() {
  clearCanvas3();
  lightTimeCurrent++;
  if (lightTimeCurrent >= lightTimeTotal) {
    createLightning();
    lightTimeCurrent = 0;
    lightTimeTotal = 200;  //rand(100, 200)
  }
  drawLightning();
}

function init() {
}
init();

function animloop() {
  animateLightning();
  requestAnimationFrame(animloop);
}
animloop();