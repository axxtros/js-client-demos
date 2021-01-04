//hexagons tanulmányok 1
//04/10/2019 axtros@gmail.com

//https://www.redblobgames.com/grids/hexagons/

var MAP_BACKGROUND_COLOR = '#cccccc';

var hexagonCanvas;
var hexagonContext;

var hexaSize = 40;

function initHexagons() {
  initCanvases();  
  drawNumberedHexagons();       
  drawPointyHexagons();
  drawFlatHexagons();  
}

function initCanvases() {
	hexagonCanvas = document.getElementById("hexagon-canvas-id");
	hexagonContext = hexagonCanvas.getContext("2d");
	hexagonContext.scale(1, 1);
	hexagonContext.fillStyle = MAP_BACKGROUND_COLOR;
	hexagonContext.fillRect(0, 0, hexagonCanvas.width, hexagonCanvas.height);
}

//kirajzol egy teljes hexagont, sorszámozva az egyes szögeket megjelenítés és kalkuláció szerint
function drawNumberedHexagons() {  
  var hexCenterX = 60;
  var hexCenterY = 60;
  var point1 = calcFlatHexCoord(hexCenterX, hexCenterY, hexaSize, 1);  
  var point2 = calcFlatHexCoord(hexCenterX, hexCenterY, hexaSize, 2);  
  var point3 = calcFlatHexCoord(hexCenterX, hexCenterY, hexaSize, 3);  
  var point4 = calcFlatHexCoord(hexCenterX, hexCenterY, hexaSize, 4);  
  var point5 = calcFlatHexCoord(hexCenterX, hexCenterY, hexaSize, 5); 
  var point6 = calcFlatHexCoord(hexCenterX, hexCenterY, hexaSize, 6);

  drawPoint(hexagonContext, hexCenterX, hexCenterY, 'red', 'S');
  drawPoint(hexagonContext, point1.x, point1.y, '#000', '1');
  drawPoint(hexagonContext, point2.x, point2.y, '#000', '2');
  drawPoint(hexagonContext, point3.x, point3.y, '#000', '3');
  drawPoint(hexagonContext, point4.x, point4.y, '#000', '4');
  drawPoint(hexagonContext, point5.x, point5.y, '#000', '5');
  drawPoint(hexagonContext, point6.x, point6.y, '#000', '6');

  
  drawLine(hexagonContext, point1.x, point1.y, point2.x, point2.y, '#000');
  drawLine(hexagonContext, point2.x, point2.y, point3.x, point3.y, '#000');
  drawLine(hexagonContext, point3.x, point3.y, point4.x, point4.y, '#000');
  drawLine(hexagonContext, point4.x, point4.y, point5.x, point5.y, '#000');
  drawLine(hexagonContext, point5.x, point5.y, point6.x, point6.y, '#000');
  drawLine(hexagonContext, point6.x, point6.y, point1.x, point1.y, '#000');   
}

//szögre állított hexagrid-et rajzol ki
function drawPointyHexagons() {
  var pointyHexFirstCoordX = 200;
  var pointyHexFirstCoordY = 60; 
  var isPointyHex = true; 
  drawHexagon(isPointyHex, pointyHexFirstCoordX, pointyHexFirstCoordY, hexaSize, '#000');  
  drawHexagon(isPointyHex, pointyHexFirstCoordX + getPointyHexaWidth(hexaSize), pointyHexFirstCoordY, hexaSize, 'red');
  drawHexagon(isPointyHex, pointyHexFirstCoordX + getPointyHexaWidth(hexaSize) / 2, pointyHexFirstCoordY + getPointyHexaHeight(hexaSize), hexaSize, 'green');  
}

//élre állított hexagrid-et rajzol ki
function drawFlatHexagons() {
  var flatFirstCoordX = 200;
  var flatFirstCoordY = 220;  
  isPointyHex = false;
  drawHexagon(isPointyHex, flatFirstCoordX, flatFirstCoordY, hexaSize, '#000');  
  drawHexagon(isPointyHex, flatFirstCoordX + getFlatHexaWidth(hexaSize), flatFirstCoordY + getFlatHexaHeight(hexaSize) / 2, hexaSize, 'red');
  drawHexagon(isPointyHex, flatFirstCoordX, flatFirstCoordY + getFlatHexaHeight(hexaSize), hexaSize, 'green');
}

//draws -----------------------------------------------------------------------
function drawHexagon(isPointyHex, centerX, centerY, size, color) {
  var tempPoint = isPointyHex ? calcPointyHexCoord(centerX, centerY, size, 1) : calcFlatHexCoord(centerX, centerY, size, 1);
  for(let i = 2; i != 8; i++) {    
    var point = isPointyHex ? calcPointyHexCoord(centerX, centerY, size, i) : calcFlatHexCoord(centerX, centerY, size, i);
    drawLine(hexagonContext, tempPoint.x, tempPoint.y, point.x, point.y, color);
    tempPoint = point;
  }  
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

function drawPoint(canvasContext, x, y, color, symbol) {
	canvasContext.beginPath();
	canvasContext.arc(x, y, 5, 0, 2 * Math.PI, false);	
	canvasContext.fillStyle = color;
	canvasContext.fill();
	canvasContext.closePath();
	drawPointSymbol(canvasContext, x, y, color, symbol);
}

function drawPointSymbol(canvasContext, x, y, color, symbol) {
	canvasContext.beginPath();
	canvasContext.font = "12px Arial";
	canvasContext.strokeStyle = color;
	canvasContext.fillText(symbol, x - 4, y - 6);
	canvasContext.stroke();
	canvasContext.closePath();
}