class Circuit {
	constructor(cW, cH, canvas) {
		this.Resize(cW, cH);
		this.canvas = canvas;
		this.leds = [];
		this.BuildLeds();
	}

	Draw() {
		var ctx = this.canvas.getContext("2d");
		var left = this.cx - this.cpuW / 2;
		var right = this.cx + this.cpuW / 2;
		var top = this.cy - this.cpuH/2;
		var bottom = this.cy + this.cpuH/2;

		ctx.rect(this.cx - this.cpuW / 2, this.cy - this.cpuH / 2, this.cpuW, this.cpuH);
		ctx.fill();

		var r = 15;
		for (var i = 0; i < this.leds.length; i++)
		{
			var mapx = Math.max(Math.min(Math.abs(Math.abs(this.leds[i].x * this.cW*2) - this.cW), this.cW - r), r);
			var mapy = Math.max(Math.min(Math.abs(Math.abs(this.leds[i].y * this.cH*2) - this.cH), this.cH - r), r);
			ctx.beginPath();
			ctx.arc(mapx, mapy, r, 0, 2 * Math.PI);
			ctx.strokeStyle = "black";
			ctx.stroke();
			
			var thicc = 5;
			if (mapy < top)
			{
				// above case
				// draw the rect that connects directly to the cpu
				var vertx = (Math.floor(Math.random() * this.cpuW / 2) + left);
				var verty = mapy;
				var vertdis = top - mapy;
				ctx.fillStyle = "black";
				ctx.fillRect(vertx, verty, thicc, vertdis);

				var horix;
				if (mapx < vertx)
					horix = mapx;
				else
					horix = vertx;
				var horiy = mapy;
				var horidis = Math.abs(mapx - vertx);
				ctx.fillRect(horix, horiy, horidis, thicc);
			}
			else if (mapy > bottom)
			{
				// below case
				// draw the rect that connects directly to the cpu
				var vertx = (Math.floor(Math.random() * this.cpuW / 2) + left);
				var verty = bottom;
				var vertdis =  Math.round(mapy - bottom) + 5;
				ctx.fillStyle = "black";
				ctx.fillRect(vertx, verty, thicc, vertdis);

				var horix;
				if (mapx < vertx)
					horix = mapx;
				else
					horix = vertx;
				var horiy = mapy;
				var horidis = Math.abs(mapx - vertx);
				ctx.fillRect(horix, horiy, horidis, thicc);
			}
			else if (mapx < left)
			{
				// left case
			}
			else if (mapx > right)
			{
				// right case
			}


			ctx.beginPath();
			ctx.arc(mapx, mapy, r - 2, 0, 2 * Math.PI);
			ctx.fillStyle = "white";
			ctx.fill();
		}
	}

	Update() {

	}

	Resize(cW, cH) {
		this.cW = cW;
		this.cH = cH;

		this.cx = cW / 2;
		this.cy = cH / 2;

		this.cpuW = Math.abs(0.2 * this.cW);
		this.cpuH = Math.abs(0.2 * this.cH);
	}

	BuildLeds() {

		var prevX = 0;
		var prevY = 0;

		var nextX = 0;
		var nextY = 0;

		// random range x
		var rrX = 1;
		var rrY = 1;

		// For 12 different leds randomly generate points and make sure they aren't inside of the CPU sides + 1
		for (var i = 0; i < 12; i++)
		{
			var nextX = (Math.random() * rrX * 2) - rrX;
			while (prevX == nextX || (nextX < 0.5 && -0.5 < nextX))
			{
				nextX = (Math.random() * rrX * 2) - rrX;
			}

			nextY = (Math.random() * rrY * 2) - rrY;
			while (prevY == nextY || (nextY < 0.3 && nextY > -0.3))
			{
				nextY = (Math.random() * rrY * 2) - rrY;
			}

			prevX = nextX;
			prevY = nextY;

			// TODO map coords into the canvas
			this.leds.push({ x: nextX, y: nextY });
		}
	}
}