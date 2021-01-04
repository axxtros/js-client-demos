// lines interesting

var DESCARTES_CENTER = 300;				//a canvas-ek width, height-jának ennek kétszeresének kell lennie
var DESCARTES_STEP_LENGTH = 10;		//egy egység a descartes koordináta rendszerben ennyi pixelnek felel meg a grafikus felületen
var DRAW_POINT_SIZE = 5;					//ekkor átmérőjűek a szakaszok végeit jelölő körök
var DIRECTION_VECTOR_SYMBOL = 'v';
var NORMAL_VECTOR_SYMBOL = 'n';

var lineObject = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  color : 'red',
  type : 'P',
  isDragPoint1 : false,
  isDragPoint2 : false,
  dx: 0,
  dy: 0,
  nx: 0,
  ny: 0,
  isVisibleDirect: false,
  isVisibleNormal: false,
  isFlipDirect: false,
  isFlipNormal: false
};

var line1, line2;

var descartesCanvas;
var descartesContext;
var linesCanvas;
var linesContext;
var mouseCanvas;
var mouseContext;

var isMouseDrawMode;
var mouseDescartesCoordX;
var mouseDescartesCoordY;

var isInterSecPoint = false;
var interSecX, interSecY;
var interSecPointSymbol = 'M';
var isInterSecPointColor = '#3aa03d';

function initLineInteresting() {
	isMouseWriteMode = false;

	line1 = Object.create(lineObject);
	line2 = Object.create(lineObject);

	line1.color = '#d24a4a';
	line1.type = 'P';
	line2.color = '#6565de';
	line2.type = 'Q';

	initCanvas();
	drawDescartesCoordSystem(descartesContext);
	initLines(line1);
	initLines(line2);
}

function initCanvas() {
	descartesCanvas = document.getElementById("descartes-canvas-id");	
	descartesContext = descartesCanvas.getContext("2d");
	descartesContext.scale(1, 1);

	linesCanvas = document.getElementById("lines-canvas-id");
	linesContext = 	linesCanvas.getContext("2d");
	linesContext.scale(1, 1);

	var descartesCanvasPos = descartesCanvas.getBoundingClientRect();
	$('#lines-canvas-id').css('position', 'absolute');
	$("#lines-canvas-id").css({ top: descartesCanvasPos.top + 'px' });	
	$("#lines-canvas-id").css({ left: descartesCanvasPos.left + 'px' });	
	$("#lines-canvas-id").css({ width: descartesCanvasPos.width + 'px' });	
	$("#lines-canvas-id").css({ height: descartesCanvasPos.height + 'px' });

	mouseCanvas = document.getElementById("mouse-canvas-id");
	mouseContext = 	mouseCanvas.getContext("2d");
	mouseContext.scale(1, 1);

	$('#mouse-canvas-id').css('position', 'absolute');
	$("#mouse-canvas-id").css({ top: descartesCanvasPos.top + 'px' });	
	$("#mouse-canvas-id").css({ left: descartesCanvasPos.left + 'px' });	
	$("#mouse-canvas-id").css({ width: descartesCanvasPos.width + 'px' });	
	$("#mouse-canvas-id").css({ height: descartesCanvasPos.height + 'px' });
}

function initLines(line) {
	let randMax = parseInt(DESCARTES_CENTER / DESCARTES_STEP_LENGTH);
	let randMin = randMax * (-1);
	line.x1 = generateRandomNumber(randMin, randMax);
	line.y1 = generateRandomNumber(randMin, randMax);
	line.x2 = generateRandomNumber(randMin, randMax);
	line.y2 = generateRandomNumber(randMin, randMax);
	//console.log(' X1: ' + line.x1 + ' Y1: ' + line.y1 + ' X2: ' + line.x2 + ' Y2: ' + line.y2 + ' color: ' + line.color + ' type: ' + line.type);
	fillCoordFields(line);
	fillLineCalcVectors(line);
	drawLineWithEndpoints(linesContext, line);
}

function fillCoordFields(line) {	
	if(line.type === 'P') {
		$("#p1x").val(line.x1);
		$("#p1y").val(line.y1);
		$("#p2x").val(line.x2);
		$("#p2y").val(line.y2);		
	} else if(line.type === 'Q') {
		$("#q1x").val(line.x1);
		$("#q1y").val(line.y1);
		$("#q2x").val(line.x2);
		$("#q2y").val(line.y2);		
	}
}

