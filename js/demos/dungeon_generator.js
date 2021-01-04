//dungeon generator
//27/05/2019 axtros@gmail.com

var MAP_BACKGROUND_COLOR = '#000000';

var MAZE_SIZE = 10;					//ekkor a mérete pixelben egy térkép egységnek
var MAP_EMPTY_GRID = 0;
var MAP_MAZE_GRID = 1;
var MAP_ROOM_GRID = 2;
var MAP_DOOR_GRID = 3;
var MAP_LONLEY_GRID = 5;
var MAP_MAZE_POSSIBLE_START_GRID = 6;
var MAP_EMPTY_COLOR = '#000000';
var MAP_MAZE_COLOR = '#bdb8ae';
var MAP_ROOM_COLOR = '#b7a561'; // '#669cff';
var MAP_DOOR_COLOR = '#e2a012';
var MAP_LONLEY_COLOR = '#ffff00';
var MAP_GENERATED_START_COLOR = 'green';

var mazeCanvas;
var mazeContext;

var mapMatrix = new Array();

var Cord = {
	row: 0,
	column: 0
}

var Room = {
	roomRow: 0,
	roomColumn: 0,
	roomWidth: 0,
	roomHeight: 0
}

var mapRooms = new Array();

function init_dungeon_generator() {
	initCanvases();	
	//initMapMatrix(mazeCanvas.height / MAZE_SIZE, mazeCanvas.width / MAZE_SIZE);	 	 
	
	generateDungeon(mazeCanvas.height / MAZE_SIZE, mazeCanvas.width / MAZE_SIZE, 3, 9, 3, 9, 100);

	drawMapMatrix(mazeCanvas, mazeContext, mapMatrix, MAZE_SIZE, false);
}

function initCanvases() {
	mazeCanvas = document.getElementById("maze-canvas-id");
	mazeContext = mazeCanvas.getContext("2d");
	mazeContext.scale(1, 1);

	let mazeCanvasPos = mazeCanvas.getBoundingClientRect();
	mazeContext.fillStyle = MAP_BACKGROUND_COLOR;
	mazeContext.fillRect(0, 0, mazeCanvas.width, mazeCanvas.height);
}

function generateDungeon(mapRow, mapColumn, roomMinWidth, roomMaxWidth, roomMinHeight, roomMaxHeight, attemptsNum) {

	//1. térkép mátrix inicializálása (20x20-as a legkissebb)
	if(mapRow < 21) {
		mapRow = 21;		
	}
	if(mapColumn < 21) {
		mapColumn = 21;
	}
	initMapMatrix(mapRow, mapColumn);

	//2. room generator
	if(attemptsNum == 0) {	//egy szobának minimum kell lennie, különben az eredmény nem dungeon lesz, hanem perfect maze
		attemptsNum = 1;
	}
	while(mapRooms.length == 0) {
		roomGenerator(mapMatrix, roomMinWidth, roomMinHeight, roomMaxWidth, roomMaxHeight, attemptsNum);
	}

	//3. maze generator
	let isDone = false;
	while (!isDone) {
		let possibleCoords = searchNewMazeStartTiles(mapMatrix, MAP_EMPTY_GRID);
	 	if(possibleCoords.length == 0) {
	 		isDone = true;
	 		continue;
 		}
 		let newStartCoord = possibleCoords[generateRandomNumber(0, possibleCoords.length - 1)];	 
	 	mazeGenerator(mapMatrix, newStartCoord.row, newStartCoord.column);	 	
	 }
	 
	 //4. roomdoor search and select
	 searchRoomDoorGrids(mapMatrix, mapRooms);
	 selectRandomRoomDoorAllSide(mapMatrix, mapRooms);
	 
	 //5. delete endpassangers (or death) tile (minden olyan maze grid-et töröl, amely 3 üres grid-el van körülvéve)
	 deleteEndPassangerGrids(mapMatrix, MAP_MAZE_GRID, MAP_EMPTY_GRID, 3);

	 //6. kitölri a map-ról az esetlegesen fentmaradt olyan ajtókat, amelyek magukban állnak, és nem vezetnek sehová (ilyen lehet, ha egy magában álló maze minden eleme vissza lett törölve)
	 deletedFakeTargetGrid(mapMatrix, MAP_DOOR_GRID, MAP_EMPTY_GRID, 3);
	 //7. kitölri a map-ról az esetlegesen fentmaradt magányos maze grid-eket
	 deletedFakeTargetGrid(mapMatrix, MAP_MAZE_GRID, MAP_EMPTY_GRID, 4);
	 
	 return mapMatrix;
}

