class Circuit {
	constructor(cW, cH, canvas) {
		this.Resize(cW, cH);
		this.canvas = canvas;
		this.leds = [];
		this.BuildLeds();
	}

	Draw() {
		for (var i = 0; i < this.leds.length; i++)
		{
			var ctx = this.canvas.getContext("2d");
			ctx.beginPath();
			ctx.arc(this.leds[i].x, this.leds[i].y, 10, 0, 2 * Math.PI);
			ctx.stroke();
		}
	}

	Update() {
		
	}

	Resize(cW, cH) {
		this.cW = cW;
		this.cH = cH;
		
		this.cx = cW / 2;
		this.cy = cH / 2;
		
		
	}

	BuildLeds() {

		var prevX = 0;
		var prevY = 0;

		var nextX = 0;
		var nextY = 0;

		// random range x
		 var rrX = 20;
		 var rrY = 20;

		// For 12 different leds randomly generate points and make sure they aren't inside of the CPU sides + 1
		for (var i = 0; i < 12; i++)
		{
			var nextX = Math.floor((Math.random() * rrX*2) - rrX);
			while (prevX == nextX || (nextX < 6 && nextX > -6))
			{
				nextX = Math.floor((Math.random() * rrX*2) - rrX);
			}

			nextY = Math.floor((Math.random() * rrY*2) - rrY);
			while (prevY == nextY || (nextY < 6 && nextY > -6))
			{
				nextY = Math.floor((Math.random() * rrY*2) - rrY);
			}

			prevX = nextX;
			prevY = nextY;

			// TODO map coords into the canvas
			this.leds.push({ x: nextX, y: nextY });
		}
	}
}