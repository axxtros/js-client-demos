//pathfind.js
//A* pathfind algorithm

var ENABLED_VERTICAL_MOVE = true;

var MAZE_SIZE = 20;

var SQUARE_COST = 10;		//normál lépées költsége
var DIAGONAL_COST = 14;	//átlós lépés költsége

var MAP_START_TILE = 1;
var MAP_END_TILE = 2;
var MAP_WALL_TILE = 3;
var MAP_PATH_EMPTY_TILE = 4;
var MAP_PATH_OPEN_TILE = 5;
var MAP_PATH_CLOSE_TILE = 6;

var mapCanvas;
var mapContext;

var mapMatrix = new Array();

var Tile = {
	row: 0,
	column: 0,
	type: 0,
	parent: Tile,
	cost: 0,
	g: 0,
	h: 0,
	f: (this.g + this.h)
}

var openTileList = new Array();		
var closeTileList = new Array();
var isGoalTile = false;
var isNotPossiblePath = false;
var path = new Array();

function init_pathfind() {
	initCanvas();
	initMap();
}

function initCanvas() {
	mapCanvas = document.getElementById("map-canvas-id");
	mapContext = mapCanvas.getContext("2d");
	mapContext.scale(1, 1);
}

function initMap() {	
	initMapMatrix(8, 8);

	// startRow = 2;
	// startColumn = 1;
	// endRow = 4;
	// endColumn = 4;

	startRow = 7;
	startColumn = 0;
	endRow = 7;
	endColumn = 5;
	
	mapMatrix[0][4] = MAP_WALL_TILE;	
	//mapMatrix[1][3] = MAP_WALL_TILE;
	
	mapMatrix[2][1] = MAP_WALL_TILE;
	mapMatrix[1][2] = MAP_WALL_TILE;
	mapMatrix[2][2] = MAP_WALL_TILE;
	mapMatrix[2][3] = MAP_WALL_TILE;

	mapMatrix[2][4] = MAP_WALL_TILE;
	mapMatrix[3][4] = MAP_WALL_TILE;

	mapMatrix[4][3] = MAP_WALL_TILE;
	mapMatrix[4][2] = MAP_WALL_TILE;
	mapMatrix[4][1] = MAP_WALL_TILE;
	
	mapMatrix[4][4] = MAP_WALL_TILE;
	mapMatrix[4][5] = MAP_WALL_TILE;
	mapMatrix[4][6] = MAP_WALL_TILE;

	mapMatrix[5][4] = MAP_WALL_TILE;
	mapMatrix[6][4] = MAP_WALL_TILE;
	mapMatrix[7][4] = MAP_WALL_TILE;
	
	searchPathWithAStar(mapMatrix, startRow, startColumn, endRow, endColumn);

	for(let i = 0; i != path.length; i++) {
		let tile = path[i];
		mapMatrix[tile.row][tile.column] = MAP_PATH_CLOSE_TILE;
	}

	mapMatrix[startRow][startColumn] = MAP_START_TILE;
	mapMatrix[endRow][endColumn] = MAP_END_TILE;

	drawMapMatrix(mapCanvas, mapContext, mapMatrix, MAZE_SIZE, false);
}

function initMapMatrix(row, column) {
	for(let i = 0; i != row; i++) {
		mapMatrix[i] = new Array();
		for(let j = 0; j != column; j++) {
			mapMatrix[i][j] = MAP_PATH_EMPTY_TILE;
		}
	}	
}

//A* pathfind -----------------------------------------------------------------