function initMapMatrix(row, column) {
	for(let i = 0; i != row; i++) {
		mapMatrix[i] = new Array();
		for(let j = 0; j != column; j++) {
			mapMatrix[i][j] = MAP_EMPTY_GRID;
		}
	}	
}

//room generator --------------------------------------------------------------
//roomMinWidth, roomMinHeight, roomMaxWidth, roomMaxHeight only odd number!
function roomGenerator(mapMatrix, roomMinWidth, roomMinHeight, roomMaxWidth, roomMaxHeight, attemptsNum) {	
	if(attemptsNum < 1 || attemptsNum > 1000) {
		attemptsNum = 100;
	}	
	let maxRow = mapMatrix.length;
	let maxColumn = mapMatrix[0].length;
	for(let i = 0; i != attemptsNum; i++) {		
		let roomRow = generateRandomOddNumber(0, maxRow);
		let roomColumn = generateRandomOddNumber(0, maxColumn);
		let roomWidth = generateRandomOddNumber(roomMinWidth, roomMaxWidth);
		let roomHeight = generateRandomOddNumber(roomMinHeight, roomMaxHeight);
		let isReserved = false;
		if((roomRow + roomHeight < maxRow) && (roomColumn + roomWidth < maxColumn)) {
			for(let i = roomRow; i != roomRow + roomHeight; i++) {			
				for(let j = roomColumn; j != roomColumn + roomWidth; j++) {
					if(mapMatrix[i][j] != MAP_EMPTY_GRID) {
						isReserved = true;
						break;
					}
				}
			}
			if(!isReserved)	{	//szoba lehelyezése a map-re, és a későbbi door kiválasztáshoz egy kollekcióba helyezi a legenerált room-okat
				let room = Object.create(Room);
				room.roomRow = roomRow;
				room.roomColumn = roomColumn;
				room.roomWidth = roomWidth;
				room.roomHeight = roomHeight;
				mapRooms.push(room);
				for(let i = roomRow; i != roomRow + roomHeight; i++) {			
					for(let j = roomColumn; j != roomColumn + roomWidth; j++) {						
						mapMatrix[i][j] = MAP_ROOM_GRID;							
					}
				}				
			}
			//console.log('room roomRow: ' + roomRow + ' roomColumn: ' + roomColumn + ' roomWidth:' + roomWidth + ' roomHeight: ' + roomHeight);
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

//search new maze generator start grid ----------------------------------------
function searchNewMazeStartTiles(mapMatrix, gridType) {	
	let tileCoords = new Array();
	for(let row = 0; row != mapMatrix.length; row++) {		
		for(let column = 0; column != mapMatrix[0].length; column++) {
			if(isNewMazeTile(mapMatrix, row, column, gridType)) {				
				let sCord = Object.create(Cord);
				sCord.row = row;
				sCord.column = column;
				tileCoords.push(sCord);
				mapMatrix[row][column] = MAP_MAZE_POSSIBLE_START_GRID;	//ideiglenes be kell írni a map-be, mert akkor ezeket a mezőket a következő vizsgálatkor már nem tekinti üresnek
				//console.log('sCord.row: ' + sCord.row + ' sCord.column: ' + sCord.column);
			}
		}			
	}
	//visszaírjuk az ideiglenes MAP_MAZE_POSSIBLE_START_GRID-eket MAP_EMPTY_GRID-re
	for(let row = 0; row != mapMatrix.length; row++) {
		for(let column = 0; column != mapMatrix[0].length; column++) {
			if(mapMatrix[row][column] == MAP_MAZE_POSSIBLE_START_GRID) {
				mapMatrix[row][column] = MAP_EMPTY_GRID;	
			}
		}
	}	
	return tileCoords;
}

function isNewMazeTile(mapMatrix, row, column, gridType) {
	if(mapMatrix[row][column] != gridType) {
		return;
	}
	let gridTypeCounter = 0;
	if(row > 0 && mapMatrix[row - 1][column] == gridType) {	//up
		gridTypeCounter++;
	}
	if(row < mapMatrix.length - 1 && mapMatrix[row + 1][column] == gridType) {	//down
		gridTypeCounter++;
	}
	if(column > 0 && mapMatrix[row][column - 1] == gridType) {	//left
		gridTypeCounter++;
	}
	if(row < mapMatrix[0].length - 1 && mapMatrix[row][column + 1] == gridType) {	//right
		gridTypeCounter++;
	}	
	if(row > 0 && column - 1 >= 0 && mapMatrix[row - 1][column - 1] == gridType) {	//top-left
		gridTypeCounter++;
	}
	if(row > 0 && column + 1 <= mapMatrix[0].length && mapMatrix[row - 1][column + 1] == gridType) {	//top-right
		gridTypeCounter++;
	}

	if(row + 1 < mapMatrix.length && column - 1 >= 0 && mapMatrix[row + 1][column - 1] == gridType) {	//bottom-left
		gridTypeCounter++;
	}
	if(row + 1 < mapMatrix.length && column + 1 <= mapMatrix[0].length && mapMatrix[row + 1][column + 1] == gridType) {	//bottom-right
		gridTypeCounter++;
	}
	return gridTypeCounter == 8;
}

//door search -----------------------------------------------------------------
function searchRoomDoorGrids(mapMatrix, mapRooms) {
	let topDoors = new Array();
	let bottomDoors = new Array();
	let leftSideDoors = new Array();
	let rightSideDoors = new Array();
	for(let i = 0; i != mapRooms.length; i++) {
		topDoors = [];
		bottomDoors = [];
		leftSideDoors = [];
		rightSideDoors = [];
		let room = mapRooms[i];
		//felső oldal
		for(let column = 0; column != room.roomWidth; column++) {
			if(isDoorGrid(mapMatrix, room.roomRow, room.roomColumn + column, 'top')) {				
				addDoor(topDoors, room.roomRow - 1, room.roomColumn + column);
				//coord = topDoors[topDoors.length - 1];
				//mapMatrix[coord.row][coord.column] = MAP_DOOR_GRID;
			}
		}
		//alsó oldal
		for(let column = 0; column != room.roomWidth; column++) {
			if(isDoorGrid(mapMatrix, room.roomRow + room.roomHeight, room.roomColumn + column, 'bottom')) {
				addDoor(bottomDoors, room.roomRow + room.roomHeight, room.roomColumn + column);
				//coord = bottomDoors[bottomDoors.length - 1];
				//mapMatrix[coord.row][coord.column] = MAP_DOOR_GRID;	
			}
		}
		//bal oldal
		for(let row = 0; row != room.roomHeight; row++) {
			if(isDoorGrid(mapMatrix, room.roomRow + row, room.roomColumn, 'left')) {
				addDoor(leftSideDoors, room.roomRow + row, room.roomColumn - 1);
				//coord = leftSideDoors[leftSideDoors.length - 1];
				//mapMatrix[coord.row][coord.column] = MAP_DOOR_GRID;	
			}
		}
		//jobb oldal
		for(let row = 0; row != room.roomHeight; row++) {
			if(isDoorGrid(mapMatrix, room.roomRow + row, room.roomColumn + room.roomWidth, 'right')) {
				addDoor(rightSideDoors, room.roomRow + row, room.roomColumn + room.roomWidth);
				//coord = rightSideDoors[rightSideDoors.length - 1];
				//mapMatrix[coord.row][coord.column] = MAP_DOOR_GRID;					
			}
		}
		room.topDoors = topDoors;
		room.bottomDoors = bottomDoors;
		room.leftSideDoors = leftSideDoors;
		room.rightSideDoors = rightSideDoors;		
	}
}

function isDoorGrid(mapMatrix, row, column, side) {
	switch(side) {
		case 'top': 
			if(row - 2 > 0 && (mapMatrix[row - 2][column] == MAP_MAZE_GRID || mapMatrix[row - 2][column] == MAP_ROOM_GRID))
				return true;
		break;
		case 'bottom': 
			if(row + 1 < mapMatrix.length && (mapMatrix[row + 1][column] == MAP_MAZE_GRID || mapMatrix[row + 1][column] == MAP_ROOM_GRID))
				return true;
		break;
		case 'left': 
			if(column - 2 > 0 && (mapMatrix[row][column - 2] == MAP_MAZE_GRID || mapMatrix[row][column - 2] == MAP_ROOM_GRID))
				return true;
		break;
		case 'right': 
			if(column + 2 < mapMatrix[0].length && (mapMatrix[row][column + 1] == MAP_MAZE_GRID || mapMatrix[row][column + 1] == MAP_ROOM_GRID))
				return true;
		break;
	}
	return false;
}

function addDoor(array, row, column) {
	let doorCoord = Object.create(Cord);
	doorCoord.row = row;
	doorCoord.column = column;
	array.push(doorCoord);
}

//door select strategy --------------------------------------------------------
//minden teremhez, minden oldalára egy ajtót próbál véletlenszerüen találni
function selectRandomRoomDoorAllSide(mapMatrix, mapRooms) {
	for(let i = 0; i != mapRooms.length; i++) {
		let room = mapRooms[i];
		let selectedCoord;
		if(room.topDoors.length > 0) {
			selectedCoord = room.topDoors[generateRandomNumber(0, room.topDoors.length - 1)];
			mapMatrix[selectedCoord.row][selectedCoord.column] = MAP_DOOR_GRID;		
		}
		if(room.bottomDoors.length > 0) {
			selectedCoord = room.bottomDoors[generateRandomNumber(0, room.bottomDoors.length - 1)];
			mapMatrix[selectedCoord.row][selectedCoord.column] = MAP_DOOR_GRID;		
		}		
		if(room.leftSideDoors.length > 0) {
			selectedCoord = room.leftSideDoors[generateRandomNumber(0, room.leftSideDoors.length - 1)];
			mapMatrix[selectedCoord.row][selectedCoord.column] = MAP_DOOR_GRID;		
		}		
		if(room.rightSideDoors.length > 0) {
			selectedCoord = room.rightSideDoors[generateRandomNumber(0, room.rightSideDoors.length - 1)];
			mapMatrix[selectedCoord.row][selectedCoord.column] = MAP_DOOR_GRID;		
		}	
	}
}

function deletedFakeTargetGrid(mapMatrix, sourceGridType, targetGridType, sorroundCount) {
	searchAndDeleteTargetGrid(mapMatrix, sourceGridType, targetGridType, sorroundCount);	
}

//end passanger and door grids deleted ----------------------------------------
function deleteEndPassangerGrids(mapMatrix, sourceGridType, targetGridType, sorroundCount) {
	let deletedAllEndPassangerTile = false;
	while(!deletedAllEndPassangerTile) {	
		if(!searchAndDeleteTargetGrid(mapMatrix, sourceGridType, targetGridType, sorroundCount)) {
			deletedAllEndPassangerTile = true;			
		}
	}
}

function searchAndDeleteTargetGrid(mapMatrix, sourceGridType, targetGridType, sorroundCount) {
	let deleted = false;
	for(let row = 0; row != mapMatrix.length; row++) {		
		for(let column = 0; column != mapMatrix[0].length; column++) {			
			if(isDeletedTile(mapMatrix, row, column, sourceGridType, targetGridType, sorroundCount)) {				
				mapMatrix[row][column] = MAP_EMPTY_GRID;
				deleted = true;
			}
		}
	}	
	return deleted;
}

function isDeletedTile(mapMatrix, row, column, sourceGridType, targetGridType, sorroundCount) {	
	if(mapMatrix[row][column] != sourceGridType) {
		return null;
	}
	let gridTypeCounter = 0;
	if(row > 0 && mapMatrix[row - 1][column] == targetGridType) {
		gridTypeCounter++;
	}
	if(row < mapMatrix.length - 1 && mapMatrix[row + 1][column] == targetGridType) {
		gridTypeCounter++;
	}
	if(column > 0 && mapMatrix[row][column - 1] == targetGridType) {
		gridTypeCounter++;
	}
	if(row < mapMatrix[0].length - 1 && mapMatrix[row][column + 1] == targetGridType) {
		gridTypeCounter++;
	}
	return gridTypeCounter == sorroundCount;
}

//draws -----------------------------------------------------------------------
function drawMapMatrix(canvas, canvasContext, mapMatrix, mazeSize, isOneColor) {	
	let row = mapMatrix.length;
	let column = mapMatrix[0].length;
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	canvasContext.fillStyle = MAP_BACKGROUND_COLOR;
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	for(let y = 0; y != row; y++) {		
		for(let x = 0; x != column; x++) {
			let mazeColor = '';
			if(mapMatrix[y][x] == MAP_MAZE_GRID) {
				mazeColor = MAP_MAZE_COLOR;
			} else if(mapMatrix[y][x] == MAP_ROOM_GRID) {
				mazeColor = MAP_ROOM_COLOR;
			} else if(mapMatrix[y][x] == MAP_LONLEY_GRID) {
				mazeColor = MAP_LONLEY_COLOR;
			} else if(mapMatrix[y][x] == MAP_DOOR_GRID) {
				mazeColor = MAP_DOOR_COLOR;
			} else if(mapMatrix[y][x] == MAP_MAZE_POSSIBLE_START_GRID) {
				mazeColor = MAP_GENERATED_START_COLOR;
			}	else {
				mazeColor = MAP_EMPTY_COLOR;
			}
			if(mazeColor != MAP_EMPTY_COLOR && isOneColor) {
				mazeColor = '#bdb8ae';
			}
			drawRectangle(canvasContext, x * mazeSize, y * mazeSize, mazeSize, mazeColor);
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