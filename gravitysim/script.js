// establish vars
var simspeed, iterations, Dt, interval, 
	canvas, ctx,
	particleIndex = 0, particle_count, particles = [],
	gravConstant, gravVec = vec2(0, 0), 
	mousePos = vec2(0, 0), mouseDown = 0, mouseDown2 = 0, shoot_vec = vec2(0, 0), mousePos_final = vec2(0, 0), mousePos_initial = vec2(0, 0),
	viewOffset = vec2(0, 0), viewOffset_prev = vec2(0, 0),
	trace = 0, pause = 0, scale,
	input_spwnmass;

	iterations = 144;
	simspeed = 144 / iterations;
	Dt = 1000 / iterations;
	interval = 1000 / 144; // 144Hz
	
	gravConstant = 0.001;
	
	scale = 1;
	
// 2D vector functions
function vector2(x, y) {
	this.x = x;
	this.y = y;
				
	this.length = function() {
		// return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
		return Math.sqrt(this.x * this.x + this.y * this.y);
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
	
	this.scrnToWorld = function() {
		return new vec2( (((this.x) - canvas.width / 2) / scale) + canvas.width / 2, -(((-(this.y) + canvas.height / 2) / scale) - canvas.height / 2) ).sub(viewOffset);
	}
	
	this.worldToScrn = function() {
		return new vec2(((this.x + viewOffset.x) - canvas.width / 2) * scale + canvas.width / 2, -(((-(this.y + viewOffset.y) + canvas.height / 2) * scale) - canvas.height / 2));
	}
}

// this is the easiest thing to call instead of going "new vector2(...)" all the time
function vec2(x, y) {
	return new vector2(x, y);
}
	
// randvec - returns a random vector between the min and max vector
function randvec(min, max) {
	return vec2(min.x + Math.random() * (max.x - min.x), min.y + Math.random() * (max.y - min.y));
}

function randNormVec() {
	return vec2(Math.random() * 2 - 1, Math.random() * 2 - 1).normalized();
}
// end of 2D vec functions------------------------------------------------
			
// fits canvas to window
function resize_canvas() {
		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight;
		
	render();
}

// gives a value a min and max
function clamp(num, min, max) {
	return Math.min(Math.max(min, num), max)
}

// get random integer between min and max
function randomInclusive(min, max) {
	return (Math.random() * (max - min + 1)) + min;
}

// particle creation
function Particle(pos, vel, mass, color) {
	this.pos = pos;
	this.vel = vel;
	this.mass = mass;
	this.radius = Math.sqrt(this.mass / Math.PI);
	this.color = color;
				
	this.compute = function() {
					
		// interaction with particles
		gravVec = vec2(0, 0); // zero the accumulated vectors
					
		for (var i in particles) {
					
			if(particles[i] != this){
				var dist = this.pos.sub(particles[i].pos).length();
							
				if(dist < (this.radius + particles[i].radius)) {
					if(this.mass >= particles[i].mass){
						this.vel = (this.vel.mul(this.mass).add(particles[i].vel.mul(particles[i].mass))).div(this.mass + particles[i].mass); // conserve momentum
						this.mass = this.mass + particles[i].mass;
									
						particles[i].mass = 0; // don't delete yet
					}
				}
				
				gravVec = gravVec.add((particles[i].pos.sub(this.pos)).mul((gravConstant * particles[i].mass) / Math.pow(dist, 3)));						
				this.acc = gravVec;
			}
		}
		
		if(!pause){
			
			this.vel = this.vel.add(this.acc.mul(Dt));
			this.pos = this.pos.add(this.vel.mul(Dt));				
		}
				
		// black hole formation
		if(this.mass < 1000000000) {
			this.radius = Math.sqrt(this.mass / Math.PI);
		} else if(this.radius > 100) {
			this.radius = this.radius - 5;
		} else {
			this.radius = 100;
			this.color = "rgb(0, 0, 0)";
		}
		
		if(this.mass == 0) {
			delete particles[this.id];
			particle_count--;
		}
		
	};
				
	// drawing function
	this.draw = function() {
		
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.pos.worldToScrn().x, this.pos.worldToScrn().y, Math.max(this.radius * scale, 1), 0, Math.PI * 2, false);
		
		ctx.fill();
		

	};
					
	particleIndex++;
	particles[particleIndex] = this;
	this.id = particleIndex;
}
			