function visibleLineVectorsEvent(lineType, vectorType) {
	if(lineType === 'P') {
		if(vectorType === 'D') {
			line1.isVisibleDirect == false ? line1.isVisibleDirect = true : line1.isVisibleDirect = false;
		} else { //N
			line1.isVisibleNormal == false ? line1.isVisibleNormal = true : line1.isVisibleNormal = false;
		}
	} else { //Q
		if(vectorType === 'D') {
			line2.isVisibleDirect == false ? line2.isVisibleDirect = true : line2.isVisibleDirect = false;
		} else { //N
			line2.isVisibleNormal == false ? line2.isVisibleNormal = true : line2.isVisibleNormal = false;
		}
	}
	refreshDrawLines();	
}

function flipLineVectorsEvent(lineType, vectorType) {
	if(lineType === 'P') {
		if(vectorType === 'D') {
			line1.isFlipDirect == false ? line1.isFlipDirect = true : line1.isFlipDirect = false;
		} else {	//N
			line1.isFlipNormal == false ? line1.isFlipNormal = true : line1.isFlipNormal = false;
		}
	} else {	//Q
		if(vectorType === 'D') {
			line2.isFlipDirect == false ? line2.isFlipDirect = true : line2.isFlipDirect = false;
		} else {	//N
			line2.isFlipNormal == false ? line2.isFlipNormal = true : line2.isFlipNormal = false;
		}
	}
	fillLineCalcVectors(line1);
	fillLineCalcVectors(line2);
	refreshDrawLines();
}

function drawDescartesClickEvent(lineType) {	
	let inp_p1X = parseInt( lineType === 'P' ? $('#p1x').val() : $('#q1x').val() );
	let inp_p1Y = parseInt( lineType === 'P' ? $('#p1y').val() : $('#q1y').val() );
	let inp_p2X = parseInt( lineType === 'P' ? $('#p2x').val() : $('#q2x').val() );
	let inp_p2Y = parseInt( lineType === 'P' ? $('#p2y').val() : $('#q2y').val() );

	let maxValue = DESCARTES_CENTER / DESCARTES_STEP_LENGTH;	//ennél nagyobb érték nem lehet, mert akkor a szakaszok kimehetnek a koordináta rendszerből
	let minValue = maxValue * -1;

	if(inp_p1X > maxValue) 
		inp_p1X = maxValue;
	if(inp_p1X < minValue) 
		inp_p1X = minValue;	

	if(inp_p1Y > maxValue) 
		inp_p1Y = maxValue;
	if(inp_p1Y < minValue) 
		inp_p1Y = minValue;	

	if(inp_p2X > maxValue) 
		inp_p2X = maxValue;
	if(inp_p2X < minValue) 
		inp_p2X = minValue;	

	if(inp_p2Y > maxValue) 
		inp_p2Y = maxValue;
	if(inp_p2Y < minValue) 
		inp_p2Y = minValue;

	if(lineType === 'P') {
		line1.x1 = inp_p1X;
		line1.y1 = inp_p1Y;
		line1.x2 = inp_p2X;
		line1.y2 = inp_p2Y;	
		fillLineCalcVectors(line1);
	} else if(lineType === 'Q') {
		line2.x1 = inp_p1X;
		line2.y1 = inp_p1Y;
		line2.x2 = inp_p2X;
		line2.y2 = inp_p2Y;				
		fillLineCalcVectors(line2);
	}	
	refreshDrawLines();
}

function fillLineCalcVectors(line) {
	calcDirectionVec(line);
	calcNormalVec(line);

	calcInterestingPoint(line1, line2);
	
	if(line.type === 'P') {
		$("#line1-direction-vec").text('v(' + line.dx + ', ' + line.dy +')');
		$("#line1-normal-vec").text('n(' + line.nx + ', ' + line.ny +')');
	} else {
		$("#line2-direction-vec").text('v(' + line.dx + ', ' + line.dy +')');	
		$("#line2-normal-vec").text('n(' + line.nx + ', ' + line.ny +')');
	}	
}

function refreshDrawLines() {
	clearCanvas(linesContext);
	drawLineWithEndpoints(linesContext, line1);
	drawLineWithEndpoints(linesContext, line2);
	if(isInterSecPoint) {
		drawPoint(linesContext, interSecX, interSecY, isInterSecPointColor, interSecPointSymbol);
	} else {
		drawEmptyPoint(linesContext, interSecX, interSecY, isInterSecPointColor, interSecPointSymbol);
	}
}

