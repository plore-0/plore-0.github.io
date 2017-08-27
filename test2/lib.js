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