function randomParticle() {
	var pos, vel, mass, color;
				
	pos = randvec(vec2(0, 0), vec2(canvas.width, canvas.height)).scrnToWorld();
	vel = vec2(0, 0);
	mass = 1 + Math.random() * 20
	color = "hsl(" + (Math.random() * 360) + ", 100%, 50%)";
				
	return new Particle(pos, vel, mass, color);
}
			
function main() {
	// set up canvas
	canvas = document.getElementById("frame");
	ctx = canvas.getContext("2d");

	resize_canvas();
	
	// set up on-screen input
	input_spwnmass = document.getElementById("input_mass");
				
	// listener events
	canvas.addEventListener("mousedown", clicking, false);
	canvas.addEventListener("mouseup", clicked, false);
	canvas.addEventListener("mousemove", getMousePos, false);
	window.addEventListener("resize", resize_canvas, false);
				
	// set up particles
	viewOffset = vec2(canvas.width / 2, canvas.height / 2);
	viewOffset_prev = vec2(canvas.width / 2, canvas.height / 2);
	particle_count = 0;
	
	// draw
	(function animLoop() {
		requestAnimationFrame(animLoop);
		render();
	})();
				
	// compute
	setInterval(runSim, interval); // ~144Hz, 1000 / 144
	
	reset();
}

function clearWorld() {
	for (var i in particles) {
		delete particles[i];
	}
	
	particle_count = 0;
	trace = 0;
}

function reset() {
	clearWorld();
	
	for (i = 0; i < 50; i++) {
		randomParticle();
		particle_count++;
	}
}
			
// mouse controls	
function getMousePos(event) {
	mousePos = vec2(event.clientX, event.clientY);
}	

window.addEventListener("mousewheel", mouseWheelEvent);
function mouseWheelEvent(e) {
    var wheelDelta = e.wheelDelta ? e.wheelDelta : -e.detail;
	scale += wheelDelta * 0.001 * scale;
}

function clicking(event) {
	mousePos_initial = mousePos; // mouse pos at time of click
	
	if(event.button == 0){ // LMB
		pause = 1;
		mouseDown = 1;
	}
	if(event.button == 2){ // RMB
		mouseDown2 = 1;
	}
	
	trace = 0;
}
function clicked(event) {
	if(event.button == 0) { // LMB	
			
		particle_count++;
			
		var pos, vel, mass, color;
				
		pause = 0;
		mouseDown = 0;
			
		mousePos_final = mousePos;
		shoot_vec = (mousePos_final.sub(mousePos_initial)).mul(-0.002 / scale);
						
		pos = mousePos_initial.scrnToWorld();
		vel = shoot_vec;
		mass = parseInt(document.getElementById("input_mass").value);
		color = "hsl(" + (Math.random() * 360) + ", 100%, 50%)";
							
		return new Particle(pos, vel, mass, color);
	}
	
	if(event.button == 2){ // RMB
		mouseDown2 = 0;
		viewOffset_prev = viewOffset; // previous view offset to add to next
	}
}

// on-screen buttons
function buttonTrace() {
	trace = !trace;
}
		
// compute function
function runSim() {	
	for(var i in particles) {
		particles[i].compute();
	}
}

// draw function
function render() {
	// bg
	if(!trace) {
		ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
		
	// text
	document.getElementById("siminfo").innerHTML = "simulation speed: " + simspeed * 100 + "%, iterations/sec: " + iterations + ", particles: " + particle_count;
	
	for(var i in particles) {
		particles[i].draw();
	}
	
	if(mouseDown) {
		ctx.strokeStyle = "rgba(255, 0, 0, 1)";
		ctx.beginPath();
		ctx.moveTo(mousePos_initial.x, mousePos_initial.y);
		ctx.lineTo((mousePos_initial.x - mousePos.x) + mousePos_initial.x, (mousePos_initial.y - mousePos.y) + mousePos_initial.y);
		ctx.stroke();
	}
	
	if(mouseDown2) {
		viewOffset = viewOffset_prev.add((mousePos.sub(mousePos_initial)).mul(1 / scale));
	}
}		