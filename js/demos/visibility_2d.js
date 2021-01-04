//2d_visibility
//2D light with raytracing solution.
//13/05/2019 axtros@gmail.com

var SHAPE_COLOR = '#adadad';

var LIGHT_START_X = 400;
var LIGHT_START_Y = 400;
var LIGHT_POINT_SIZE = 8;
var LIGHT_COLOR = 'red';
var LIGHT_RAY_RESOLUTION = 4;					//how many rays come from light (360 / LIGHT_RAY_RESOLUTION) min: 1 => 360 rays, max: 360 => 1 rays
var LIGHT_RAY_COLOR = 'grey';

var mapCanvas;
var mapContext;
var linesCanvas;
var linesContext;
var mouseCanvas;
var mouseContext;

var mouseX, mouseY;

var Cord = {
	x: 0,
	y: 0
}

var Light = {
	x: 0,
	y: 0,	
	radius: LIGHT_POINT_SIZE,
	distance: 200,
	color: LIGHT_COLOR,
	rayColor: LIGHT_RAY_COLOR,
	raysEndPoints: new Array()
}

var shape1 = new Array();
var shape2 = new Array();
var shape3 = new Array();

var light;
var isLightMoveMode = false;

function visibility2D_init() {
	initCanvases();
	initShape1();
	initShape2();	
	initShape3();
	initLight();
	refreshMouseCanvas();	
}

function initCanvases() {
	mapCanvas = document.getElementById("map-canvas-id");
	linesCanvas = document.getElementById("lines-canvas-id");
	mouseCanvas = document.getElementById("mouse-canvas-id");

	mapContext = mapCanvas.getContext("2d");
	linesContext = linesCanvas.getContext("2d");
	mouseContext = mouseCanvas.getContext("2d");

	mapContext.scale(1, 1);
	linesContext.scale(1, 1);
	mouseContext.scale(1, 1);

	let mapCanvasPos = mapCanvas.getBoundingClientRect();
	$('#lines-canvas-id').css('position', 'absolute');
	$("#lines-canvas-id").css({ top: mapCanvasPos.top + 'px' });	
	$("#lines-canvas-id").css({ left: mapCanvasPos.left + 'px' });	
	$("#lines-canvas-id").css({ width: mapCanvasPos.width + 'px' });	
	$("#lines-canvas-id").css({ height: mapCanvasPos.height + 'px' });	

	$('#mouse-canvas-id').css('position', 'absolute');
	$("#mouse-canvas-id").css({ top: mapCanvasPos.top + 'px' });	
	$("#mouse-canvas-id").css({ left: mapCanvasPos.left + 'px' });	
	$("#mouse-canvas-id").css({ width: mapCanvasPos.width + 'px' });	
	$("#mouse-canvas-id").css({ height: mapCanvasPos.height + 'px' });
}

function initShape1() {
	let shapePoint1 = Object.create(Cord);
	shapePoint1.x = 100;
	shapePoint1.y = 200;

	let shapePoint2 = Object.create(Cord);
	shapePoint2.x = 300;
	shapePoint2.y = 200;

	let shapePoint3 = Object.create(Cord);
	shapePoint3.x = 300;
	shapePoint3.y = 700;

	shape1.push(shapePoint1);
	shape1.push(shapePoint2);
	shape1.push(shapePoint3);	

	drawShape(mapContext, shape1);
}

function initShape2() {
	let shapePoint1 = Object.create(Cord);
	shapePoint1.x = 600;
	shapePoint1.y = 200;

	let shapePoint2 = Object.create(Cord);
	shapePoint2.x = 700;
	shapePoint2.y = 200;

	let shapePoint3 = Object.create(Cord);
	shapePoint3.x = 700;
	shapePoint3.y = 700;

	let shapePoint4 = Object.create(Cord);
	shapePoint4.x = 450;
	shapePoint4.y = 300;	

	shape2.push(shapePoint1);
	shape2.push(shapePoint2);
	shape2.push(shapePoint3);	
	shape2.push(shapePoint4);

	drawShape(mapContext, shape2);
}

function initShape3() {
	let shapePoint1 = Object.create(Cord);
	shapePoint1.x = 300;
	shapePoint1.y = 100;

	let shapePoint2 = Object.create(Cord);
	shapePoint2.x = 400;
	shapePoint2.y = 100;

	let shapePoint3 = Object.create(Cord);
	shapePoint3.x = 400;
	shapePoint3.y = 200;

	let shapePoint4 = Object.create(Cord);
	shapePoint4.x = 400;
	shapePoint4.y = 200;	

	let shapePoint5 = Object.create(Cord);
	shapePoint5.x = 600;
	shapePoint5.y = 200;	

	shape3.push(shapePoint1);
	shape3.push(shapePoint2);
	shape3.push(shapePoint3);	
	shape3.push(shapePoint4);
	shape3.push(shapePoint5);

	drawShape(mapContext, shape3);
}

