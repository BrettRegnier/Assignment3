class Circuit {
	constructor(cW, cH, canvas, numLeds) {
		this.Resize(cW, cH);
		this.canvas = canvas;
		this.leds = [];
		this.BuildLeds(numLeds);
		this.BuildWires();
	}

	Draw() {
		var ctx = this.canvas.getContext("2d");

		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		var rctx = this.cx - this.cpuW / 2;
		var rcty = this.cy - this.cpuH / 2;

		
		ctx.shadowColor	= "#D7B740";
		ctx.shadowBlur = 5;
		ctx.fillStyle = "#101010";
		ctx.fillRect(rctx, rcty, this.cpuW, this.cpuH);

		ctx.fillStyle = "#D7B740";
		ctx.fillRect(rctx + 2, rcty + 2, this.cpuW - 4, this.cpuH - 4);

		ctx.fillStyle = "#C0C0C0";
		ctx.fillRect(rctx + 4, rcty + 4, this.cpuW - 8, this.cpuH - 8);

		var innerstyle = 12;
		ctx.fillStyle = "#7E7C7D";
		ctx.fillRect(rctx + innerstyle - 1, rcty + innerstyle - 1, this.cpuW - (innerstyle * 2) + 2, this.cpuH - (innerstyle * 2) + 2);

		ctx.fillStyle = "#EFEAE6";
		ctx.fillRect(rctx + innerstyle, rcty + innerstyle, this.cpuW - innerstyle * 2, this.cpuH - innerstyle * 2);

		ctx.shadowBlur = 0;	
		
		for (var i = 0; i < this.leds.length; i++)
		{
			if (this.leds[i].on)
				ctx.shadowBlur = 6;
			else
				ctx.shadowBlur = 0;
				
			ctx.fillStyle = "#D7B740";
			ctx.fillRect(this.leds[i].cpuWire.x, this.leds[i].cpuWire.y, this.leds[i].cpuWire.w, this.leds[i].cpuWire.h);
			ctx.fillRect(this.leds[i].ledWire.x, this.leds[i].ledWire.y, this.leds[i].ledWire.w, this.leds[i].ledWire.h);
		}

		for (var i = 0; i < this.leds.length; i++)
		{
			ctx.beginPath();
			ctx.arc(this.leds[i].x, this.leds[i].y, this.leds[i].radius, 0, 2 * Math.PI);
			ctx.strokeStyle = "#000000";
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc(this.leds[i].x, this.leds[i].y, this.leds[i].radius, 0, 2 * Math.PI);
			ctx.fillStyle = this.leds[i].color;
			ctx.shadowBlur = this.leds[i].blur;
			ctx.shadowColor = this.leds[i].color;
			ctx.fill();
			ctx.closePath();
		}
	}

	On(idx) {
		this.leds[idx].color = "#D7B740";
		this.leds[idx].blur = 20;
		this.leds[idx].on = true;
	}

	Off(idx) {
		this.leds[idx].color = "#8B021E";
		this.leds[idx].on = false;
	}

	Click(mouse) {
		for (var i = 0; i < this.leds.length; i++)
			if (this.Intersection(mouse, this.leds[i]))
			{
				console.log("clicked");
				return { id: i, x: this.leds[i].x, y: this.leds[i].y };
			}

		return -1;
	}

	Intersection(point, circle) {
		return Math.pow(point.x - circle.x, 2) + Math.pow(point.y - circle.y, 2) < Math.pow(circle.radius, 2);
	}

	Resize(cW, cH) {
		this.cW = cW;
		this.cH = cH;

		this.cx = cW / 2;
		this.cy = cH / 2;

		this.cpuW = Math.abs(0.2 * this.cH);
		this.cpuH = Math.abs(0.2 * this.cH);
	}

	BuildLeds(numLeds) {

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
		
		// this splits the value inputted into 4 loops, where the last loop has the overflowed ones.
		var lowLoop = Math.floor(numLeds / 4);
		var highLoop = lowLoop + numLeds % 4;

		// TODO calculations for making any inputted amount be divided into 4 sections
		// Find right sided plotted points
		for (var i = 0; i < lowLoop; i++)
		{
			nextX = Math.random() * rrX;
			while (prevX == nextX || nextX < upBound)
				nextX = Math.random() * rrX;
			nextY = Math.random() * rrY;

			prevX = nextX;
			prevY = nextY;

			var mapx = Math.max(Math.min((this.cW * nextX) / rrX, this.cW - 200), 200);
			var mapy = Math.max(Math.min((this.cH * nextY) / rrY, this.cH - 100), 100);

			this.leds.push({ x: mapx, y: mapy, radius: r, color: "#ffffff", blur: 0, shadow: "black" });
		}

		// find left sided plotted points
		for (var i = 0; i < lowLoop; i++)
		{
			nextX = Math.random() * rrX;
			while (prevX == nextX || nextX > lowBound)
				nextX = Math.random() * rrX;
			nextY = Math.random() * rrY;

			prevX = nextX;
			prevY = nextY;

			var mapx = Math.max(Math.min((this.cW * nextX) / rrX, this.cW - 200), 200);
			var mapy = Math.max(Math.min((this.cH * nextY) / rrY, this.cH - 100), 100);

			this.leds.push({ x: mapx, y: mapy, radius: r, color: "#ffffff", blur: 0, shadow: "black" });
		}

		// find top sided plotted points
		for (var i = 0; i < lowLoop; i++)
		{
			nextX = Math.random() * rrX;
			nextY = Math.random() * rrY;
			while (prevY == nextY || nextY > lowBound)
				nextY = Math.random() * rrY;

			prevX = nextX;
			prevY = nextY;

			var mapx = Math.max(Math.min((this.cW * nextX) / rrX, this.cW - 200), 200);
			var mapy = Math.max(Math.min((this.cH * nextY) / rrY, this.cH - 100), 100);

			this.leds.push({ x: mapx, y: mapy, radius: r, color: "#ffffff", blur: 0, shadow: "black" });
		}

		// find bottom sided plotted points
		for (var i = 0; i < highLoop; i++)
		{
			nextX = Math.random() * rrX;
			nextY = Math.random() * rrY;
			while (prevY == nextY || nextY < upBound)
				nextY = Math.random() * rrY;

			prevX = nextX;
			prevY = nextY;

			var mapx = Math.max(Math.min((this.cW * nextX) / rrX, this.cW - 200), 200);
			var mapy = Math.max(Math.min((this.cH * nextY) / rrY, this.cH - 100), 100);

			this.leds.push({ x: mapx, y: mapy, radius: r, color: "#ffffff", blur: 0, shadow: "black" });
		}
	}

	BuildWires() {
		var left = this.cx - this.cpuW / 2;
		var right = this.cx + this.cpuW / 2;
		var top = this.cy - this.cpuH / 2;
		var bottom = this.cy + this.cpuH / 2;
		var r = 15;
		for (var i = 0; i < this.leds.length; i++)
		{
			var thicc = 5;
			var cpuWire = { x: 0, y: 0, w: 0, h: 0 };
			var ledWire = { x: 0, y: 0, w: 0, h: 0 };
			if (this.leds[i].y < top)
			{
				// above case
				// draw the rect that connects directly to the cpu
				cpuWire.x = (Math.floor(Math.random() * this.cpuW / 2) + left);
				cpuWire.y = this.leds[i].y - 2;
				cpuWire.w = thicc;
				cpuWire.h = top - cpuWire.y;

				var horix;
				if (this.leds[i].x < cpuWire.x)
					horix = this.leds[i].x;
				else
					horix = cpuWire.x;
				ledWire.x = horix;
				ledWire.y = this.leds[i].y - 2;
				ledWire.w = Math.abs(this.leds[i].x - cpuWire.x);
				ledWire.h = thicc;
			}
			else if (this.leds[i].y > bottom)
			{
				// below case
				// draw the rect that connects directly to the cpu
				cpuWire.x = (Math.floor(Math.random() * this.cpuW / 2) + left);
				cpuWire.y = bottom;
				cpuWire.w = thicc;
				cpuWire.h = Math.round(this.leds[i].y - bottom) + 5;

				var horix;
				if (this.leds[i].x < cpuWire.x)
					horix = this.leds[i].x;
				else
					horix = cpuWire.x;
				ledWire.x = horix;
				ledWire.y = this.leds[i].y;
				ledWire.w = Math.abs(this.leds[i].x - cpuWire.x);
				ledWire.h = thicc;
			}
			else if (this.leds[i].x < left)
			{
				// left case
				// draw the rect that connects directly with the cpu
				cpuWire.x = this.leds[i].x;
				cpuWire.y = (Math.floor(Math.random() * this.cpuH / 2) + top);
				cpuWire.w = Math.abs(this.leds[i].x - left);
				cpuWire.h = thicc;

				var verty;
				if (this.leds[i].y < cpuWire.y)
					verty = this.leds[i].y;
				else
					verty = cpuWire.y;

				ledWire.x = this.leds[i].x;
				ledWire.y = verty;
				ledWire.w = thicc;
				ledWire.h = Math.abs(this.leds[i].y - cpuWire.y);
			}
			else if (this.leds[i].x > right)
			{
				// right case
				// draw the rect that connects directly with the cpu
				cpuWire.x = right;
				cpuWire.y = (Math.floor(Math.random() * this.cpuH / 2) + top);
				cpuWire.w = Math.abs(this.leds[i].x - right);
				cpuWire.h = thicc;

				var verty;
				if (this.leds[i].y < cpuWire.y)
					verty = this.leds[i].y;
				else
					verty = cpuWire.y;

				ledWire.x = this.leds[i].x;
				ledWire.y = verty;
				ledWire.w = thicc;
				ledWire.h = Math.abs(this.leds[i].y - cpuWire.y);
			}

			this.leds[i].cpuWire = cpuWire;
			this.leds[i].ledWire = ledWire;
		}
	}
}