function drawLineWithEndpoints(canvasContext, line) {
	p1X = convertCanvasToDescartesCoord(line.x1, true, false);
	p1Y = convertCanvasToDescartesCoord(line.y1, false, true);
	p2X = convertCanvasToDescartesCoord(line.x2, true, false);
	p2Y = convertCanvasToDescartesCoord(line.y2, false, true);
	drawFullLine(linesContext, p1X, p1Y, p2X, p2Y, line.color, line.type);

	if(line.isVisibleDirect) {
		drawLineDirectionVector(canvasContext, line, DIRECTION_VECTOR_SYMBOL);
	}
	if(line.isVisibleNormal) {
		drawNormalVector(canvasContext, line, NORMAL_VECTOR_SYMBOL);
	}
}

function drawLineDirectionVector(canvasContext, line, symbol) {
	let dX = convertCanvasToDescartesCoord(line.dx, true, false);
	let dY = convertCanvasToDescartesCoord(line.dy, false, true);
	drawVector(linesContext, convertCanvasToDescartesCoord(0), convertCanvasToDescartesCoord(0), dX, dY, line.color, symbol);
}

function drawNormalVector(canvasContext, line, symbol) {
	let nX = convertCanvasToDescartesCoord(line.nx, true, false);
	let nY = convertCanvasToDescartesCoord(line.ny, false, true);
	drawVector(linesContext, convertCanvasToDescartesCoord(0), convertCanvasToDescartesCoord(0), nX, nY, line.color, symbol);
}

function convertCanvasToDescartesCoord(inputValue, isAbcissa, isOrdinate) {
	let stepPixel = Math.abs(inputValue * DESCARTES_STEP_LENGTH);
	if(inputValue == 0) {
		return DESCARTES_CENTER;
	}
	if(inputValue > DESCARTES_CENTER / DESCARTES_STEP_LENGTH) {
		inputValue = DESCARTES_CENTER / DESCARTES_STEP_LENGTH;
	}
	if(inputValue < 0 && isAbcissa) {
		return DESCARTES_CENTER - stepPixel;
	} 
	if(inputValue > 0 && isAbcissa) {
		return DESCARTES_CENTER + stepPixel;
	}
	if(inputValue < 0 && isOrdinate) {
		return DESCARTES_CENTER + stepPixel;
	} 
	if(inputValue > 0 && isOrdinate) {
		return DESCARTES_CENTER - stepPixel;
	}
}

//mouse -----------------------------------------------------------------------
function startDrawMode() {
	let xMin = mouseDescartesCoordX - ((DRAW_POINT_SIZE / 2 | 0));	//hogy ne pontosan kelljen az egér kurzorral eltalálni a szakasz végén található pontot, legyen egy kis mozgástér
	let xMax = mouseDescartesCoordX + ((DRAW_POINT_SIZE / 2 | 0));
	let yMin = mouseDescartesCoordY - ((DRAW_POINT_SIZE / 2 | 0));	//hogy ne pontosan kelljen az egér kurzorral eltalálni a szakasz végén található pontot, legyen egy kis mozgástér
	let yMax = mouseDescartesCoordY + ((DRAW_POINT_SIZE / 2 | 0));
	
	if(line1.x1 > xMin && line1.x1 < xMax && line1.y1 > yMin && line1.y1 < yMax) {		
		line1.isDragPoint1 = true;
		isMouseDrawMode = true;
	}
	if(line1.x2 > xMin && line1.x2 < xMax && line1.y2 > yMin && line1.y2 < yMax) {		
		line1.isDragPoint2 = true;
		isMouseDrawMode = true;
	}
	if(line2.x1 > xMin && line2.x1 < xMax && line2.y1 > yMin && line2.y1 < yMax) {		
		line2.isDragPoint1 = true;
		isMouseDrawMode = true;
	}
	if(line2.x2 > xMin && line2.x2 < xMax && line2.y2 > yMin && line2.y2 < yMax) {		
		line2.isDragPoint2 = true;
		isMouseDrawMode = true;
	}
}

function drawFromMouseCoord() {
	if(isMouseDrawMode) {
		//console.log("dragged!");
		if(line1.isDragPoint1) {
			line1.x1 = mouseDescartesCoordX;				
			line1.y1 = mouseDescartesCoordY;
		} else if(line1.isDragPoint2) {
			line1.x2 = mouseDescartesCoordX;				
			line1.y2 = mouseDescartesCoordY;
		} else if(line2.isDragPoint1) {
			line2.x1 = mouseDescartesCoordX;				
			line2.y1 = mouseDescartesCoordY;
		} else if(line2.isDragPoint2) {
			line2.x2 = mouseDescartesCoordX;				
			line2.y2 = mouseDescartesCoordY;
		}
		fillCoordFields(line1);
		fillCoordFields(line2);
		fillLineCalcVectors(line1);
		fillLineCalcVectors(line2);		
		refreshDrawLines();
	}
}

