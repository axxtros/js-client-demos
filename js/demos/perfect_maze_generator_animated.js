//perfect_maze_generator_animated.js
//24/05/2019 axtros@gmail.com

var MAP_BACKGROUND_COLOR = '#cccccc';
var ANIMATED_SPEED = 100;

var MAP_EMPTY_GRID = 0;
var MAP_MAZE_GRID = 1;
var MAZE_SIZE = 10;					//ennyi pixel a canvas-en egy térkép matrix egység
var MAZE_COLOR = '#000000';
var MAZE_LAST_GRID_COLOR = '#ff0000';

var mazeCanvas;
var mazeContext;

var mapMatrix = new Array();

var Cord = {
	row: 0,
	column: 0
}

//inits -----------------------------------------------------------------------
function init_animated_maze_generator() {
	 initCanvases();	
	 initMapMatrix(mazeCanvas.height / MAZE_SIZE, mazeCanvas.width / MAZE_SIZE);	 	 	 
	 mazeGeneratorAnimatedLoop(mapMatrix, 1, 1);
}

function initCanvases() {
	mazeCanvas = document.getElementById("maze-canvas-id");
	mazeContext = mazeCanvas.getContext("2d");
	mazeContext.scale(1, 1);

	let mazeCanvasPos = mazeCanvas.getBoundingClientRect();
	mazeContext.fillStyle = MAP_BACKGROUND_COLOR;
	mazeContext.fillRect(0, 0, mazeCanvas.width, mazeCanvas.height);
}

function initMapMatrix(row, column) {
	for(let i = 0; i != row; i++) {
		mapMatrix[i] = new Array();
		for(let j = 0; j != column; j++) {
			mapMatrix[i][j] = MAP_EMPTY_GRID;
		}
	}	
}

function mazeGeneratorAnimatedLoop(mapMatrix, startRow, startColumn) {
	let maxRow = mapMatrix.length;
	let maxColumn = mapMatrix[0].length;
	let cRow = startRow;
	let cColumn = startColumn;	
	let isDone = false;
	var moves = [];

	mapMatrix[cRow][cColumn] = MAP_MAZE_GRID;

	let mCord = Object.create(Cord);
	mCord.row = cRow;
	mCord.column = cColumn;
	
	moves.push(mCord);
	
  setInterval(function () {    
 	
		if(!isDone) {

			let possibleDirections = "";		
			if(cRow - 2 > 0 && cRow - 2 < maxRow && mapMatrix[cRow - 2][cColumn] == MAP_EMPTY_GRID) {
				possibleDirections += 'N';
			}		
			if(cRow + 2 > 0 && cRow + 2 < maxRow && mapMatrix[cRow + 2][cColumn] == MAP_EMPTY_GRID) {
				possibleDirections += 'S';
			}		
			if(cColumn - 2 > 0 && cColumn - 2 < maxColumn && mapMatrix[cRow][cColumn - 2] == MAP_EMPTY_GRID) {
				possibleDirections += 'W';
			}
			if(cColumn + 2 > 0 && cColumn + 2 < maxColumn && mapMatrix[cRow][cColumn + 2] == MAP_EMPTY_GRID) {
				possibleDirections += 'E';
			}

			if(possibleDirections.length > 1) {
				possibleDirections = possibleDirections[generateRandomNumber(0, possibleDirections.length - 1)];
			}

			if(possibleDirections != "") {
				switch(possibleDirections) {
					case 'N': 
						mapMatrix[cRow - 1][cColumn] = MAP_MAZE_GRID;						
						mapMatrix[cRow - 2][cColumn] = MAP_MAZE_GRID;
						cRow -= 2;				
					break;
					case 'S': 
						mapMatrix[cRow + 1][cColumn] = MAP_MAZE_GRID;						
						mapMatrix[cRow + 2][cColumn] = MAP_MAZE_GRID;
						cRow += 2;				
					break;
					case 'W': 
						mapMatrix[cRow][cColumn - 1] = MAP_MAZE_GRID;						
						mapMatrix[cRow][cColumn - 2] = MAP_MAZE_GRID;
						cColumn -= 2;				
					break;
					case 'E': 
						mapMatrix[cRow][cColumn + 1] = MAP_MAZE_GRID;						
						mapMatrix[cRow][cColumn + 2] = MAP_MAZE_GRID;
						cColumn += 2;				
					break;
				}
				
				let mCord = Object.create(Cord);
				mCord.row = cRow;
				mCord.column = cColumn;	
				moves.push(mCord);

			}	else {
				var back = moves.pop();
				cRow = back.row;
		   	cColumn = back.column;	   	
			}

			if(cRow == startRow && cColumn == startColumn) {
				isDone = true;
			}
								
			drawMapMatrix(mazeCanvas, mazeContext, mapMatrix, MAZE_SIZE, MAZE_COLOR);
			lastCoord = moves[moves.length - 1];
			drawRectangle(mazeContext, lastCoord.column * MAZE_SIZE, lastCoord.row * MAZE_SIZE, MAZE_SIZE, MAZE_LAST_GRID_COLOR);

		}

		if(isDone)
			drawRectangle(mazeContext, 1 * MAZE_SIZE, 1 * MAZE_SIZE, MAZE_SIZE, MAZE_LAST_GRID_COLOR);

 	}, ANIMATED_SPEED);
 	
}

//draws -----------------------------------------------------------------------
function drawMapMatrix(canvas, canvasContext, mapMatrix, mazeSize, color) {	
	let row = mapMatrix.length;
	let column = mapMatrix[0].length;
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	canvasContext.fillStyle = MAP_BACKGROUND_COLOR;
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	for(let y = 0; y != row; y++) {		
		for(let x = 0; x != column; x++) {			
			if(mapMatrix[y][x] == MAP_MAZE_GRID) {
				drawRectangle(mazeContext, x * mazeSize, y * mazeSize, mazeSize, color);
			}
		}
	}
}

function drawRectangle(canvasContext, x, y, size, color) {
	canvasContext.fillStyle = color;
	canvasContext.fillRect(x, y, size, size);
}