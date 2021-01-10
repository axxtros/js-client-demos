//game_2d_light_with_matrix.js
//2D game light demo 2D-s mátrix rendszerbe ágyazva.
//20/05/2019 axtros@gmail.com

var MAP_MATRIX_SIZE = 20;					//ennyi pixel a canvas-en egy térkép matrix egység
var SHAPE_COLOR = '#e5e8b8';

var DEBUG_DRAW_MAP_SHAPES = true;
var DEBUG_VISIBLE_LIGHT_CALC_SHAPE_DISTANCE = true;
var DEBUG_VISIBLE_LIGHT_NO_CALC_RAY_BORDER = false;
var DEBUG_HALF_CIRCLE_OPTIMATION = true;	//csak a fénysugarak azon felével számoljon, amelyek az adott shape felé mutatnak

var LIGHT_START_X = 100;
var LIGHT_START_Y = 250;
var LIGHT_POINT_SIZE = 10;
var LIGHT_COLOR = 'yellow';
var LIGHT_RAY_DRAW_SIZE = 100;
var LIGHT_RAY_CALC_SIZE = 100;
var LIGHT_RAY_RESOLUTION = 4;					
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
	x: 0,									//vertex X
	y: 0,									//vertex Y
	mx: 0,									//matrix X
	my: 0,									//matrix Y
	glowRadius: LIGHT_POINT_SIZE,			//fényforrás nagysága
	glowColor: LIGHT_COLOR,					//fényforrás szine
	rayDensity: LIGHT_RAY_RESOLUTION,		//360 / rayDensity sugár indul ki a fényből (min: rayDensity = 1 => 360 rays, max: rayDensity = 360 => 1 rays)
	rayDrawDistance: LIGHT_RAY_DRAW_SIZE,	//kirajzolt fénysugarak nagysága
	rayCalcDistance: LIGHT_RAY_CALC_SIZE,	//kalkulált fénysugarak nagysága
	rayColor: LIGHT_RAY_COLOR,				//fénysugár szine
	isInit: false,							//true, ha már fel van inicializálva a fény (fénysugár metszéspont optimalizáció miatt kell)
	isMove: false,							//true, ha a fény mozgásban van (ha nincs mozgásban, akkor nem számolódnak hozzá ray-ek)
	lightShapes: new Array(),				//aktuálisan ezeket a shape-eket világítja meg a fény
	raysEndPoints: new Array(),				//az egyes fénysugarak számított végpontjaik
	debug_intersec_counter: 0,				//aktuálisan hányszor hívódik meg a intersect függvény
	debug_vertex_counter: 0,				//aktuálisan hány vertexel számol a fény
	debug_calculated_ray_counter: 0			//számolt fénysugár, amely nem esik a half-circle optimalizáció alá
}

var mapMatrix = new Array();
var mapShapes = new Array();
var mapLights = new Array();

var manualLight;												//az egérrel vezérelhető fény

var shapeVertexNum = 0;									//hány darab levizsgálandó shapevertex van

//game loop variables


function visibility2D_init() {
	initCanvases();
	initMap();	
	initLight();	
	refreshMouseCanvas(manualLight);	
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
	
	mapContext.fillStyle = "#204060";
	mapContext.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
	
	let mapWidth = 0;
	let mapHeight = 0;
	//kockás háttér rajzolása
	for(let x = 0; x != mapCanvas.width; x += MAP_MATRIX_SIZE) {
		drawLine(mapContext, x, 0, x, mapCanvas.height, '#1f3852');
		mapWidth++;
	}
	for(let y = 0; y != mapCanvas.height; y += MAP_MATRIX_SIZE) {
		drawLine(mapContext, 0, y, mapCanvas.width, y, '#1f3852');
		mapHeight++;
	}

	initMapMatrix(mapWidth, mapHeight);

	let mapCanvasPos = mapCanvas.getBoundingClientRect();
	initCanvasLayerCSS('lines-canvas-id', mapCanvasPos);
	initCanvasLayerCSS('mouse-canvas-id', mapCanvasPos);	
}

