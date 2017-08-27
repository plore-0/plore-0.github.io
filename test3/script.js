// initialize variables
var canvas, ctx;

// fits canvas to window
function resize_canvas() {
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
}

// upon loading:
function main() {
	// set up canvas
	canvas = document.getElementById("frame");
	ctx = canvas.getContext("2d");
	
	resize_canvas();
	
	//ctx.strokeStyle = "rgb(255, 0, 0)";
	//ctx.lineWidth = this.width;
	//ctx.beginPath();
	//ctx.moveTo(0, 0);
	//ctx.lineTo(200, 200);
	//ctx.stroke();
	
	//ctx.beginPath();
    //ctx.arc(100, canvas.height * 0.5, 70, 0, 2 * Math.PI, false);
    //ctx.fillStyle = 'green';
    //ctx.fill();
	
	for (i = 0; i < 3; i++) { 
		for (k = 0; k < 3; k++) {
			ctx.beginPath();
			ctx.arc(canvas.width * 0.5 + i * 40, i * 40, 20, 0, 2 * Math.PI, false);
			ctx.fillStyle = 'green';
			ctx.fill();
		}
		
		//ctx.beginPath();
		//ctx.arc(100 + i * 100, canvas.height * 0.5, 70, 0, 2 * Math.PI, false);
		//ctx.fillStyle = 'green';
		//ctx.fill();
	}
}