window.onload = function () {
	class Circuit {
		constructor(cW, cH) {
			this.cx = cW / 2;
			this.cy = cH / 2;
			
			this.leds = [];
		}

		Draw() {

		}

		Update() {

		}

		Resize(cW, cH) {

		}
		
		BuildLeds() {
			
			var x = 0;
			var y = 0;
			var prevX = 0;
			var prevY = 0;
			
			for (var i = 0; i < 12; i++)
			{
				if (prevX > 0)
					prevY = 0;
				if (prevY > 0)
					prevX = 0;
				
				if (prevX == 0)
				{
					
					x = Math.random() 
					
				}
				
				if (prevY == 0)
				{
					y = Math.random()
					
				}
			}
			
		}
		
		
	}
}