function stopDrawMode() {	
	if(isMouseDrawMode) {
		isMouseDrawMode = false;
		line1.isDragPoint1 = false;
		line1.isDragPoint2 = false;
		line2.isDragPoint1 = false;
		line2.isDragPoint2 = false;
	}
}

function writeMouseCoord(event) {
	clearCanvas(mouseContext);	
	let mouseX = getMousePos(mouseCanvas, event).x;
	let mouseY = getMousePos(mouseCanvas, event).y;
	mouseDescartesCoordX = ((DESCARTES_CENTER - mouseX) * (-1)) / 10;
	mouseDescartesCoordY = ((mouseY - DESCARTES_CENTER) * (-1)) / 10;
	//mouseContext.fillText("X:" + mouseX + ' Y:' +  mouseY, 5, 10);
	mouseContext.fillText("X:" + mouseDescartesCoordX + ' Y:' +  mouseDescartesCoordY, 5, 10);
}

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
}

//draws -----------------------------------------------------------------------
function clearCanvas(canvasContext) {
	canvasContext.clearRect(0, 0, descartesCanvas.width, descartesCanvas.height);
}

function drawDescartesCoordSystem(canvasContext) {
	canvasContext.beginPath();
	canvasContext.lineWidth = 1;
	canvasContext.strokeStyle = "#777777";	
	canvasContext.moveTo(DESCARTES_CENTER, 0);
	canvasContext.lineTo(DESCARTES_CENTER, DESCARTES_CENTER * 2);
	canvasContext.moveTo(0, DESCARTES_CENTER);	
	canvasContext.lineTo(DESCARTES_CENTER * 2, DESCARTES_CENTER);

	canvasContext.font = "12px Arial";
	let x,y = 0;
	for(x = 0; x != ((DESCARTES_CENTER * 2) + DESCARTES_STEP_LENGTH); x += DESCARTES_STEP_LENGTH) {
		canvasContext.moveTo(x, DESCARTES_CENTER - 3);
		canvasContext.lineTo(x, DESCARTES_CENTER + 3);
	}
	canvasContext.fillText("x", x - 20, DESCARTES_CENTER + 16);

	canvasContext.fillText("y", DESCARTES_CENTER - 16, y + 10);
	for(y = 0; y != ((DESCARTES_CENTER * 2) + DESCARTES_STEP_LENGTH); y += DESCARTES_STEP_LENGTH) {
		canvasContext.moveTo(DESCARTES_CENTER - 3, y);
		canvasContext.lineTo(DESCARTES_CENTER + 3, y);
	}			
	canvasContext.closePath();
	canvasContext.stroke();
}

function drawFullLine(canvasContext, x1, y1, x2, y2, color, symbol) {
	drawPoint(canvasContext, x1, y1, color, symbol + '1');
	drawPoint(canvasContext, x2, y2, color, symbol + '2');
	drawLine(canvasContext, x1, y1, x2, y2, color);
}

function drawVector(canvasContext, x1, y1, x2, y2, color, symbol) {
	drawLine(canvasContext, x1, y1, x2, y2, color);	
	drawPointSymbol(canvasContext, x2, y2, color, symbol);
	drawVecotorEnd(canvasContext, x2, y2, color);
}

function drawPoint(canvasContext, x, y, color, symbol) {
	canvasContext.beginPath();
	canvasContext.arc(x, y, DRAW_POINT_SIZE, 0, 2 * Math.PI, false);	
	canvasContext.fillStyle = color;
	canvasContext.fill();
	canvasContext.closePath();
	drawPointSymbol(canvasContext, x, y, color, symbol);
}

function drawEmptyPoint(canvasContext, x, y, color, symbol) {
	canvasContext.beginPath();
	canvasContext.arc(x, y, DRAW_POINT_SIZE, 0, 2 * Math.PI);
	canvasContext.lineWidth = 2;
	canvasContext.strokeStyle = color;
	canvasContext.stroke();
	canvasContext.closePath();
	drawPointSymbol(canvasContext, x, y, color, symbol);
}