function initLight() {
	light = Object.create(Light);
	light.x = LIGHT_START_X;
	light.y = LIGHT_START_Y;		
	let shapes = [shape2, shape1, shape3];
	refreshLineCanvas();
	calcCircualLightRays(light, shapes);
	drawLightRaysTriangle(linesContext, light);		
}

// ui events ------------------------------------------------------------------
function catchLight() {	
	if(mouseX >= light.x - light.radius && mouseX <= light.x + light.radius &&
		mouseY >= light.y - light.radius && mouseY <= light.y + light.radius) {
			isLightMoveMode = true;
	}
}

function dropLight() {
	isLightMoveMode = false;	
}

// mouse ----------------------------------------------------------------------
function mouseCoordCtrl(event) {	
	mouseX = getMousePos(mouseCanvas, event).x;
	mouseY = getMousePos(mouseCanvas, event).y;
	if(isLightMoveMode) {
		light.x = mouseX;
		light.y = mouseY;
		refreshLineCanvas();
	}
	refreshMouseCanvas();
}

function getMousePos(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: event.clientX - rect.left,
	  y: event.clientY - rect.top
	};
}

// draws ----------------------------------------------------------------------
function refreshMapCanvas() {
	clearCanvas(mapContext);
}

function refreshLineCanvas() {
	clearCanvas(linesContext);	
	drawLight(linesContext, light);	
	if(isLightMoveMode) {		
		let shapes = [shape2, shape1, shape3];
		calcCircualLightRays(light, shapes);
		drawLightRaysTriangle(linesContext, light);
		//drawLightRays(linesContext, light);
	}	
}

function refreshMouseCanvas() {
	clearCanvas(mouseContext);	
	mouseContext.fillText("mouse X: " + mouseX + ' Y: ' +  mouseY, 5, 10);
	mouseContext.fillText("light X: " + light.x + ' Y: ' +  light.y, 5, 25);
	mouseContext.fillText("rays distance: " + light.distance, 5, 40);
	mouseContext.fillText("rays number: " + 360 / LIGHT_RAY_RESOLUTION, 5, 55);
}

function clearCanvas(canvasContext) {
	canvasContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
}

function drawShape(canvasContext, shape) {
	if(shape.length < 3)
		return;
	for(let i = 0; i != shape.length; i++) {
		let coordFrom  = shape[i];
		let coordTo;
		if(i + 1 == shape.length)				//ha elér az utolsóig, akkor azt kösse össze az elsővel
			coordTo  = shape[0];
		else
			coordTo  = shape[i + 1];
		drawLine(canvasContext, coordFrom.x, coordFrom.y, coordTo.x, coordTo.y, SHAPE_COLOR);
	}
}

function drawLight(canvasContext, light) {
	canvasContext.beginPath();
	canvasContext.arc(light.x, light.y, LIGHT_POINT_SIZE, 0, 2 * Math.PI, false);	
	canvasContext.fillStyle = LIGHT_COLOR;
	canvasContext.fill();
	canvasContext.closePath();	
}

function drawLightRays(canvasContext, light) {
	console.log('light.raysEndPoints.length: ' + light.raysEndPoints.length);
	for(let i = 0; i != light.raysEndPoints.length; i++) {		
		let coordTo  = light.raysEndPoints[i];
		drawLine(canvasContext, light.x, light.y, coordTo.x, coordTo.y, light.rayColor);			
	}
	light.raysEndPoints = [];
}

function drawLightRaysTriangle(canvasContext, light) {
	for(let i = 0; i != light.raysEndPoints.length; i++) {
		let coord1  = light.raysEndPoints[i];
		let coord2;
		if(i < light.raysEndPoints.length - 1) {
			coord2  = light.raysEndPoints[i + 1];
		} else {
			coord2  = light.raysEndPoints[0];
		}
		drawTriangle(canvasContext, light.x, light.y, coord1.x, coord1.y, coord2.x, coord2.y, '#ff7070', 'red');
	}
	light.raysEndPoints = [];
}

function drawLineWithAngle(canvasContext, x1, y1, angle, length, color) {
	x2 = x1 + Math.cos(Math.PI * angle / 180) * length;
  y2 = y1 + Math.sin(Math.PI * angle / 180) * length;
	drawLine(canvasContext, x1, y1, x2, y2, color);
}

function drawLine(canvasContext, x1, y1, x2, y2, color) {
	canvasContext.beginPath();
	canvasContext.lineWidth = 1;
	canvasContext.fillStyle = '#000000';
	canvasContext.strokeStyle = color;
	canvasContext.moveTo(x1, y1);
	canvasContext.lineTo(x2, y2);	
	canvasContext.closePath();
	canvasContext.stroke();
}