//https://www.youtube.com/watch?v=C0qCR18gXdU
//http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
function searchPathWithAStar(mapMatrix, fromRow, fromColumn, toRow, toColumn) {
	if(mapMatrix === 'undefinded' || mapMatrix.length == 0 || mapMatrix[0].length == 0 || (fromRow == toRow && fromColumn == toColumn))
		return;

	let startTile = Object.create(Tile);
	startTile.row = fromRow;
	startTile.column = fromColumn;
	startTile.parent = null;
	startTile.f = 0;
	startTile.g = 0;
	startTile.h = 0;
	closeTileList.push(startTile);	

	let goalTile = Object.create(Tile);
	goalTile.row = toRow;
	goalTile.column = toColumn;
	goalTile.parent = null;
	goalTile.f = 0;
	goalTile.g = 0;
	goalTile.h = 0;

		
	let sourceTile = startTile;	
	isNotPossiblePath = false;
	// let index = 0;
	while(!isGoalTile) {								
		if(sourceTile != null) {
			sourceTile = searchTiles(sourceTile, goalTile);
			
			// mapMatrix[sourceTile.row][sourceTile.column] = MAP_PATH_CLOSE_TILE;
			// drawMapMatrix(mapCanvas, mapContext, mapMatrix, MAZE_SIZE, false);

		} else {
			isGoalTile = true;
			isNotPossiblePath = true;
		}

		// ++index;
		// if(isGoalTile || index == 10) {
		// 	isDone = true;
		// }

	}

	if(!isNotPossiblePath && closeTileList.length > 0) {
		let reversePath = new Array();
		reversePath.push(goalTile);
		let tile = closeTileList[closeTileList.length - 1];
		while(tile.parent != null) {			
			reversePath.push(tile);
			tile = tile.parent;			
		}
		reversePath.push(startTile);

		for(let i = reversePath.length - 1; i != 0; i--) {
			path.push(reversePath[i]);
		}
		path.push(goalTile);
	}
	
	if(isNotPossiblePath) {
		console.log('No possible path!');
	}

}

function searchTiles(parentTile, goalTile) {
	let tile = null;	
	let possibleTileList = new Array();
	//bal-felső
	if(ENABLED_VERTICAL_MOVE && parentTile.row > 0 && parentTile.column > 0) {		
		tile = createAndCalcTile(parentTile.row - 1, parentTile.column - 1, parentTile, goalTile, true);
		addPossibleTile(tile, possibleTileList, goalTile);		
		if(isGoalTile) return;
	}
	//felső
	if(parentTile.row > 0) {		
		tile = createAndCalcTile(parentTile.row - 1, parentTile.column, parentTile, goalTile, false);
		addPossibleTile(tile, possibleTileList, goalTile);		
		if(isGoalTile) return;
	}
	//jobb-felső
	if(ENABLED_VERTICAL_MOVE && parentTile.row > 0 && parentTile.column + 1 <= mapMatrix[0].length) {
		tile = createAndCalcTile(parentTile.row - 1, parentTile.column + 1, parentTile, goalTile, true);
		addPossibleTile(tile, possibleTileList, goalTile);		
		if(isGoalTile) return;
	}
	//jobb
	if(parentTile.column + 1 <= mapMatrix[0].length) {
		tile = createAndCalcTile(parentTile.row, parentTile.column + 1, parentTile, goalTile, false);
		addPossibleTile(tile, possibleTileList, goalTile);		
		if(isGoalTile) return;
	}
	//jobb-alsó
	if(ENABLED_VERTICAL_MOVE && parentTile.row + 1 < mapMatrix.length && parentTile.column + 1 < mapMatrix[0].length) {
		tile = createAndCalcTile(parentTile.row + 1, parentTile.column + 1, parentTile, goalTile, true);
		addPossibleTile(tile, possibleTileList, goalTile);		
		if(isGoalTile) return;
	}		
	//alsó
	if(parentTile.row + 1 < mapMatrix.length) {		
		tile = createAndCalcTile(parentTile.row + 1, parentTile.column, parentTile, goalTile, false);
		addPossibleTile(tile, possibleTileList, goalTile);		
		if(isGoalTile) return;
	}
	//bal-alsó
	if(ENABLED_VERTICAL_MOVE && parentTile.row + 1 < mapMatrix.length && parentTile.column > 0) {
		tile = createAndCalcTile(parentTile.row + 1, parentTile.column - 1, parentTile, goalTile, true);
		addPossibleTile(tile, possibleTileList, goalTile);		
		if(isGoalTile) return;
	}
	//bal
	if(parentTile.column > 0) {
		tile = createAndCalcTile(parentTile.row, parentTile.column - 1, parentTile, goalTile, false);
		addPossibleTile(tile, possibleTileList, goalTile);		
		if(isGoalTile) return;		
	}
	return selectedCloseTile(parentTile, possibleTileList);
}

