//initialize variables
var canvas, ctx,
	mousePos = vec2(0, 0),
	missiles = [], missileIndex = 0;
	
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

// 2D vector functions
function vector2(x, y) {
	this.x = x;
	this.y = y;
				
	this.length = function() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	};
	
	this.length2 = function() { // useful for operations in which length is squared to avoid redundancy in a sqrt operation
		return Math.pow(this.x, 2) + Math.pow(this.y, 2);
	};
			
	this.normalized = function() {
		return new vec2(this.x / this.length(), this.y / this.length());
	};
			
	// pass in as many vectors as you want and it returns the sum
	// example: pos = pos.add(vel);
	this.add = function() {
		var temp = vec2(this.x, this.y);
				
		for(var i = 0; i < arguments.length; i++) {
			temp.x += arguments[i].x;
			temp.y += arguments[i].y;
		}
					
		return temp;
	};
				
	// same as above
	this.sub = function() {
		var temp = vec2(this.x, this.y);
				
		for(var i = 0; i < arguments.length; i++) {
			temp.x -= arguments[i].x;
			temp.y -= arguments[i].y;
		}
				
		return temp;
	};
			
	// same except that you can pass in 1 coefficient/scalar and it multiplies by that
	// example: vec2(5, 5).mul(vec2(2, 10)) will be a vector of (10, 50)
	// example: vec2(5, 5).mul(3) will be a vector of (15, 15)
	this.mul = function() {
		var temp = vec2(this.x, this.y);
			
		// if you intend to multiply by a scalar
		if(arguments[0].x == undefined) {
			temp.x *= arguments[0];
			temp.y *= arguments[0];
		}
		else {
			for(var i = 0; i < arguments.length; i++) {
				temp.x *= arguments[i].x;
				temp.y *= arguments[i].y;
			}
		}
				
		return temp;
	};
				
	// same as above but with div
	this.div = function() {
		var temp = vec2(this.x, this.y);
			
		// if you intend to multiply by a scalar
		if(arguments[0].x == undefined) {
			temp.x /= arguments[0];
			temp.y /= arguments[0];
		} else {
			for(var i = 0; i < arguments.length; i++) {
				temp.x /= arguments[i].x;
				temp.y /= arguments[i].y;
			}
		}
					
		return temp;
	};
}

// this is the easiest thing to call instead of going "new vector2(...)" all the time
function vec2(x, y) {
	return new vector2(x, y);
}

// convert vector into angle
function vecToAng(vector) {
	return (Math.atan2(vector.y, vector.x));
}

// opposite
function angToVec(ang) {
	return vec2(Math.cos((ang)), Math.sin((ang)));
}

function normalizeAng(ang) {
    var newAng = ang;
    while (newAng <= -Math.PI) newAng += Math.PI * 2;
    while (newAng > Math.PI) newAng -= Math.PI * 2;
    return newAng;
}

// clamp a number between a min and max
function clamp(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}

// get mouse position
function getMousePos(event) {
	mousePos = vec2(event.clientX, event.clientY);
}

function Missile() {
	this.pos = vec2(canvas.width * Math.random(), canvas.height * Math.random()); // spawn position
	this.speed = 10;
	this.turnSpeed = 1;//0.05;
	
	this.ang = 0;
	this.goalAng = 0;
	
	// fly missile
	this.fly = function() {
		this.goalAng = vecToAng(mousePos.sub(this.pos));
		this.ang = this.ang + clamp(normalizeAng(this.goalAng - this.ang), -this.turnSpeed, this.turnSpeed);
		
		this.vel = angToVec(this.ang).mul(this.speed);
		this.pos = (this.pos.add(this.vel));
		
		// missile collision
		for (var i = 0; i < missiles.length; i++) {
			if (missiles[i] != this) {
				if ((this.pos.sub(missiles[i].pos)).length2() < 1000) {
					missiles.splice(i, 1);
					missiles.splice(missiles.indexOf(this), 1);
				}
			}
		}
	}
	
	// draw missile on screen
	this.draw = function() {
		ctx.fillStyle = "rgb(255, 0, 0)";
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, 5, 0, Math.PI * 2, false);
		ctx.fill();
	}
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
	
	// check if mouse has moved; update mousePos
	canvas.addEventListener("mousemove", getMousePos, false);

	for (i = 0; i < 20; i++) {
		missiles[i] = new Missile();
	}
	
	// render the frame
	render();
}

// render canvas
function render() {
	// clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for (var i = 0; i < missiles.length; i++) {
		missiles[i].fly();
		missiles[i].draw();
	}
	
	// repeat render function
	window.requestAnimationFrame(render);
}