function drawPointSymbol(canvasContext, x, y, color, symbol) {
	canvasContext.beginPath();
	canvasContext.font = "12px Arial";
	canvasContext.strokeStyle = color;
	canvasContext.fillText(symbol, x - 8, y - 8);
	canvasContext.stroke();
	canvasContext.closePath();
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

function drawVecotorEnd(canvasContext, x, y, color) {
	canvasContext.beginPath();
	canvasContext.arc(x, y, 2, 0, 2 * Math.PI, false);	
	canvasContext.fillStyle = color;
	canvasContext.fill();
	canvasContext.closePath();
}

//calculations ----------------------------------------------------------------
function calcDirectionVec(line) {
	line.dx = Math.floor(line.isFlipDirect == false ? line.x2 - line.x1 : line.x1 - line.x2);
	line.dy = Math.floor(line.isFlipDirect == false ? line.y2 - line.y1 : line.y1 - line.y2);	
}

function calcNormalVec(line) {
	line.nx = line.isFlipNormal == false ? Math.floor(line.dy) * -1 : Math.floor(line.dy);
	line.ny = line.isFlipNormal == false ? Math.floor(line.dx) : Math.floor(line.dx) * -1;	
}

//https://stackoverflow.com/questions/16314069/calculation-of-intersections-between-line-segments
//http://gisfigyelo.geocentrum.hu/ncgia/ncgia_32.html
function calcInterestingPoint(line1, line2) {
	//console.log('Red (' + line1.x1 + ', ' + line1.y1 + ') (' + line1.x2 + ', ' + line1.y2 + ')');
	//console.log('Blue (' + line2.x1 + ', ' + line2.y1 + ') (' + line2.x2 + ', ' + line2.y2 + ')');

	//checkLineIntersection(line1.x1, line1.y1, line1.x2, line1.y2, line2.x1, line2.y1, line2.x2, line2.y2);
	line_intersect(line1.x1, line1.y1, line1.x2, line1.y2, line2.x1, line2.y1, line2.x2, line2.y2);

}

//https://stackoverflow.com/questions/13937782/calculating-the-point-of-intersection-of-two-lines
//http://paulbourke.net/geometry/pointlineplane/
//javítva az alatta található algoritmus alapján
function line_intersect(x1, y1, x2, y2, x3, y3, x4, y4)
{
    var ua, ub, denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    
    if (denom == 0) {	//denimnator == 0 is not divide!
        return null;
    }

    ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

    //console.log('ua, ub  (' + ua + ', ' + ub + ')');

    let m = x1 + ua * (x2 - x1);
    let n = y1 + ua * (y2 - y1); //ub helyett ua !!!

		//console.log('m,n  (' + m + ', ' + n + ')');
		
		//console.log('interSecX, interSecY  (' + interSecX + ', ' + interSecY + ')');

		//The denominators for the equations for ua and ub are the same.
		//If the denominator for the equations for ua and ub is 0 then the two lines are parallel.
		//If the denominator and numerator for the equations for ua and ub are 0 then the two lines are coincident.
		//The equations apply to lines, if the intersection of line segments is required then it is only necessary to test if ua and ub lie between 0 and 1. Whichever one lies within that range then the corresponding line segment contains the intersection point. If both lie within the range of 0 to 1 then the intersection point is within both line segments.

		if(ua > 0 && ua < 1 && ub > 0 && ub < 1) {	//ekkor metszi egymást a két szakasz		
			isInterSecPoint = true;			
		} else {
			isInterSecPoint = false;
		}

		//kiíratás és rajz
		$("#interesting-point-span").text('M(' + Math.floor(m) + ', ' + Math.floor(n) +')');
		interSecX = Math.floor(convertCanvasToDescartesCoord(m, true, false));
		interSecY = Math.floor(convertCanvasToDescartesCoord(n, false, true));
		refreshDrawLines();
}

//http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
//müködik!
function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));

    if (denominator == 0) {		//nevezőben 0-val nem osztunk!
        return result;
    }

    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;

    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);

    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));

    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }

    interSecX = Math.floor(convertCanvasToDescartesCoord(result.x, true, false));
		interSecY = Math.floor(convertCanvasToDescartesCoord(result.y, false, true));
		refreshDrawLines();

    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
};

//utils -----------------------------------------------------------------------
function generateRandomNumber(minValue, maxValue) {
	return Math.floor(Math.random() * (maxValue - minValue) + minValue);
}

//http://simblob.blogspot.com/2012/07/2d-visibility.html