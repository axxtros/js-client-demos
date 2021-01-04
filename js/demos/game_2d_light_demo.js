//game_2d_light_demo.js
//2D game light demo.
//16/05/2019 axtros@gmail.com

var MATRIX_SIZE = 40;					//ennyi pixel a canvas-en egy térkép matrix egység
var SHAPE_COLOR = '#e5e8b8';

var LIGHT_START_X = 400;
var LIGHT_START_Y = 500;
var LIGHT_POINT_SIZE = 12;
var LIGHT_COLOR = 'yellow';
var LIGHT_RAY_RESOLUTION = 2;					//how many rays come from light (360 / LIGHT_RAY_RESOLUTION) min: 1 => 360 rays, max: 360 => 1 rays
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

var mapShapes = new Array();

var light;
var isLightMoveMode = false;

var calculatorCounter = 0;						//hányszor hívódik meg a intersect függvény -> optimalizálni kell
var shapeVertexNum = 0;						//hány darab levizsgálandó shapevertex van

function visibility2D_init() {
	initCanvases();
	initMap();	
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
	mapContext.fillStyle = "#204060";
	mapContext.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
	
	//kockás háttér rajzolása
	for(let x = 0; x != mapCanvas.width; x += MATRIX_SIZE) {
		drawLine(mapContext, x, 0, x, mapCanvas.height, '#1f3852');
	}
	for(let y = 0; y != mapCanvas.height; y += MATRIX_SIZE) {
		drawLine(mapContext, 0, y, mapCanvas.width, y, '#1f3852');
	}

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

function initLight() {
	light = Object.create(Light);
	light.x = LIGHT_START_X;
	light.y = LIGHT_START_Y;	
	refreshLineCanvas();	
	calcCircualLightRays(light, mapShapes);
	drawLightRaysTriangle(linesContext, light);
	drawLight(linesContext, light);	
}

function initMap() {
	addShape(generateMapRectangleShape(700, 50, 100, 20), true);	
	
	addShape(generateMapRectangleShape(700, 50, 100, 20), true);
	addShape(generateMapRectangleShape(700, 100, 100, 20), true);
	addShape(generateMapRectangleShape(700, 150, 100, 20), true);
	addShape(generateMapRectangleShape(700, 200, 100, 20), true);
	addShape(generateMapRectangleShape(700, 250, 100, 20), true);

	addShape(generateMapRectangleShape(660, 300, 20, 20), true);
	addShape(generateMapRectangleShape(700, 300, 20, 20), true);
	addShape(generateMapRectangleShape(740, 300, 20, 20), true);
	addShape(generateMapRectangleShape(660, 340, 20, 20), true);
	addShape(generateMapRectangleShape(700, 340, 20, 20), true);
	addShape(generateMapRectangleShape(740, 340, 20, 20), true);
	addShape(generateMapRectangleShape(660, 380, 20, 20), true);
	addShape(generateMapRectangleShape(700, 380, 20, 20), true);
	addShape(generateMapRectangleShape(740, 380, 20, 20), true);	

	addShape(generateMapRectangleShapeWithAngle(100, 150, 80, 60, 45), true);	
	addShape(generateMapRectangleShapeWithAngle(150, 100, 40, 40, 30), true);
	addShape(generateMapRectangleShapeWithAngle(170, 220, 40, 40, 45), true);
	addShape(generateMapRectangleShapeWithAngle(200, 150, 60, 40, 10), true);	

	//addShape(generateTriangle(400, 150, 100), true);

	addShape(generateMapCircleShape(400, 80, 50, 1, 360, false), true);		//teljes kör (1 fokonként van 360 oldal, azaz 360 db háromszög)	 
}

function addShape(shape, isAddToMap) {
	if(isAddToMap) {
		mapShapes.push(shape);
		shapeVertexNum += shape.vertexCoords.length;
	}	
	drawShape(mapContext, shape);	
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
	if(isLightMoveMode) {				
		calcCircualLightRays(light, mapShapes);
		drawLightRaysTriangle(linesContext, light);
		//drawLightRays(linesContext, light);
	}	
	drawLight(linesContext, light);	
}

function refreshMouseCanvas() {
	clearCanvas(mouseContext);	
	mouseContext.fillStyle = 'white';
	mouseContext.fillText("mouse X: " + mouseX + ' Y: ' +  mouseY, 5, 10);
	mouseContext.fillText("light X: " + light.x + ' Y: ' +  light.y, 5, 25);
	mouseContext.fillText("rays distance: " + light.distance, 5, 40);
	mouseContext.fillText("rays number: " + 360 / LIGHT_RAY_RESOLUTION, 5, 55);
	mouseContext.fillText("calculator count: " + calculatorCounter, 5, 70);
	mouseContext.fillText("map all vertex num: " + shapeVertexNum, 5, 85);	
}

function clearCanvas(canvasContext) {
	canvasContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
}

function drawShape(canvasContext, shape) {
	if(shape.vertexCoords.length < 3)
		return;	
	for(let i = 0; i != shape.vertexCoords.length; i++) {
		let coordFrom  = shape.vertexCoords[i];
		let coordTo;
		if(i + 1 == shape.vertexCoords.length)				//ha elér az utolsóig, akkor azt kösse össze az elsővel
			coordTo  = shape.vertexCoords[0];
		else
			coordTo  = shape.vertexCoords[i + 1];
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
		drawTriangleGardient(canvasContext, light.x, light.y, coord1.x, coord1.y, coord2.x, coord2.y, 'yellow'/*'#89996d'*/, '#204060');
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

function drawTriangleGardient(canvasContext, lightX, lightY, coord1X, coord1Y, coord2X, coord2Y, insideColor, outSideColor) {
	
	var grd = canvasContext.createRadialGradient(lightX, lightY, 5, lightX, lightY, 300); //<- itt állíthatod a fényerősségét (grafikusan látványosabb)

	var opacity = 0.5; //55% visible
	grd.addColorStop(0,'rgba(205, 199, 35,' + opacity + ')');
	grd.addColorStop(1, 'transparent');

	//grd.addColorStop(0, insideColor);
	//grd.addColorStop(1, outSideColor);
	
	canvasContext.beginPath();	
	canvasContext.lineWidth = 1;
	//canvasContext.strokeStyle = outSideColor;
	//canvasContext.stroke();
	canvasContext.strokeStyle = grd;
	canvasContext.moveTo(lightX, lightY);
	canvasContext.lineTo(coord1X, coord1Y);
	canvasContext.lineTo(coord2X, coord2Y);
	canvasContext.fillStyle = grd; //fillColor;
	canvasContext.fill();
	canvasContext.closePath();	 
	//canvasContext.stroke();
}

// light-ray system -----------------------------------------------------------
function calcCircualLightRays(light, shapes) {
	calculatorCounter = 0;		
	let intersectionPoints = new Array();
	for(let angle = 0; angle != 360; angle += LIGHT_RAY_RESOLUTION) {		
  	let rayEndCord = calcCoordsLineWithAngle(light.x, light.y, angle, light.distance);

		for(var j = 0; j != shapes.length; j++) {
			let shape = shapes[j];

			for(let i = 0; i != shape.vertexCoords.length; i++) {	//balról jobbra vannak az egyes pontok kiértékelve
				let shapeLineFrom  = shape.vertexCoords[i];
				let shapeLineTo;
				if(i + 1 == shape.vertexCoords.length) {	//ha elér az utolsóig, akkor azt kösse össze az elsővel
					shapeLineTo  = shape.vertexCoords[0];
				}	else {				
					shapeLineTo  = shape.vertexCoords[i + 1];
				}				
				let intersectPoint = calcLinesIntersect(light.x, light.y, rayEndCord.x, rayEndCord.y, shapeLineFrom.x, shapeLineFrom.y, shapeLineTo.x, shapeLineTo.y);
				if(intersectPoint != null) {
					intersectionPoints.push(intersectPoint);
				}
				calculatorCounter++;		//a belső ciklus lefut: összes shape vertex * light sugarak számával (436 * 180 = 78480) !!!
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