function drawTriangle(canvasContext, lightX, lightY, coord1X, coord1Y, coord2X, coord2Y, borderColor, fillColor) {	
	canvasContext.beginPath();	
	canvasContext.lineWidth = 1;
	canvasContext.strokeStyle = borderColor;	
	canvasContext.moveTo(lightX, lightY);
	canvasContext.lineTo(coord1X, coord1Y);
	canvasContext.lineTo(coord2X, coord2Y);
	canvasContext.fillStyle = fillColor;
	canvasContext.fill();
	canvasContext.closePath();	 
	canvasContext.stroke();
}

function drawTriangleGardient(canvasContext, lightX, lightY, coord1X, coord1Y, coord2X, coord2Y, borderColor, fillColor) {
	
	var grd = canvasContext.createRadialGradient(lightX, lightY, 5, lightX, lightY, 200);
	grd.addColorStop(0, "red");
	grd.addColorStop(1, "white");	
	
	canvasContext.beginPath();	
	canvasContext.lineWidth = 1;
	canvasContext.strokeStyle = borderColor;
	canvasContext.stroke();
	canvasContext.strokeStyle = grd;
	canvasContext.moveTo(lightX, lightY);
	canvasContext.lineTo(coord1X, coord1Y);
	canvasContext.lineTo(coord2X, coord2Y);
	canvasContext.fillStyle = grd; //fillColor;
	canvasContext.fill();
	canvasContext.closePath();	 
	canvasContext.stroke();	
}

// light-ray system -----------------------------------------------------------
function calcCircualLightRays(light, shapes) {	
	let intersectionPoints = new Array();
	for(let angle = 0; angle != 360; angle += LIGHT_RAY_RESOLUTION) {		
  	let rayEndCord = calcCoordsLineWithAngle(light.x, light.y, angle, light.distance);

		for(var j = 0; j != shapes.length; j++) {		//shape-ek bejárása
			let shape = shapes[j];

			for(let i = 0; i != shape.length; i++) {	//egy adott shape 'körbejárása'
				let shapeLineFrom  = shape[i];
				let shapeLineTo;
				if(i + 1 == shape.length) {	//ha elér az utolsó vertex-ig, akkor azt kösse össze a legelsővel, és azt a szakaszt vizsgálja le
					shapeLineTo  = shape[0];
				}	else {				
					shapeLineTo  = shape[i + 1];
				}			

				if(checkPointOnLine(light.x, light.y, rayEndCord.x, rayEndCord.y, shapeLineFrom.x, shapeLineFrom.y)) {
					let shapeLineFromPoint = Object.create(Cord);
					shapeLineFromPoint.x = shapeLineFrom.x;
					shapeLineFromPoint.y = shapeLineFrom.y;
					intersectionPoints.push(shapeLineFromPoint);					
				} else if(checkPointOnLine(light.x, light.y, rayEndCord.x, rayEndCord.y, shapeLineTo.x, shapeLineTo.y)) {
					let shapeLineToPoint = Object.create(Cord);
					shapeLineToPoint.x = shapeLineTo.x;
					shapeLineToPoint.y = shapeLineTo.y;
					intersectionPoints.push(shapeLineToPoint);
				} else {
					let intersectPoint = calcLinesIntersect(light.x, light.y, rayEndCord.x, rayEndCord.y, shapeLineFrom.x, shapeLineFrom.y, shapeLineTo.x, shapeLineTo.y);
					if(intersectPoint != null) {
						intersectionPoints.push(intersectPoint);
					}					
				}
			}
		}

		if(intersectionPoints.length == 0) {	//ha nincs metszés, akkor a ray sugár végig ér a teljes distance-on
			let point = Object.create(Cord);
			point.x = rayEndCord.x;
			point.y = rayEndCord.y;
			light.raysEndPoints.push(point);
		} else if(intersectionPoints.length == 1) {	//ha csak egy metszés van, akkor azt az egy metszés pontot mentjük le
			let point = Object.create(Cord);
			point.x = intersectionPoints[0].x;
			point.y = intersectionPoints[0].y;
			light.raysEndPoints.push(point);
		} else if(intersectionPoints.length > 1) {	//ha több metszés van, akkor azt vesszük, amelyik a fényponthoz közelebb van (a fényponttól a távolsága a legkisebb, minimumkiválasztással)
			let minDistance = light.distance;
			let minDistancePoint = Object.create(Cord);
			for(let i = 0; i != intersectionPoints.length; i++) {				
				let distance = calcCoordsDistance(light.x, light.y, intersectionPoints[i].x, intersectionPoints[i].y);
				if(distance < minDistance) {
					minDistance = distance;
					minDistancePoint = intersectionPoints[i];
				}
			}
			light.raysEndPoints.push(minDistancePoint);
		}	
		
		intersectionPoints = [];
	}	
}