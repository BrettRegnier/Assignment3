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
		var top = this.cy - this.cpuH / 2;
		var bottom = this.cy + this.cpuH / 2;
		
		var rctx = this.cx - this.cpuW/2;
		var rcty = this.cy - this.cpuH/2;

		ctx.fillStyle = "black";
		ctx.fillRect(rctx, rcty, this.cpuW, this.cpuH);
		ctx.fill();
		
		var innerstyle = 10;
		ctx.fillStyle = "red";
		ctx.fillRect(rctx + innerstyle, rcty + innerstyle, this.cpuW - innerstyle*2, this.cpuH - innerstyle*2);
		ctx.fill();

		var r = 15;
		for (var i = 0; i < this.leds.length; i++) {
			ctx.beginPath();
			ctx.arc(this.leds[i].x, this.leds[i].y, this.leds[i].radius, 0, 2 * Math.PI);
			ctx.strokeStyle = "black";
			ctx.stroke();
			ctx.closePath();

			ctx.fillStyle = "black";
			var thicc = 5;
			if (this.leds[i].y < top) {
				// above case
				// draw the rect that connects directly to the cpu
				var vertx = (Math.floor(Math.random() * this.cpuW / 2) + left);
				var verty = this.leds[i].y;
				var vertdis = top - this.leds[i].y;
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


			ctx.beginPath();
			ctx.arc(this.leds[i].x, this.leds[i].y, r - 2, 0, 2 * Math.PI);
			ctx.fillStyle = "white";
			ctx.fill();
			ctx.closePath();
		}
	}

	Update() {

	}

	Click(mouse) {
		this.leds.forEach(led => {
			if (this.Intersection(mouse, led)) {
				alert("click worked");
			}
		});
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
		var r = 16;

		// For 12 different leds randomly generate points and make sure they aren't inside of the CPU sides + 1
		for (var i = 0; i < 1; i++) {
			var nextX = (Math.random() * rrX * 2) - rrX;
			while (prevX == nextX || (nextX < 0.5 && -0.5 < nextX)) {
				nextX = (Math.random() * rrX * 2) - rrX;
			}

			nextY = (Math.random() * rrY * 2) - rrY;
			while (prevY == nextY || (nextY < 0.3 && nextY > -0.3)) {
				nextY = (Math.random() * rrY * 2) - rrY;
			}

			prevX = nextX;
			prevY = nextY;

			// TODO map coords into the canvas			
			var mapx = Math.round(Math.max(Math.min(Math.abs(Math.abs(nextX * this.cW * 2) - this.cW), this.cW - r), r));
			var mapy = Math.round(Math.max(Math.min(Math.abs(Math.abs(nextY * this.cH * 2) - this.cH), this.cH - r), r));
			this.leds.push({ x: mapx, y: mapy, radius: r });
		}
	}
}