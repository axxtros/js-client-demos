//perfect maze generator
//22/05/2019 axtros@gmail.com

var MAP_BACKGROUND_COLOR = '#cccccc';

var MAP_EMPTY_GRID = 0;
var MAP_MAZE_GRID = 1;
var MAP_ROOM_GRID = 2;
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

function init_maze_generator() {
	 initCanvases();	
	 initMapMatrix(mazeCanvas.height / MAZE_SIZE, mazeCanvas.width / MAZE_SIZE);	 	
	 mazeGenerator(mapMatrix, 1, 1);
	 drawMapMatrix(mazeCanvas, mazeContext, mapMatrix, MAZE_SIZE, MAZE_COLOR);
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

//maze generator --------------------------------------------------------------
function mazeGenerator(mapMatrix, startRow, startColumn) {
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

	while(!isDone) {		

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
	}

}

function isDeletedTile(mapMatrix, row, column) {
	if(mapMatrix[row][column] == MAP_EMPTY_GRID) {
		return;
	}
	let emptyCounter = 0;
	if(row > 0 && mapMatrix[row - 1][column] == MAP_EMPTY_GRID) {
		emptyCounter++;
	}
	if(row < mapMatrix.length - 1 && mapMatrix[row + 1][column] == MAP_EMPTY_GRID) {
		emptyCounter++;
	}
	if(column > 0 && mapMatrix[row][column - 1] == MAP_EMPTY_GRID) {
		emptyCounter++;
	}
	if(row < mapMatrix[0].length - 1 && mapMatrix[row][column + 1] == MAP_EMPTY_GRID) {
		emptyCounter++;
	}
	return emptyCounter == 3;
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
			} else if(mapMatrix[y][x] == MAP_ROOM_GRID) {
				drawRectangle(mazeContext, x * mazeSize, y * mazeSize, mazeSize, 'blue');
			}
		}
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

function drawRectangle(canvasContext, x, y, size, color) {
	canvasContext.fillStyle = color;
	canvasContext.fillRect(x, y, size, size);
}