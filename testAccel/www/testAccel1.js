var canvas_ctx;                 // HTML canvas 2d context
var SPEED = 10;                 // Canvas redraw speed in milliseconds and accelerometer frequency
var DISTANCE_FACTOR = .1;       // Factor to adjust accelerometer values to screen distance. Cordova 1.6 changed to values to be Android compatible which appeared to be * 10. For Cordova 1.5 make this value 1.
var ax = 0;                     // Acceleration x axis (Accelerometer value adjusted for direction)
var ay = 0;                     // Acceleration y axis (Accelerometer value adjusted for direction)
var x;                          // Circle x position
var y;                          // Circle y position
var vx = 0;                     // Velocity x axis
var vy = 0;                     // Velocity y axis
var WIDTH = 400;                // Width of canvas
var HEIGHT = 400;               // Height of canvas
var RADIUS = 40;                // Width of circle object
var CIRCLE_COLOR = "#8ED6FF";      // Circle color
var CANVAS_COLOR = "#FFFFFF";   // Color of canvas background
var watchID;                    // Accelerometer.watchAcceleration return value.
var drawID;                     // Draw time interval.
	
var boxes[];
var cavasValid = false;
function Box() {
this.x = 0;
this.y = 0;
this.w = 1;
this.fill = '#444444';
}

function addRect(x, y, w, h, fill) {
var rect = new Box;
rect.x = x;
rect.y = y;
rect.w = w;
rect.h = h;
rect.fill = fill;
boxes.push(rect);

invalidate();
}

function init() {
	canvas = document.getElementById('canvas');
	HEIGHT = canvas.height;
	WIDTH = canvas.width;
	canvas_ctx = canvas,getContext('2d');
	
	setInterval(draw, drawID);
	
	addRect(200, 200, 40, 40, '#FFFFFF');
}

function draw() {
	if (canvasValid == false) {
		clear(ctx);
	}
	
	var l = boxes.length;
	for (var i = 0; i < 1; i++) {
		drawshape(ctx, boxes[i].fill);
	}
	
	canvasValid = true;
}