function addPossibleTile(tile, possibleTileList, goalTile) {
	if(isTilesEqual(tile, goalTile)) {			
		isGoalTile = true;
		return;
	}
	let openTile = getTileFromList(openTileList, tile);
	if(openTile != null) {			
		tile.parent = openTile.parent;
	}
	if(isCalculatedTile(tile) && !isContainListTile(closeTileList, tile)) {
		possibleTileList.push(tile);
	}
}

function selectedCloseTile(parentTile, possibleTileList) {
	if(possibleTileList == null || possibleTileList == 'undefined' || possibleTileList.length == 0 && openTileList.length == 0) {	
		return null;			
	}
	let minTile = null;
	if(openTileList.length == 0) {
		minTile = getMinTileF(possibleTileList);
		removeTileFromList(possibleTileList, minTile);
		openTileList = openTileList.concat(possibleTileList);
		closeTileList.push(minTile);
	} else {
		
		for(let i = 0; i != possibleTileList.length; i++) {
			let possTile = possibleTileList[i];
			let openTile = getTileFromList(openTileList, possTile);
			if(openTile != null) {
				if(possTile.f < openTile.f) {
					possTile.parentTile = openTile.parentTile;
					swapTilesInList(possTile, openTile, openTileList);	
				}
			}
		}
		
		if(possibleTileList.length > 0) {
			minTile = getMinTileF(possibleTileList);
			removeTileFromList(possibleTileList, minTile);
			removeTileFromList(openTileList, minTile);		
			closeTileList.push(minTile);
		}	else {
			minTile = getMinTileF(openTileList);
			removeTileFromList(openTileList, minTile);		
			closeTileList.push(minTile);
		}	

		for(let i = 0; i != possibleTileList.length; i++) {
			let possTile = possibleTileList[i];
			if(!isContainListTile(openTileList, possTile)) {
				openTileList.push(possTile);
			}
		}

	}
	return minTile;	
}

//utils -----------------------------------------------------------------------
function createAndCalcTile(row, column, parentTile, goalTile, isDiagonal) {
	let tile = Object.create(Tile);
	tile.row = row;
	tile.column = column;
	tile.parent = parentTile;
	// tile.g = isDiagonal == true ? manhattanDiagonalDistanceCalc(tile, parentTile, parentTile.g + SQUARE_COST, parentTile.g + DIAGONAL_COST) : manhattanDistanceCalc(tile, parentTile, parentTile.g + SQUARE_COST);
	// tile.h = manhattanDistanceCalc(tile, goalTile, SQUARE_COST);
	tile.g = isDiagonal == true ? manhattanDiagonalDistanceCalc(tile, parentTile, parentTile.g + SQUARE_COST, parentTile.g + DIAGONAL_COST) : euclidianDistance(tile, parentTile, parentTile.g + SQUARE_COST);
	tile.h = euclidianDistance(tile, goalTile, SQUARE_COST);
	tile.f = (tile.g + tile.h);
	return tile;
}

function manhattanDistanceCalc(currentTile, goalTile, costSquareMove) {		//The standard heuristic for a square grid. (http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html)
	dx = Math.abs(currentTile.column - goalTile.column);
  dy = Math.abs(currentTile.row - goalTile.row);
  return costSquareMove * (dx + dy);
}

function manhattanDiagonalDistanceCalc(currentTile, goalTile, costSquareMove, costDiagonalMove) {		//If your map allows diagonal movement you need a different heuristic. (http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html)
	dx = Math.abs(currentTile.column - goalTile.column);
  dy = Math.abs(currentTile.row - goalTile.row);
  return costSquareMove * (dx + dy) + (costDiagonalMove - 2 * costSquareMove) * Math.min(dx, dy);
}

