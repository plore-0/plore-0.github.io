//initialize variables
var canvas, ctx,
	source, context, analyser, fbc_array, binCount,
	intensity, oldIntensity, deltaIntensity,
	posx, posy,
	hue;
	
// establish variables
binCount = 200;

posx = 60;
posy = 0;

hue = 0;

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
	
	// music
	audio = new Audio();
	audio.crossOrigin = "anonymous";
	audio.controls = true;
	audio.loop = true;
	
	audio.src = "https://api.soundcloud.com/tracks/267845839/stream?client_id=8df0d68fcc1920c92fc389b89e7ce20f";
	audio.play();
	
	context = new AudioContext();
	analyser = context.createAnalyser();
	// route audio playback
	source = context.createMediaElementSource(audio);
	source.connect(analyser);
	analyser.connect(context.destination);

	// render the frame
	render();
}

// render canvas
function render() {
	// ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
	// ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	// music analyzation
	fbc_array = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(fbc_array);
	
	oldIntensity = intensity;
	intensity = 0;
	
	for (var i = 0; i < binCount; i++) {
		intensity += fbc_array[i];
	}
	
	deltaIntensity = intensity - oldIntensity;
	
	// text
	if(deltaIntensity > 1000) {
		posy += 30;
		hue += 10
		
		drawText(posx, posy, 0, 30, "hsl(" + hue % 360 + ", 100%, 50%)");
	}
	
	if(posy > canvas.height) {
		posy = 0;
		posx += 100
	}
	
	// repeat render function
	window.requestAnimationFrame(render);
}
