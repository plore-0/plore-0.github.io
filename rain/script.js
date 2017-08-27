//initialize variables
var canvas, ctx,
	drops = [], drop_count,
	x;
	
// establish variables
drop_count = 500;
x = 0;

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

// remaps a number from one range to another
function maprange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

// water droplet
function Drop() {
	
	// set up particle
	//make particle off screen so it gets reset immediately
	this.x = Math.random() * canvas.width;
	this.y = canvas.height * 2;
	
	this.vx = 0;
	this.vy = 0
	
	// move drop down the screen
	this.fall = function() {
		// integrate velocity to position
		this.x = this.x + this.vx;
		this.y = this.y + this.vy;
		
		// if the drop falls below the screen
		if(this.y > canvas.height) {
			// reset drop to random position above screen
			this.x = random(-100, canvas.width);
			this.y = random(-canvas.height, 0);
			
			// distance from view
			this.z = random(0, 20);
			
			// velocity
			this.vx = maprange(this.z, 0, 20, 1, 2);
			this.vy = maprange(this.z, 0, 20, 5, 10);
			
			// size of drop
			this.width = maprange(this.z, 0, 20, 1, 3);
		}
	};
	
	// draw the drop
	this.draw = function() {
		ctx.strokeStyle = "rgba(100, 100, 255, 0.5)";
		ctx.lineWidth = this.width;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + this.vx * 3, this.y + this.vy * 2);
		ctx.stroke();
	};
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
	
	// make drops on screen
	for(var i = 0; i < drop_count; i++) {
		drops[i] = new Drop();
	}

	// render the frame
	render();
}

// render canvas
function render() {
	// clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// run all the drops
	for (var i in drops) {
		drops[i].fall();
		drops[i].draw();
	}
	
	// scroll clouds across screen
	x += 1;
	document.body.style.backgroundPosition = x * 0.75 + "px -90px, " + x * 0.5 + "px -50px, " + x * 0.25 + "px -50px, " + x * 0.15 + "px 100px";
	
	// repeat render function
	window.requestAnimationFrame(render);
}
