//initialize variables
var canvas, ctx,
	posx, posy, velx, vely,
	inc;
	
// establish variables
posx = 500;
posy = 500;
velx = random(1, 3);
vely = -random(1, 3);

inc = 0

// fits canvas to window
function resize_canvas() {
	if (canvas.width  != window.innerWidth) {
		canvas.width  = window.innerWidth;
	}

	if (canvas.height != window.innerHeight) {
		canvas.height = window.innerHeight;
	}
}

// gets random number between a and b
function random(min, max) {
	return (Math.random() * (max - min + 1)) + min;
}

function drawText(x, y, ang, size, color) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(ang);
		
	ctx.font = size + "px Arial";
	ctx.fillStyle = color;
	ctx.textAlign = "center";
	ctx.fillText("you're*", 0, 0);
		
	ctx.restore();
}

// upon loading:
function main() {
	// set up canvas
	canvas = document.getElementById("frame");
	ctx = canvas.getContext("2d");
	
	// fit the canvas to the window
	resize_canvas();
	
	// check if the window size has changed; resize if so
	window.addEventListener("resize", resize_canvas, false);

	// render the frame
	render();
}

// render canvas
function render() {
	ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	inc += 2;
	
	posx = posx + velx;
	posy = posy + vely;
	
	if(posx > canvas.width) {
		posx = canvas.width;
		velx = -velx;
	}
	if(posx < 0) {
		posx = 0;
		velx = -velx;
	}
	
	if(posy > canvas.height) {
		posy = canvas.height;
		vely = -vely;
	}
	if(posy < 0) {
		posy = 0;
		vely = -vely;
	}
	
	// text
	// drawText(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * Math.PI * 2, 30,  "hsl(" + Math.random() * 360 + ", 100%, 50%)");
	drawText(posx, posy, Math.sin(inc * 0.02) * 0.5, 80 + Math.sin(inc * 0.04) * 10, "hsl(" + inc % 360 + ", 100%, 50%)");
	
	// repeat render function
	window.requestAnimationFrame(render);
}