function initMapMatrix(width, height) {
	for(let i = 0; i != width; i++) {
		mapMatrix[i] = new Array(width);
		for(let j = 0; j != height; j++) {
			mapMatrix[i][j] = '0';
		}
	}	
}

function initMap() {
	
	let xx = 16;
	let yy = 1;
	for(let i = 0; i != 8; i++) {
		for(let j = 0; j != 8; j++) {
			addShape(generateMatrixRectangleShape(xx, yy, 1, 1, MAP_MATRIX_SIZE), true);
			xx += 3;
		}
		xx = 16;
		yy += 3;		
	}
	
	//addShape(generateMatrixRectangleShape(20, 10, 1, 1, MAP_MATRIX_SIZE), true);	
	//addShape(generateMatrixRectangleShape(24, 10, 1, 1, MAP_MATRIX_SIZE), true);
}

function addShape(shape, isAddToMap) {
	if(isAddToMap) {
		mapMatrix.push(shape);
		mapShapes.push(shape);
		shapeVertexNum += shape.vertexCoords.length;
	}
	if(DEBUG_DRAW_MAP_SHAPES)	{
		drawShape(mapContext, shape);
	}
}

function initLight() {
	manualLight = Object.create(Light);
	manualLight.x = LIGHT_START_X;
	manualLight.y = LIGHT_START_Y;
	let lightMatrixCoord = getMatrixCoord(manualLight.x, manualLight.y, MAP_MATRIX_SIZE);
	manualLight.mx = lightMatrixCoord.x;
	manualLight.my = lightMatrixCoord.y;		

	mapLights.push(manualLight);
	//refreshLineCanvas(manualLight);

	for(let i = 0; i != 2; i++) {
		light = Object.create(Light);
		light.x = 100; //generateRandomNumber(1, mapCanvas.width);
		light.y = generateRandomNumber(1, mapCanvas.height);
		let lightMatrixCoord = getMatrixCoord(light.x, light.y, MAP_MATRIX_SIZE);
		light.mx = lightMatrixCoord.x;
		light.my = lightMatrixCoord.y;		
		//mapLights.push(light);	
	}
	requestAnimationFrame(gameLoop2);
}

var delta = 0;
var lastFrameTimeMs = 0;
var timestep = 1000 / 60;

function gameLoop2(timestamp) {    
    delta += timestamp - lastFrameTimeMs; // note += here
    lastFrameTimeMs = timestamp;
     
    while (delta >= timestep) {       
    		//update    		

        delta -= timestep;
    }
		//draw    	       
		calcAndDrawLights(mapLights);		

    requestAnimationFrame(gameLoop2);
}

// ui events ------------------------------------------------------------------
function catchLight() {	
	if(mouseX >= manualLight.x - manualLight.glowRadius && mouseX <= manualLight.x + manualLight.glowRadius &&
		mouseY >= manualLight.y - manualLight.glowRadius && mouseY <= manualLight.y + manualLight.glowRadius) {
			manualLight.isMove = true;
	}
}

function dropLight() {
	manualLight.isMove = false;	
}

