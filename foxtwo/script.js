//initialize variables
var canvas, ctx,
	playerimg, plyang, plypos, plyvel, plyspeed,
	m;

// establish variables
plyang = 0;
plypos = vec2(0, 0);
plyvel = vec2(0, 0);
plyspeed = 1;

// fits canvas to window
function resize_canvas() {
	if (canvas.width  != window.innerWidth) {
		canvas.width  = window.innerWidth;
	}

	if (canvas.height != window.innerHeight) {
		canvas.height = window.innerHeight;
	}
	
	// if canvas is resized, center player image
	playerimg.style.left = (canvas.width / 2 - 25) + "px";
	playerimg.style.top = (canvas.height / 2 - 25) + "px";
}

// gets random number between a and b
function random(min, max) {
	return (Math.random() * (max - min + 1)) + min;
}

// convert degrees to radians
function degreeToRadian (degrees) {
	return degrees * (Math.PI / 180);
}

// convert radians to degrees
function radianToDegree (radians) {
	return radians * (180 / Math.PI);
}

// convert vector into angle
function vecToAng(vector) {
	return radianToDegree(Math.atan(vector.y / vector.x));
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

// detect arrow keys
document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
    }
    else if (e.keyCode == '40') {
        // down arrow
    }
    else if (e.keyCode == '37') {
       // left arrow
	   plyang -= 4;
    }
    else if (e.keyCode == '39') {
       // right arrow
	   plyang += 4;
    }

}

// control plane
function plyFly() {
	plyvel = vec2(Math.sin(-degreeToRadian(plyang + 180)) * plyspeed, Math.cos(-degreeToRadian(plyang + 180)) * plyspeed);
	plypos = plypos.add(plyvel);
}

function Missile() {
	this.pos = vec2(1000, 0);
	this.speed = 2;
	//this.vec = plypos.sub(this.pos);
	
	// fly missile
	this.fly = function() {
		this.vec = (vec2(plypos.x - this.pos.x, plypos.y = this.pos)).normalized().mul(this.speed)//(vec2(plypos.x - this.pos.x, plypos.y = this.pos)).normalized().mul(this.speed);
		this.vel = this.vec;
		this.pos = (this.pos.add(this.vel));
	}
	
	// draw missile on screen
	this.draw = function() {
		ctx.fillStyle = "rgb(255, 0, 0)";
		ctx.beginPath();
		ctx.arc(this.pos.x + canvas.width / 2, this.pos.y + canvas.height / 2, 5, 0, Math.PI * 2, false);
		ctx.fill();
	}
}

// upon loading:
function main() {
	// set up canvas
	canvas = document.getElementById("frame");
	ctx = canvas.getContext("2d");
	
	// player image
	playerimg = document.getElementById("playerimg");
	
	// fit the canvas to the window
	resize_canvas();
	
	// check if the window size has changed; resize if so
	window.addEventListener("resize", resize_canvas, false);

	m = new Missile();
	
	// render the frame
	render();
}

// render canvas
function render() {
	// clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// rotate player image
	playerimg.style.transform = "rotate(" + plyang + "deg)";
	
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.beginPath();
	ctx.arc(0 - plypos.x + canvas.width / 2, 0 - plypos.y + canvas.height / 2, 50, 0, Math.PI * 2, false);
	ctx.fill();
	
	// fly plane
	plyFly();
	
	// move missiles
	m.fly();
	
	// draw missile
	m.draw();
	
	// repeat render function
	window.requestAnimationFrame(render);
}