function euclidianDistance(currentTile, goalTile, costSquareMove) {
	dx = Math.abs(currentTile.column - goalTile.column);
	dy = Math.abs(currentTile.row - goalTile.row);
	return costSquareMove * Math.sqrt(dx * dx + dy * dy);
}

function getMinTileF(tileList) {
	let minTile = null;
	if(tileList != null && tileList != 'undefined' && tileList.length > 0) {
		minTile = tileList[0];
		for(let i = 1; i != tileList.length; i++) {
			if(minTile.f > tileList[i].f) {
				minTile = tileList[i];
			}
		}		
	}
	return minTile;
}

function swapTilesInList(newTile, oldTile, tileList) {
	if(tileList == null || tileList == 'undefined' || tileList.length == 0) {
		return null;
	}
	for(let i = 0; i != tileList.length; i++) {
		if(isTilesEqual(tileList[i], oldTile)) {
			tileList.splice(i, i);
			tileList.splice(i, 0, newTile);
			return;
		}
	}
	return;
}

function removeTileFromList(tileList, removedTile) {
	if(tileList == null || tileList == 'undefined' || tileList.length == 0) {
		return;
	}
	for(let i = 0; i != tileList.length; i++) {
		if(isTilesEqual(tileList[i], removedTile)) {
			tileList.splice(i, 1);
			return;
		}
	}
}

function getTileFromList(tileList, searchedTile) {
	if(tileList == null || tileList == 'undefined' || tileList.length == 0) {
		return null;
	}
	for(let i = 0; i != tileList.length; i++) {
		if(isTilesEqual(tileList[i], searchedTile)) {
			return tileList[i];
		}
	}
	return null;
}

function isContainListTile(tileList, tile) {
	if(tileList == null || tileList == 'undefined' || tileList.length == 0) {
		return false;
	}
	for(let i = 0; i != tileList.length; i++) {
		if(isTilesEqual(tileList[i], tile)) {
			return true;
		}
	}
	return false;
}

function isTilesEqual(tile1, tile2) {
	return tile1.row == tile2.row && tile1.column == tile2.column;
}

function isCalculatedTile(tile) {
	return isTileEmpty(tile); /*|| isTileOpen(tile); */
}

function isStartTile(tile) {
	return mapMatrix[tile.row][tile.column] == MAP_START_TILE;
}

function isGoalTile(tile) {
	return mapMatrix[tile.row][tile.column] == MAP_END_TILE;
}

function isTileEmpty(tile) {
	return mapMatrix[tile.row][tile.column] == MAP_PATH_EMPTY_TILE;
}

function isTileOpen(tile) {
	return mapMatrix[tile.row][tile.column] == MAP_PATH_OPEN_TILE;
}

/*
// function isTileClose(tile) {
// 	return mapMatrix[tile.row][tile.column] == MAP_PATH_CINDX( 	 �E             (   x  �       ~                     �B     � �     �B     xZ�X/��%�T^/��
X`/��%�T^/�                       .M a r v e l s . A g e n t . C a r t e r . S 0 1 . B D R I P . x 2 6 4 . H u n - K r i s s z ��B     � �     �B     BHF�X/�j�w�^/�j�w�^/�j�w�^/�                       .M a r v e l s . A g e n t . C a r t e r . S 0 2 . B D R I P . x 2 6 4 . H u n - K r i s s z   �B     p Z     �B     xZ�X/��%�T^/��
X`/��%�T^/�                       M A R V E L  1 . H U N t F i �B     p Z     �B     BHF�X/�j�w�^/�j�w�^/�j�w�^/�                       M A R V E L ~ 2 . H U N t F i �B     � �     �B     0\[/��"y�[/���/^/��ĩ/^/� `     �X             ~ u T o r r e n t P a r t F i l e _ 1 3 4 C 5 8 5 8 6 . d a t �B     p Z     �B     0\[/��"y�[/���/^/��ĩ/^/� `     �X             ~ U T O R R ~ 1 . D A T                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
*/