// mouse ----------------------------------------------------------------------
function mouseCoordCtrl(event) {	
	mouseX = getMousePos(mouseCanvas, event).x;
	mouseY = getMousePos(mouseCanvas, event).y;
	if(manualLight.isMove) {
		manualLight = mapLights[0];
		manualLight.x = mouseX;
		manualLight.y = mouseY;
		let lightMatrixCoord = getMatrixCoord(manualLight.x, manualLight.y, MAP_MATRIX_SIZE);
		manualLight.mx = lightMatrixCoord.x;
		manualLight.my = lightMatrixCoord.y;		
	}
	refreshMouseCanvas(manualLight);
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

function calcAndDrawLights(lights) {
	clearCanvas(linesContext);
	for(let i = 0; i != lights.length; i++) {
		calcCircualLightRays(lights[i]);
		refreshLineCanvas(lights[i]);
	}
}

function refreshLineCanvas(light) {
	drawLight(linesContext, light);
	drawLightRaysTriangle(linesContext, light);
	if(DEBUG_VISIBLE_LIGHT_CALC_SHAPE_DISTANCE)	{
		for(let i = 0; i != light.lightShapes.length; i++) {
			drawLine(linesContext, light.x, light.y, light.lightShapes[i].pivotVX, light.lightShapes[i].pivotVY, 'blue');
		}		
	}
}

function refreshMouseCanvas(light) {
	lineY = 0;
	clearCanvas(mouseContext);	
	mouseContext.fillStyle = 'white';
	mouseContext.fillText("all map shapes vertex num: " + shapeVertexNum, 5, lineY += 15);
	mouseContext.fillText("mouse x: " + mouseX + ' y: ' +  mouseY, 5, lineY += 15);
	mouseContext.fillText("light x: " + light.x + ' y: ' +  light.y, 5, lineY += 15);
	mouseContext.fillText("light mx: " + light.mx + ' my: ' +  light.my, 5, lineY += 15);
	mouseContext.fillText("rays calc distance: " + light.rayCalcDistance, 5, lineY += 15);
	mouseContext.fillText("light shape number: " + light.lightShapes.length, 5, lineY += 15);		
	mouseContext.fillText("ray density: " + 360 / light.rayDensity, 5, lineY += 15);
	mouseContext.fillText("shapes vertex calc count: " + light.debug_vertex_counter, 5, lineY += 15);	
	mouseContext.fillText("calc. rays num: " + light.debug_calculated_ray_counter, 5, lineY += 15);
	mouseContext.fillText("intersec calc. count: " + light.debug_intersec_counter, 5, lineY += 15);	
}

function clearCanvas(canvasContext) {
	canvasContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
}

function drawShape(canvasContext, shape) {
	if(shape.vertexCoords.length < 3)
		return;
	canvasContext.fillStyle = SHAPE_COLOR;
	canvasContext.fillRect(shape.pivotVX, shape.pivotVY, 1, 1);
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
	canvasContext.arc(light.x, light.y, light.glowRadius, 0, 2 * Math.PI, false);	
	canvasContext.fillStyle = light.glowColor;
	canvasContext.fill();
	canvasContext.closePath();	
}

/*
function drawLightRays(canvasContext, light) {	
	for(let i = 0; i != light.raysEndPoints.length; i++) {		
		let coordTo  = light.raysEndPoints[i];
		drawLine(canvasContext, light.x, light.y, coordTo.x, coordTo.y, light.rayColor);			
	}	
}
*/

function drawLightRaysTriangle(canvasContext, light) {
	for(let i = 0; i != light.raysEndPoints.length; i++) {
		let coord1  = light.raysEndPoints[i];
		let coord2;
		if(i < light.raysEndPoints.length - 1) {
			coord2  = light.raysEndPoints[i + 1];
		} else {
			coord2  = light.raysEndPoints[0];
		}
		drawTriangleGardient(canvasContext, light, coord1.x, coord1.y, coord2.x, coord2.y);
	}
	//light.raysEndPoints = [];
}

function drawTriangleGardient(canvasContext, light, coord1X, coord1Y, coord2X, coord2Y) {	
	var grd = canvasContext.createRadialGradient(light.x, light.y, 20, light.x, light.y, light.rayDrawDistance); //<- itt állíthatod a fényerősségét (grafikusan látványosabb)
	var opacity = 0.5; //55% visible
	grd.addColorStop(0,'rgba(205, 199, 35,' + opacity + ')');
	grd.addColorStop(1, 'transparent');	
	canvasContext.beginPath();	
	canvasContext.lineWidth = 1;	
	//canvasContext.stroke();
	canvasContext.strokeStyle = grd;
	canvasContext.moveTo(light.x, light.y);
	canvasContext.lineTo(coord1X, coord1Y);
	canvasContext.lineTo(coord2X, coord2Y);
	canvasContext.fillStyle = grd; //fillColor;
	canvasContext.fill();
	canvasContext.closePath();	 
	//canvasContext.stroke();
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

// light-ray system -----------------------------------------------------------
function calcCircualLightRays(light) {
	if(!light.isMove && light.isInit) {
		return;
	}
	if(!light.isInit) {
		light.isInit = true;
	}
	light.raysEndPoints = [];								  
	light.debug_intersec_counter = 0;
	light.debug_calculated_ray_counter = 0;
	let intersectionPoints = new Array();
	addShapesToLight(light, mapShapes);
		
	for(let angle = 0; angle != 360; angle += light.rayDensity) {	
  		let rayEndCord = calcCoordsLineWithAngle(light.x, light.y, angle, light.rayDrawDistance);
  		
		for(var j = 0; j != light.lightShapes.length; j++) {
			let shape = light.lightShapes[j];							

			if(!(DEBUG_HALF_CIRCLE_OPTIMATION && checkIsRayCalc(light, shape, angle))) {
				light.debug_calculated_ray_counter++;

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
					light.debug_intersec_counter++;		//a belső ciklus lefut: összes shape vertex * light sugarak számával (436 * 180 = 78480) !!!
				}

			} //half-circe optimization				

		}	//for shape

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
			let minDistance = light.rayDrawDistance;
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

//Hozzáadja a fényhez a vizsgálandó shape-eket, amelyeket le kell vizsgálnia az adott körben.
function addShapesToLight(light, mapShapes) {
	light.debug_vertex_counter = 0;
	light.lightShapes = [];
	for(let i = 0; i != mapShapes.length; i++) {
		let shape = mapShapes[i];
		let distance = calcCoordsDistance(light.x, light.y, shape.pivotVX, shape.pivotVY);
		if(distance < (light.rayCalcDistance + shape.farDistance)) {
			light.lightShapes.push(shape);
			light.debug_vertex_counter += shape.vertexCoords.length;
			/*
			if(DEBUG_VISIBLE_LIGHT_CALC_SHAPE_DISTANCE) {
				drawLine(linesContext, light.x, light.y, shape.pivotVX, shape.pivotVY, 'blue');
			}			
			*/
		}
	}
}

//megnézi, hogy az adott fénysugárra az elhelyezkedése miatt kell-e számolni a shape-felé metszéspontot
function checkIsRayCalc(light, shape, rayAngle) {
	let shapeAngle = Math.round(calcAngleBetweenCoordDegrees360(shape.pivotVX, shape.pivotVY, light.x, light.y));
	
	let minAngle = shapeAngle - 90;
	let maxAngle = shapeAngle + 90;

	if(shapeAngle == 0) {
		minAngle = 270;
		maxAngle = 90;
	} else {
		if(minAngle < 0) {
			minAngle = 360 - Math.abs(minAngle);
		}
		if(maxAngle > 360) {			
			maxAngle = Math.abs(360 - maxAngle);
		}
	}

	if(DEBUG_VISIBLE_LIGHT_NO_CALC_RAY_BORDER) {
		drawLineWithAngle(linesContext, light.x, light.y, minAngle, light.rayCalcDistance, 'red');
		drawLineWithAngle(linesContext, light.x, light.y, maxAngle, light.rayCalcDistance, 'red');
	}	
	//console.log('shapeAngle: ' + shapeAngle + ' minAngle:' + minAngle + ' maxAngle: ' + maxAngle + ' rayAngle: ' + rayAngle + ' isCalc: ' + isCalc);	
	return checkAngleBetweenAngles(rayAngle, minAngle, maxAngle);
}