//dungeon generator
//27/05/2019 axtros@gmail.com

var DEBUG_DRAW_MAP_TILE_COORDS = true;

var MAP_TOPLEFT_X = 0;				//a canvas-en hol van a térkép bal felső sarka, ahonnan a kirajzolás kezdődik (relatív bal-felső sarok, canvas-en belül)
var MAP_TOPLEFT_Y = 0;

var MAP_ROW_WIDTH = 21;				//a térkép mátrix row/column nagysága
var MAP_ROW_HEIGHT = 21;

var ISOMETRIC_TILE_WIDTH = 60;		//egy adott térképcsempe hosszúsága / magassága
var ISOMETRIC_TILE_HEIGHT = (ISOMETRIC_TILE_WIDTH / 2);

var MAP_TOP_TILE_X = MAP_TOPLEFT_X + (ISOMETRIC_TILE_WIDTH * (MAP_ROW_HEIGHT / 2));		//a diamon alakú izometrikus térkép legfelső csempéjének x, y koordinátája
var MAP_TOP_TILE_Y = MAP_TOPLEFT_Y + (ISOMETRIC_TILE_HEIGHT / 2);
var CANVAS_BACKGROUND_COLOR = '#fff';

var mapCanvas;
var mapContext;
var mapCanvasPos;
var mouseCanvas;
var mouseContext;

var mapMatrix = new Array();

function init_isometric_map() {
	initCanvases();

	mapMatrix = generateDungeon(MAP_ROW_WIDTH, MAP_ROW_HEIGHT, 3, 5, 3, 5, 200);

	drawTopLeftLines();
	drawDiamondIsometricMap(MAP_TOP_TILE_X, MAP_TOP_TILE_Y);	
}

function initCanvases() {
	mapCanvas = document.getElementById("map-canvas-id");	
	mapContext = mapCanvas.getContext("2d");
	mapContext.scale(1, 1);

	mapCanvasPos = mapCanvas.getBoundingClientRect();	
	mapContext.fillStyle = CANVAS_BACKGROUND_COLOR;
	mapContext.fillRect(0, 0, mapCanvasPos.width, mapCanvasPos.height);	
	
	mouseCanvas = document.getElementById("mouse-canvas-id");
	mouseContext = mouseCanvas.getContext("2d");
	mouseContext.scale(1, 1);
	$('#mouse-canvas-id').css('position', 'absolute');
	$("#mouse-canvas-id").css({ top: mapCanvasPos.top + 'px' });	
	$("#mouse-canvas-id").css({ left: mapCanvasPos.left + 'px' });	
	$("#mouse-canvas-id").css({ width: mapCanvasPos.width + 'px' });	
	$("#mouse-canvas-id").css({ height: mapCanvasPos.height + 'px' });
}

//a térkép TOPLEFT segédvonalainak felrajzolása
function drawTopLeftLines() {
	drawLine(mapContext, MAP_TOPLEFT_X, 0, MAP_TOPLEFT_X, mapCanvasPos.height, 'red');
	drawLine(mapContext, 0, MAP_TOPLEFT_Y, mapCanvasPos.width, MAP_TOPLEFT_Y, 'green');
}

function drawDiamondIsometricMap(topTileX, topTileY) {
	let tileX = topTileX;
	let tileY = topTileY;
	let originalX = tileX;
	let originalY = tileY;
	for(let row = 0; row != mapMatrix.length; row++) {
		for(let column = 0; column != mapMatrix[0].length; column++) {
			let tileColor = 'gray';
			switch(mapMatrix[row][column]) {
				case MAP_EMPTY_GRID: tileColor = MAP_EMPTY_COLOR; break;
				case MAP_MAZE_GRID: tileColor = MAP_MAZE_COLOR; break;
				case MAP_ROOM_GRID: tileColor = MAP_ROOM_COLOR; break;
				case MAP_DOOR_GRID: tileColor = MAP_DOOR_COLOR; break;
			}
			drawTile(mapContext, tileX, tileY, ISOMETRIC_TILE_WIDTH, tileColor, DEBUG_DRAW_MAP_TILE_COORDS ? row + ',' + column : '');		
			tileX -= (ISOMETRIC_TILE_WIDTH / 2);
			tileY += (Math.round(ISOMETRIC_TILE_WIDTH / 4));
		}
		tileX = originalX + ((row + 1) * (Math.round(ISOMETRIC_TILE_WIDTH / 2)));
		tileY = originalY + ((row + 1) * (Math.round(ISOMETRIC_TILE_WIDTH / 4)));
	}	
}

//https://2dengine.com/?p=isometric#Types_of_isometric_maps
function mouseCursorPos(event) {
	var rect = mouseCanvas.getBoundingClientRect();
	let mouseX = event.offsetX; // - rect.left;
	let mouseY = event.offsetY; // - rect.top;
	mouseContext.clearRect(0, 0, 400, 100);  
  mouseContext.fillText("mouse cursor X:" + mouseX + ' Y:' +  mouseY, 5, 10);
  getMapTilePos(mouseX, mouseY); 
}

//https://prog.hu/tudastar/206430/izometrikus-terkepen-a-csempe-koordinatainak-meghatarozasa
//https://jsfiddle.net/0c4j9stv/0
/*
	ahol TOPLEFT az ábra bal felső sarka a canvas koordináta rendszerében, a TILE_WIDTH és TILE_HEIGHT a csempék nagysága, 
	az N pedig az ábra "mérete" (a demó szerint 8), a tileX és tileY adja meg így a csempe "indexét", 
	(értelemszerűen, ha TOPLEFT = (0,0), akkor "egyszerűsíthető")
*/
function getMapTilePos(mouseX, mouseY) {
	let mx = (mouseX - MAP_TOPLEFT_X) / ISOMETRIC_TILE_WIDTH;
	let my = (mouseY - MAP_TOPLEFT_Y) / ISOMETRIC_TILE_HEIGHT;
	let tileX = Math.floor(my + mx - ((MAP_ROW_WIDTH  - (MAP_ROW_WIDTH - MAP_ROW_HEIGHT)) / 2));
	let tileY = Math.floor(MAP_ROW_HEIGHT / 2 - mx + my);
	mouseContext.fillText("selected tile X: " + tileX + " Y: " +  tileY, 5, 20);
}	

//draw ------------------------------------------------------------------------
function drawTile(canvasContext, x, y, width, color, text) {
	let tileHeight = (width / 2);	

	canvasContext.lineWidth = 1;
	canvasContext.beginPath();

	canvasContext.moveTo(x - (width / 2), y);
	canvasContext.lineTo(x, y - (tileHeight / 2));
	canvasContext.lineTo(x, y + (tileHeight / 2));	
	canvasContext.lineTo(x - (width / 2), y);

	canvasContext.lineTo(x, y - (tileHeight / 2));
	canvasContext.lineTo(x + (width / 2), y);
	canvasContext.lineTo(x, y + (tileHeight / 2));

	canvasContext.fillStyle = color;		
	canvasContext.closePath();   

	canvasContext.stroke();
	canvasContext.fill();

	canvasContext.fillStyle = 'white';
	canvasContext.fillText(text, x - 8, y + 3);
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