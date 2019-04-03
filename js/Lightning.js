
// Retrieved from
//https://codepen.io/Nvagelis/pen/yaQGAL


var canvas = document.getElementById('lightning');
var ctx = canvas.getContext('2d');

var leds = [];
var lightning = [];
var lightTimeCurrent = 0;
var lightTimeTotal = 0;

var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;
window.addEventListener('resize', function () {
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

function createLightning() {

	// for every led.
	// need 3rd for lol.
	for (var l = 0; l < leds.length; l++)
	{
		var storm = [];
		for (var i = 0; i < 1; i++)
		{
			var x = random(leds[l].x - leds[l].radius*2, leds[l].x + leds[l].radius*2);
			var y = random(leds[l].y - leds[l].radius*2, leds[l].y + leds[l].radius*2);

			var xrange = random(3, 7);
			var yrange = random(2, 4);
			if (x > leds[l].x)
				xrange = -xrange;
			if (y > leds[l].y)
				yrange = -yrange;
			
			var light = [];
			var createCount = random(1, 3);
			for (var j = 0; j < createCount; j++)
			{
				single = {
					x: x,
					y: y,
					xRange: xrange,
					yRange: yrange,
					path: [{
						x: x,
						y: y
					}],
					pathLimit: random(10, 35)
				};
				light.push(single);
			}

			storm.push(light);
		}

		lightning.push(storm);
	}
};

function drawLightning() {
	for (var i = 0; i < lightning.length; i++)
	{
		for (var j = 0; j < lightning[i].length; j++)
		{
			for (var k = 0; k < lightning[i][j].length; k++)
			{
				var light = lightning[i][j][k];

				light.path.push({
					x: light.path[light.path.length - 1].x + (random(0, light.xRange) - (light.xRange / 2)),
					y: light.path[light.path.length - 1].y + (random(0, light.yRange))
				});

				if (light.path.length > light.pathLimit)
				{
					lightning[i][j].splice(k, 1);
				}

				ctx.strokeStyle = 'rgba(255, 255, 255, .5)';
				ctx.lineWidth = 3;
				if (random(0, 15) === 0)
				{
					ctx.lineWidth = 6;
				}
				if (random(0, 30) === 0)
				{
					ctx.lineWidth = 8;
				}

				ctx.beginPath();
				ctx.moveTo(light.x, light.y);
				for (var pc = 0; pc < light.path.length; pc++)
				{
					ctx.lineTo(light.path[pc].x, light.path[pc].y);
				}
				ctx.lineJoin = 'miter';
				ctx.stroke();
			}
		}
	}
};

function animateLightning() {
	clearCanvas3();
	lightTimeCurrent++;
	if (lightTimeCurrent >= lightTimeTotal)
	{
		createLightning();
		lightTimeCurrent = 0;
		lightTimeTotal = 20;
	}
	drawLightning();
}

function LightningLeds(pLeds)
{
	leds = pLeds;
}

function animloop() {
	// leds = [ {x: 100, y:100, radius:10 }, {x: 200, y:250, radius:10 }, {x: 300, y:200, radius:10 } ];
	animateLightning();
	requestAnimationFrame(animloop);
}
animloop();