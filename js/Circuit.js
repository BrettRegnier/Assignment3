class Circuit {
	constructor(cW, cH, canvas) {
		this.Resize(cW, cH);
		this.canvas = canvas;
		this.leds = [];
		this.BuildLeds();
	}
	// TODO https://codepen.io/Nvagelis/pen/yaQGAL
	// TODO make leds glow/turn green when a tweet comes in.
	// todo make leds red when tweet has been viewed.
	// todo change hashtags to tech related stuff.

	Draw() {
		var ctx = this.canvas.getContext("2d");
		var left = this.cx - this.cpuW / 2;
		var right = this.cx + this.cpuW / 2;
		var top = this.cy - this.cpuH / 2;
		var bottom = this.cy + this.cpuH / 2;

		var rctx = this.cx - this.cpuW / 2;
		var rcty = this.cy - this.cpuH / 2;

		ctx.fillStyle = "#101010";
		ctx.fillRect(rctx, rcty, this.cpuW, this.cpuH);

		ctx.fillStyle = "#D7B740";
		ctx.fillRect(rctx + 2, rcty + 2, this.cpuW - 4, this.cpuH - 4);

		ctx.fillStyle = "#EBE3E0";
		ctx.fillRect(rctx + 4, rcty + 4, this.cpuW - 8, this.cpuH - 8);

		var innerstyle = 12;
		ctx.fillStyle = "#7E7C7D";
		ctx.fillRect(rctx + innerstyle - 1, rcty + innerstyle - 1, this.cpuW - (innerstyle * 2) + 2, this.cpuH - (innerstyle * 2) + 2);

		ctx.fillStyle = "#EFEAE6";
		ctx.fillRect(rctx + innerstyle, rcty + innerstyle, this.cpuW - innerstyle * 2, this.cpuH - innerstyle * 2);

		var r = 15;
		for (var i = 0; i < this.leds.length; i++) {

			ctx.fillStyle = "#D7B740";
			var thicc = 5;
			if (this.leds[i].y < top) {
				// above case
				// draw the rect that connects directly to the cpu
				var vertx = (Math.floor(Math.random() * this.cpuW / 2) + left);
				var verty = this.leds[i].y - 2;
				var vertdis = top - verty;
				ctx.fillRect(vertx, verty, thicc, vertdis);

				var horix;
				if (this.leds[i].x < vertx)
					horix = this.leds[i].x;
				else
					horix = vertx;
				var horiy = this.leds[i].y;
				var horidis = Math.abs(this.leds[i].x - vertx);
				ctx.fillRect(horix, horiy - 2, horidis, thicc);
			}
			else if (this.leds[i].y > bottom) {
				// below case
				// draw the rect that connects directly to the cpu
				var vertx = (Math.floor(Math.random() * this.cpuW / 2) + left);
				var verty = bottom;
				var vertdis = Math.round(this.leds[i].y - bottom) + 5;
				ctx.fillRect(vertx, verty, thicc, vertdis);

				var horix;
				if (this.leds[i].x < vertx)
					horix = this.leds[i].x;
				else
					horix = vertx;
				var horiy = this.leds[i].y;
				var horidis = Math.abs(this.leds[i].x - vertx);
				ctx.fillRect(horix, horiy, horidis, thicc);
			}
			else if (this.leds[i].x < left) {
				// TODO fix this
				// left case
				// draw the rect that connects directly with the cpu
				var horiy = (Math.floor(Math.random() * this.cpuH / 2) + top);
				var horix = this.leds[i].x;
				var horidis = Math.abs(this.leds[i].x - left);
				ctx.fillRect(horix, horiy, horidis, thicc);

				var verty;
				if (verty < horiy)
					verty = this.leds[i].y;
				else
					verty = horiy;
				var vertx = left;
				var vertdis = Math.abs(verty - this.leds[i].y);
				ctx.fillRect(vertx, verty, thicc, vertdis);

			}
			else if (this.leds[i].x > right) {
				// right case
			}
		}
		
		for (var i = 0; i < this.leds.length; i++)
		{
			ctx.beginPath();
			ctx.arc(this.leds[i].x, this.leds[i].y, this.leds[i].radius, 0, 2 * Math.PI);
			ctx.strokeStyle = "black";
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc(this.leds[i].x, this.leds[i].y, this.leds[i].radius - 1, 0, 2 * Math.PI);
			ctx.fillStyle = "white";
			ctx.fill();
			ctx.closePath();
		}
	}

	Update() {

	}

	Click(mouse) {
		for (var i = 0; i < this.leds.length; i++)
			if (this.Intersection(mouse, this.leds[i]))
				return { id: i, x: this.leds[i].x, y: this.leds[i].y };

		return -1;
	}

	Intersection(point, circle) {
		var r = Math.sqrt((point.x - (circle.x + circle.radius / 2)) ** 2 + (point.y - (circle.y + circle.radius / 2)) ** 2);
		return r < circle.radius;
	}

	Resize(cW, cH) {
		this.cW = cW;
		this.cH = cH;

		this.cx = cW / 2;
		this.cy = cH / 2;

		this.cpuW = Math.abs(0.2 * this.cH);
		this.cpuH = Math.abs(0.2 * this.cH);
	}

	BuildLeds() {

		var prevX = 0;
		var prevY = 0;

		var nextX = 0;
		var nextY = 0;

		// random range x
		var rrX = 2;
		var rrY = 2;
		var r = 16;
		
		var upBound = 1.2;
		var lowBound = 0.8;

		// TODO calculations for making any inputted amount be divided into 4 sections

		// Find right sided plotted points
		for (var i = 0; i < 3; i++) {
			nextX = Math.random() * rrX;
			while (prevX == nextX || nextX < upBound)
				nextX = Math.random() * rrX;
			nextY = Math.random() * rrY;

			prevX = nextX;
			prevY = nextY;

			var mapx = Math.max(Math.min((this.cW * nextX) / rrX, this.cW - 200), 200);
			var mapy = Math.max(Math.min((this.cH * nextY) / rrY, this.cH - 100), 100);

			this.leds.push({ x: mapx, y: mapy, radius: r });
		}

		// find left sided plotted points
		for (var i = 0; i < 3; i++) {
			nextX = Math.random() * rrX;
			while (prevX == nextX || nextX > lowBound)
				nextX = Math.random() * rrX;
			nextY = Math.random() * rrY;

			prevX = nextX;
			prevY = nextY;

			var mapx = Math.max(Math.min((this.cW * nextX) / rrX, this.cW - 200), 200);
			var mapy = Math.max(Math.min((this.cH * nextY) / rrY, this.cH - 100), 100);

			this.leds.push({ x: mapx, y: mapy, radius: r });
		}

		// find top sided plotted points
		for (var i = 0; i < 3; i++) {
			nextX = Math.random() * rrX;			
			nextY = Math.random() * rrY;
			while (prevY == nextY || nextY > lowBound)
				nextY = Math.random() * rrY;

			prevX = nextX;
			prevY = nextY;

			var mapx = Math.max(Math.min((this.cW * nextX) / rrX, this.cW - 200), 200);
			var mapy = Math.max(Math.min((this.cH * nextY) / rrY, this.cH - 100), 100);

			this.leds.push({ x: mapx, y: mapy, radius: r });
		}

		// find left sided plotted points
		for (var i = 0; i < 3; i++) {
			nextX = Math.random() * rrX;
			nextY = Math.random() * rrY;
			while (prevY == nextY || nextY < upBound)
				nextY = Math.random() * rrY;

			prevX = nextX;
			prevY = nextY;

			var mapx = Math.max(Math.min((this.cW * nextX) / rrX, this.cW - 200), 200);
			var mapy = Math.max(Math.min((this.cH * nextY) / rrY, this.cH - 100), 100);

			this.leds.push({ x: mapx, y: mapy, radius: r });
		}
	}
}