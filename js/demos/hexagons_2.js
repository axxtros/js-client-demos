//hexagons tanulmányok 2
//08/10/2019 axtros@gmail.com

//https://www.redblobgames.com/grids/hexagons/

var MAP_BACKGROUND_COLOR = '#cccccc';
var HEX_COLOR= '#000';
var SELECTED_COLOR = '#ff0000';

var hexagonCanvas;
var hexagonContext;

var hexaSize = 20;
var firstCoordX = 20;
var firstCoordY = 18;

var mousePos = {
  x: 0,
  y: 0
}

var hexaMapTiles = new Array();

var hexaPoint = {
  x: 0,
  y: 0
}

var hexaTile = {
  center: hexaPoint,
  points: [hexaPoint, hexaPoint, hexaPoint, hexaPoint, hexaPoint, hexaPoint],
  mapColumn: 0,
  mapRow: 0
}

function initHexagons() {
  initCanvases();
  
  drawHexaMapGrid(8, 8);
}

function initCanvases() {
	hexagonCanvas = document.getElementById("hexagon-canvas-id");
	hexagonContext = hexagonCanvas.getContext("2d");
	hexagonContext.scale(1, 1);
	clearCanvas();
}

function clearCanvas() {
  hexagonContext.clearRect(0, 0, hexagonCanvas.width, hexagonCanvas.height);
  hexagonContext.fillStyle = MAP_BACKGROUND_COLOR;
	hexagonContext.fillRect(0, 0, hexagonCanvas.width, hexagonCanvas.height);
}

//“odd-q” vertical layout shoves odd columns down
function drawHexaMapGrid(rowNum, columnNum) {
  var coordX = firstCoordX;
  var coordY = firstCoordY;
  var columnCounter = 0;  

  clearCanvas();
  for(column = 0; column != columnNum; column++) {    
    for(row = 0; row != rowNum; row++) {
      let hexa = Object.create(hexaTile);
      //var isSelected = (selectedHexRow == column && selectedHexColumn == row);      
      
      drawHexagon(false, coordX, coordY, hexaSize, HEX_COLOR);
      coordY += getFlatHexaHeight(hexaSize);

      hexaMapTiles.push(hexa);
    }
    coordX += getFlatHexaWidth(hexaSize);
    if(columnCounter % 2 == 0) {
      coordY = firstCoordY + getFlatHexaHeight(hexaSize) / 2;
    } else {
      coordY = firstCoordY;
    }
    ++columnCounter;    
  }
  
  //drawHexagon(false, firstCoordX, firstCoordY, hexaSize, HEX_COLOR);
  //drawHexagon(false, firstCoordX + getFlatHexaWidth(hexaSize), firstCoordY + getFlatHexaHeight(hexaSize) / 2, hexaSize, HEX_COLOR);
  //drawHexagon(false, firstCoordX, firstCoordY + getFlatHexaHeight(hexaSize), hexaSize, HEX_COLOR);
}

function getMousePos(event) {
  var rect = hexagonCanvas.getBoundingClientRect();
  mousePos.x = event.clientX - rect.left;
  mousePos.y = event.clientY - rect.top;   
  //console.log('MX: ' + mousePos.x);
  //console.log('MY: ' + mousePos.y);
  //pixelToFlatHex(mousePos.x, mousePos.y, hexaSize);
  pos = getSelectedHexagon(mousePos.x, mousePos.y, hexaSize);
  console.log('x: ' + pos.x + ' y: ' + pos.y);  
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