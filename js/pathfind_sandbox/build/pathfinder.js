"use strict";
var main;
var Main = (function () {
    function Main() {
        this.headerDiv = document.getElementById('header-wrapper-id');
        this.footerDiv = document.getElementById('footer-wrapper-id');
        this.canvasWrapper = document.getElementById('canvas-wrapper-div');
        this.init();
    }
    Main.prototype.init = function () {
        var tileNumberHorizontal = Math.floor((window.innerWidth - Constains.MAP_LEFT_COORD) / Constains.MAP_TILE_SIZE) - 2;
        var tileNumberVertical = Math.floor((window.innerHeight - Constains.MAP_TOP_COORD) / Constains.MAP_TILE_SIZE) - 3;
        var canvasWrapperDivWidth = (tileNumberHorizontal * Constains.MAP_TILE_SIZE) + Constains.MAP_LEFT_COORD;
        var canvasWrapperDivHeight = (tileNumberVertical * Constains.MAP_TILE_SIZE) + Constains.MAP_TOP_COORD;
        this.headerDiv.setAttribute("style", "width: " + canvasWrapperDivWidth + "px");
        this.footerDiv.setAttribute("style", "width: " + canvasWrapperDivWidth + "px");
        this.canvasWrapper.setAttribute("style", "width: " + canvasWrapperDivWidth + "px");
        this.canvasWrapper.setAttribute("style", "height: " + canvasWrapperDivHeight + "px");
        this.canvas = document.getElementById('pathfind-sandbox-canvas-id');
        this.canvas.width = canvasWrapperDivWidth;
        this.canvas.height = canvasWrapperDivHeight;
        this.context = this.canvas.getContext('2d');
        this.context.scale(1, 1);
        this.mapControl = new MapControl(tileNumberHorizontal, tileNumberVertical);
        this.util = new Util(this.canvas, this.context, this.mapControl);
        this.draw = new Draw(this.canvas, this.context, this.mapControl, this.util);
    };
    Main.prototype.main = function () {
    };
    Main.prototype.updateWindow = function () {
    };
    Main.prototype.startAStar = function () {
        var astar = new AStar(this.draw, this.mapControl, Constains.ASTAR_ENABLED_DIAGONAL, Constains.ASTAR_COST, Constains.ASTAR_DIAGONAL_COST);
    };
    Main.prototype.printMapToConsole = function () {
        this.mapControl.printMapToConsole();
    };
    return Main;
}());
window.onload = function () {
    main = new Main();
    main.main();
};
window.onresize = function () {
    main = new Main();
    main.main();
};
window.onscroll = function () {
    main.updateWindow();
};
var Util = (function () {
    function Util(canvas, context, map) {
        this.canvas = canvas;
        this.context = context;
        this.map = map;
        this.rect = canvas.getBoundingClientRect();
        this.mouseX = 0;
        this.mouseY = 0;
        this.scrollOffsetX = 0;
        this.scrollOffsetY = 0;
        this.updateScrollOffsets(this.scrollOffsetX, this.scrollOffsetY);
    }
    Util.getRandomNumber = function (min, max) {
        return Math.floor(Math.random() * max) + min;
    };
    Util.prototype.setMouseCanvasPos = function (event) {
        this.mouseX = (event.clientX - this.rect.left) + this.scrollOffsetX;
        this.mouseY = (event.clientY - this.rect.top) + this.scrollOffsetY;
    };
    Util.prototype.getCurrentSelectedTile = function () {
        var tileX = Math.floor((this.mouseX - Constains.MAP_LEFT_COORD) / Constains.MAP_TILE_SIZE);
        var tileY = Math.floor((this.mouseY - Constains.MAP_TOP_COORD) / Constains.MAP_TILE_SIZE);
        tileX < 0 ? tileX = 0 : tileX = tileX;
        tileY < 0 ? tileY = 0 : tileY = tileY;
        return this.map.getMapTile(tileX, tileY);
    };
    Util.prototype.updateScrollOffsets = function (scrollOffsetX, scrollOffsetY) {
        this.scrollOffsetX = scrollOffsetX;
        this.scrollOffsetY = scrollOffsetY;
    };
    return Util;
}());
var Draw = (function () {
    function Draw(canvas, context, mapControl, util) {
        this.canvas = canvas;
        this.context = context;
        this.mapControl = mapControl;
        this.util = util;
        this.lastSelectedTile = mapControl.getDummyMapTile();
        this.currentSelectedTile = mapControl.getDummyMapTile();
        this.isMousePressed = false;
        this.isMoveStartTile = false;
        this.isMoveEndTile = false;
        this.hiddenStartTileType = TILE_TYPE.EMPTY;
        this.hiddenEndTileType = TILE_TYPE.EMPTY;
        this.clearMap();
        this.drawMap();
    }
    Draw.prototype.clearMap = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = Constains.MAP_BACKGROUND_COLOR;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    Draw.prototype.drawMap = function () {
        this.drawMapSymbols();
        this.drawGridMap();
    };
    Draw.prototype.drawMapSymbols = function () {
        var x = Constains.MAP_LEFT_COORD + (Constains.MAP_TILE_SIZE / 2), y = Constains.MAP_TOP_COORD - Constains.MAP_SYMBOL_HORIZONTAL_DISTANCE_FROM_GRIDS;
        for (var i = 0; i != this.mapControl.getWidth(); i++) {
            this.drawMapSymbol(x, y, (i + 1) + '');
            x += Constains.MAP_TILE_SIZE;
        }
        x = Constains.MAP_LEFT_COORD - Constains.MAP_SYMBOL_VERTICAL_DISTANCE_FROM_GRIDS,
            y = Constains.MAP_TOP_COORD + (Constains.MAP_TILE_SIZE / 2) + 4;
        for (var i = 0; i != this.mapControl.getHeight(); i++) {
            this.drawMapSymbol(x, y, (i + 1) + '');
            y += Constains.MAP_TILE_SIZE;
        }
    };
    Draw.prototype.drawGridMap = function () {
        for (var mapCoordW = 0; mapCoordW != this.mapControl.getWidth(); mapCoordW++) {
            for (var mapCoordH = 0; mapCoordH != this.mapControl.getHeight(); mapCoordH++) {
                var mapTile = this.mapControl.getMapMatrix()[mapCoordW][mapCoordH];
                this.drawMapTile(mapTile);
            }
        }
    };
    Draw.prototype.mouseButtonDownEvent = function () {
        if (this.currentSelectedTile != null) {
            if (this.currentSelectedTile.getType() == TILE_TYPE.START) {
                this.isMoveStartTile = true;
            }
            if (this.currentSelectedTile.getType() == TILE_TYPE.END) {
                this.isMoveEndTile = true;
            }
            this.isMousePressed = true;
            this.clickCanvasEvent();
        }
    };
    Draw.prototype.mouseButtonUpEvent = function () {
        if (this.currentSelectedTile != null) {
            this.isMousePressed = false;
            this.isMoveStartTile = false;
            this.isMoveEndTile = false;
            this.clickCanvasEvent();
        }
    };
    Draw.prototype.mouseMoveEvent = function () {
        this.currentSelectedTile = this.getCurrentSelectedTile();
        if (this.isSwitchTile()) {
            if (this.isMousePressed) {
                this.clickCanvasEvent();
            }
            else {
                this.drawMapTile(this.lastSelectedTile);
                this.drawCursorMapTile(this.currentSelectedTile.getDrawCoord().getX(), this.currentSelectedTile.getDrawCoord().getY());
            }
            this.lastSelectedTile = this.currentSelectedTile;
        }
    };
    Draw.prototype.clickCanvasEvent = function () {
        if (this.currentSelectedTile != null) {
            if (this.isMoveStartTile && this.currentSelectedTile.getType() != TILE_TYPE.END) {
                var hiddenTile = this.mapControl.getStartTile();
                this.changeTileTypeAndDraw(hiddenTile, this.hiddenStartTileType);
                this.hiddenStartTileType = this.currentSelectedTile.getType();
                this.changeTileTypeAndDraw(this.currentSelectedTile, TILE_TYPE.START);
                this.mapControl.setStartTile(this.currentSelectedTile);
            }
            else if (this.isMoveEndTile && this.currentSelectedTile.getType() != TILE_TYPE.START) {
                var hiddenTile = this.mapControl.getEndTile();
                this.changeTileTypeAndDraw(hiddenTile, this.hiddenEndTileType);
                this.hiddenEndTileType = this.currentSelectedTile.getType();
                this.changeTileTypeAndDraw(this.currentSelectedTile, TILE_TYPE.END);
                this.mapControl.setEndTile(this.currentSelectedTile);
            }
            else {
                switch (this.currentSelectedTile.getType()) {
                    case TILE_TYPE.EMPTY:
                        this.changeTileTypeAndDraw(this.currentSelectedTile, TILE_TYPE.WALL);
                        break;
                    case TILE_TYPE.WALL:
                        this.changeTileTypeAndDraw(this.currentSelectedTile, TILE_TYPE.EMPTY);
                        break;
                }
            }
        }
    };
    Draw.prototype.changeTileTypeAndDraw = function (tile, newType) {
        this.mapControl.changeTileType(tile, newType);
        this.drawMapTile(tile);
    };
    Draw.prototype.drawMapTile = function (mapTile) {
        switch (mapTile.getType()) {
            case TILE_TYPE.EMPTY:
                this.drawEmptyMapTile(mapTile.getDrawCoord().getX(), mapTile.getDrawCoord().getY());
                break;
            case TILE_TYPE.WALL:
                this.drawWallMapTile(mapTile.getDrawCoord().getX(), mapTile.getDrawCoord().getY());
                break;
            case TILE_TYPE.START:
                this.drawStartMapTile(mapTile.getDrawCoord().getX(), mapTile.getDrawCoord().getY());
                break;
            case TILE_TYPE.END:
                this.drawEndMapTile(mapTile.getDrawCoord().getX(), mapTile.getDrawCoord().getY());
                break;
            default:
                this.drawEmptyMapTile(mapTile.getDrawCoord().getX(), mapTile.getDrawCoord().getY());
                break;
        }
    };
    Draw.prototype.drawEmptyMapTile = function (x, y) {
        this.drawBorderSquare(x, y, Constains.MAP_TILE_SIZE, Constains.MAP_EMPTY_TILE_BACKGROUND_COLOR, Constains.MAP_TILE_BORDER_COLOR, 1);
    };
    Draw.prototype.drawStartMapTile = function (x, y) {
        this.drawBorderSquare(x, y, Constains.MAP_TILE_SIZE, Constains.MAP_START_TILE_BACKGROUND_COLOR, Constains.MAP_TILE_BORDER_COLOR, 1);
    };
    Draw.prototype.drawEndMapTile = function (x, y) {
        this.drawBorderSquare(x, y, Constains.MAP_TILE_SIZE, Constains.MAP_END_TILE_BACKGROUND_COLOR, Constains.MAP_TILE_BORDER_COLOR, 1);
    };
    Draw.prototype.drawWallMapTile = function (x, y) {
        this.drawBorderSquare(x, y, Constains.MAP_TILE_SIZE, Constains.MAP_WALL_TILE_BACKGROUND_COLOR, Constains.MAP_TILE_BORDER_COLOR, 1);
    };
    Draw.prototype.drawCursorMapTile = function (x, y) {
        this.drawBorderSquare(x, y, Constains.MAP_TILE_SIZE, Constains.MAP_TILE_CURSOR_BACKGROUND_COLOR, Constains.MAP_TILE_CURSOR_BORDER_COLOR, 1);
    };
    Draw.prototype.drawNeigborTiles = function (mapTiles) {
        if (mapTiles.length > 0) {
            for (var i = 0; i != mapTiles.length; i++) {
                var drawingTile = mapTiles[i];
                this.drawBorderSquare(drawingTile.getDrawCoord().getX(), drawingTile.getDrawCoord().getY(), Constains.MAP_TILE_SIZE, Constains.NEIGHBORE_TILE_BACKGROUND_COLOR, Constains.MAP_TILE_BORDER_COLOR, 1);
            }
        }
    };
    Draw.prototype.drawMinMapTile = function (tile) {
        this.drawBorderSquare(tile.getDrawCoord().getX(), tile.getDrawCoord().getY(), Constains.MAP_TILE_SIZE, Constains.MIN_TILE_BACKGROUND_COLOR, Constains.MAP_TILE_BORDER_COLOR, 1);
    };
    Draw.prototype.drawBorderSquare = function (x, y, size, fillColor, borderColor, borderTickness) {
        this.drawBorderRectangle(x, y, size, size, fillColor, borderColor, borderTickness);
    };
    Draw.prototype.drawBorderRectangle = function (x, y, width, height, fillColor, borderColor, borderTickness) {
        this.context.fillStyle = borderColor;
        this.context.fillRect(x, y, width, height);
        this.drawFillRectangle(x + borderTickness, y + borderTickness, width - (2 * borderTickness), height - (2 * borderTickness), fillColor);
    };
    Draw.prototype.drawFillSquare = function (x, y, size, color) {
        this.drawFillRectangle(x, y, size, size, color);
    };
    Draw.prototype.drawFillRectangle = function (x, y, width, height, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    };
    Draw.prototype.drawMapSymbol = function (x, y, text) {
        this.drawText(x, y, text, Constains.MAP_SYMBOL_FONT_SIZE, Constains.MAP_SYMBOL_FONT, Constains.MAP_SYMBOL_FONT_COLOR);
    };
    Draw.prototype.drawText = function (x, y, text, fontSize, font, color) {
        this.context.font = fontSize + ' ' + font;
        this.context.fillStyle = color;
        this.context.textAlign = "center";
        this.context.fillText(text, x, y);
    };
    Draw.prototype.isSwitchTile = function () {
        return this.currentSelectedTile.getMapCoord().getX() != this.lastSelectedTile.getMapCoord().getX() || this.currentSelectedTile.getMapCoord().getY() != this.lastSelectedTile.getMapCoord().getY();
    };
    Draw.prototype.getCurrentSelectedTile = function () {
        return this.util.getCurrentSelectedTile();
    };
    return Draw;
}());
var NEIGHBOUR_TYPE;
(function (NEIGHBOUR_TYPE) {
    NEIGHBOUR_TYPE[NEIGHBOUR_TYPE["TOP"] = 1] = "TOP";
    NEIGHBOUR_TYPE[NEIGHBOUR_TYPE["TOP_RIGHT"] = 2] = "TOP_RIGHT";
    NEIGHBOUR_TYPE[NEIGHBOUR_TYPE["RIGHT"] = 3] = "RIGHT";
    NEIGHBOUR_TYPE[NEIGHBOUR_TYPE["BOTTOM_RIGHT"] = 4] = "BOTTOM_RIGHT";
    NEIGHBOUR_TYPE[NEIGHBOUR_TYPE["BOTTOM"] = 5] = "BOTTOM";
    NEIGHBOUR_TYPE[NEIGHBOUR_TYPE["BOTTOM_LEFT"] = 6] = "BOTTOM_LEFT";
    NEIGHBOUR_TYPE[NEIGHBOUR_TYPE["LEFT"] = 7] = "LEFT";
    NEIGHBOUR_TYPE[NEIGHBOUR_TYPE["TOP_LEFT"] = 8] = "TOP_LEFT";
})(NEIGHBOUR_TYPE || (NEIGHBOUR_TYPE = {}));
var MapControl = (function () {
    function MapControl(width, height) {
        this.width = width;
        this.height = height;
        this.mapMatrix = [];
        this.initMap();
        this.startTile = this.getSearchedTileByType(TILE_TYPE.START);
        this.endTile = this.getSearchedTileByType(TILE_TYPE.END);
    }
    MapControl.prototype.initMap = function () {
        var drawCoordX = Constains.MAP_LEFT_COORD, drawCoordY = Constains.MAP_TOP_COORD;
        var tileId = 1;
        for (var mapCoordW = 0; mapCoordW != this.width; mapCoordW++) {
            this.mapMatrix[mapCoordW] = [];
            for (var mapCoordH = 0; mapCoordH != this.height; mapCoordH++) {
                var mapTile = new MapTile(tileId++, new Coord(mapCoordW, mapCoordH), new Coord(drawCoordY, drawCoordX), TILE_TYPE.EMPTY);
                this.mapMatrix[mapCoordW][mapCoordH] = mapTile;
                drawCoordX += Constains.MAP_TILE_SIZE;
            }
            drawCoordX = Constains.MAP_LEFT_COORD;
            drawCoordY += Constains.MAP_TILE_SIZE;
        }
        this.initStartAndEndTiles();
    };
    MapControl.prototype.initStartAndEndTiles = function () {
        var startTileCoord = new Coord((Math.floor(this.width / 2) - Math.floor(this.width / 8)), Math.floor(this.height / 2));
        this.mapMatrix[startTileCoord.getX()][startTileCoord.getY()].setType(TILE_TYPE.START);
        var endTileCoord = new Coord((Math.floor(this.width / 2) + Math.floor(this.width / 8)), Math.floor(this.height / 2));
        this.mapMatrix[endTileCoord.getX()][endTileCoord.getY()].setType(TILE_TYPE.END);
    };
    MapControl.prototype.searchNeighbourTile = function (tile, neighbourType) {
        switch (neighbourType) {
            case NEIGHBOUR_TYPE.TOP:
                if (tile.getMapCoord().getY() <= 0) {
                    return null;
                }
                return this.getMapTile(tile.getMapCoord().getX(), tile.getMapCoord().getY() - 1);
            case NEIGHBOUR_TYPE.TOP_RIGHT:
                if (tile.getMapCoord().getX() >= this.getWidth() - 1 || tile.getMapCoord().getY() <= 0) {
                    return null;
                }
                return this.getMapTile(tile.getMapCoord().getX() + 1, tile.getMapCoord().getY() - 1);
            case NEIGHBOUR_TYPE.RIGHT:
                if (tile.getMapCoord().getX() >= this.getWidth() - 1) {
                    return null;
                }
                return this.getMapTile(tile.getMapCoord().getX() + 1, tile.getMapCoord().getY());
            case NEIGHBOUR_TYPE.BOTTOM_RIGHT:
                if (tile.getMapCoord().getX() >= this.getWidth() - 1 || tile.getMapCoord().getY() >= this.getHeight()) {
                    return null;
                }
                return this.getMapTile(tile.getMapCoord().getX() + 1, tile.getMapCoord().getY() + 1);
            case NEIGHBOUR_TYPE.BOTTOM:
                if (tile.getMapCoord().getY() >= this.getHeight()) {
                    return null;
                }
                return this.getMapTile(tile.getMapCoord().getX(), tile.getMapCoord().getY() + 1);
            case NEIGHBOUR_TYPE.BOTTOM_LEFT:
                if (tile.getMapCoord().getX() <= 0 || tile.getMapCoord().getY() >= this.getHeight()) {
                    return null;
                }
                return this.getMapTile(tile.getMapCoord().getX() - 1, tile.getMapCoord().getY() + 1);
            case NEIGHBOUR_TYPE.LEFT:
                if (tile.getMapCoord().getX() <= 0) {
                    return null;
                }
                return this.getMapTile(tile.getMapCoord().getX() - 1, tile.getMapCoord().getY());
            case NEIGHBOUR_TYPE.TOP_LEFT:
                if (tile.getMapCoord().getX() <= 0 || tile.getMapCoord().getY() <= 0) {
                    return null;
                }
                return this.getMapTile(tile.getMapCoord().getX() - 1, tile.getMapCoord().getY() - 1);
            default: return tile;
        }
    };
    MapControl.prototype.getStartTile = function () {
        return this.startTile;
    };
    MapControl.prototype.setStartTile = function (newTile) {
        this.startTile = newTile;
    };
    MapControl.prototype.getEndTile = function () {
        return this.endTile;
    };
    MapControl.prototype.setEndTile = function (newTile) {
        this.endTile = newTile;
    };
    MapControl.prototype.getSearchedStartTile = function () {
        return this.getSearchedTileByType(TILE_TYPE.START);
    };
    MapControl.prototype.getSearchedEndTile = function () {
        return this.getSearchedTileByType(TILE_TYPE.END);
    };
    MapControl.prototype.getSearchedTileByType = function (tileType) {
        if (this.mapMatrix != null) {
            for (var mapCoordW = 0; mapCoordW != this.getWidth(); mapCoordW++) {
                for (var mapCoordH = 0; mapCoordH != this.getHeight(); mapCoordH++) {
                    var mapTile = this.getMapMatrix()[mapCoordW][mapCoordH];
                    if (mapTile.getType() == tileType) {
                        return mapTile;
                    }
                }
            }
        }
        return this.getDummyMapTile();
    };
    MapControl.prototype.getWidth = function () {
        return this.width;
    };
    MapControl.prototype.getHeight = function () {
        return this.height;
    };
    MapControl.prototype.getMapMatrix = function () {
        return this.mapMatrix;
    };
    MapControl.prototype.changeTileType = function (selectedTile, tileType) {
        if (selectedTile != null) {
            this.getMapTile(selectedTile.getMapCoord().getX(), selectedTile.getMapCoord().getY()).setType(tileType);
        }
    };
    MapControl.prototype.getMapTile = function (mapCoordW, mapCoordH) {
        return this.getMapMatrix()[mapCoordW][mapCoordH];
    };
    MapControl.prototype.getDummyMapTile = function () {
        return new MapTile(0, new Coord(-1, -1), new Coord(-100, -100), TILE_TYPE.EMPTY);
    };
    MapControl.prototype.printMapToConsole = function () {
        if (this.mapMatrix != null) {
            for (var mapCoordH = 0; mapCoordH != this.getHeight(); mapCoordH++) {
                var rowTiles = "";
                for (var mapCoordW = 0; mapCoordW != this.getWidth(); mapCoordW++) {
                    var mapTile = this.getMapMatrix()[mapCoordW][mapCoordH];
                    rowTiles += mapTile.toStringLight() + '|';
                }
                console.log(rowTiles);
                console.log('--- ' + (mapCoordH + 1) + '.row ---');
            }
        }
        else {
            console.log('Map is empty!');
        }
    };
    return MapControl;
}());
var AStar = (function () {
    function AStar(draw, mapControl, isDiagonal, cost, diagonalCost) {
        this.draw = draw;
        this.mapControl = mapControl;
        this.map = mapControl.getMapMatrix();
        this.isDiagonal = isDiagonal;
        this.cost = cost;
        this.diagonalCost = diagonalCost;
        this.openList = new Array();
        this.openList.push(mapControl.getStartTile());
        this.closeList = new Array();
        this.run();
    }
    AStar.prototype.run = function () {
        var endFindPath = false;
        while (!endFindPath) {
            if (this.openList.length == 0) {
                endFindPath = true;
            }
            else {
                var currentTile = this.getMinTileF(this.openList);
                this.swapTileElement(this.openList, this.closeList, currentTile);
                var neighbourTiles = this.getNeighbourTiles(currentTile);
                for (var i = 0; i != neighbourTiles.length; i++) {
                    var neighbourTile = neighbourTiles[i];
                    if (!this.isExistTile(this.closeList, neighbourTile)) {
                        if (neighbourTile.getId() == this.mapControl.getEndTile().getId()) {
                            endFindPath = true;
                            break;
                        }
                        else if (neighbourTile.getF() < currentTile.getF()) {
                            currentTile = neighbourTile;
                        }
                    }
                }
                this.closeList.push(currentTile);
            }
        }
    };
    AStar.prototype.getNeighbourTiles = function (tile) {
        var neighbourArray = new Array();
        var neighbourTile;
        neighbourTile = this.mapControl.searchNeighbourTile(tile, NEIGHBOUR_TYPE.TOP);
        if (neighbourTile != null && this.isFreeTile(neighbourTile) && !this.isExistTile(neighbourArray, neighbourTile)) {
            neighbourArray.push(this.calcTileCosts(neighbourTile, false));
        }
        neighbourTile = this.mapControl.searchNeighbourTile(tile, NEIGHBOUR_TYPE.RIGHT);
        if (neighbourTile != null && this.isFreeTile(neighbourTile) && !this.isExistTile(neighbourArray, neighbourTile)) {
            neighbourArray.push(this.calcTileCosts(neighbourTile, false));
        }
        neighbourTile = this.mapControl.searchNeighbourTile(tile, NEIGHBOUR_TYPE.BOTTOM);
        if (neighbourTile != null && this.isFreeTile(neighbourTile) && !this.isExistTile(neighbourArray, neighbourTile)) {
            neighbourArray.push(this.calcTileCosts(neighbourTile, false));
        }
        neighbourTile = this.mapControl.searchNeighbourTile(tile, NEIGHBOUR_TYPE.LEFT);
        if (neighbourTile != null && this.isFreeTile(neighbourTile) && !this.isExistTile(neighbourArray, neighbourTile)) {
            neighbourArray.push(this.calcTileCosts(neighbourTile, false));
        }
        if (this.isDiagonal) {
            neighbourTile = this.mapControl.searchNeighbourTile(tile, NEIGHBOUR_TYPE.TOP_RIGHT);
            if (neighbourTile != null && this.isFreeTile(neighbourTile) && !this.isExistTile(neighbourArray, neighbourTile)) {
                neighbourArray.push(this.calcTileCosts(neighbourTile, true));
            }
            neighbourTile = this.mapControl.searchNeighbourTile(tile, NEIGHBOUR_TYPE.BOTTOM_RIGHT);
            if (neighbourTile != null && this.isFreeTile(neighbourTile) && !this.isExistTile(neighbourArray, neighbourTile)) {
                neighbourArray.push(this.calcTileCosts(neighbourTile, true));
            }
            neighbourTile = this.mapControl.searchNeighbourTile(tile, NEIGHBOUR_TYPE.BOTTOM_LEFT);
            if (neighbourTile != null && this.isFreeTile(neighbourTile) && !this.isExistTile(neighbourArray, neighbourTile)) {
                neighbourArray.push(this.calcTileCosts(neighbourTile, true));
            }
            neighbourTile = this.mapControl.searchNeighbourTile(tile, NEIGHBOUR_TYPE.TOP_LEFT);
            if (neighbourTile != null && this.isFreeTile(neighbourTile) && !this.isExistTile(neighbourArray, neighbourTile)) {
                neighbourArray.push(this.calcTileCosts(neighbourTile, true));
            }
        }
        if (neighbourArray.length != 0) {
            neighbourArray.forEach(function (neighbour) {
                neighbour.setPartenTileId(tile.getId());
            });
        }
        return neighbourArray;
    };
    AStar.prototype.getMinTileF = function (mapTileArray) {
        var minTile;
        if (mapTileArray.length == 1) {
            return mapTileArray[0];
        }
        else {
            minTile = mapTileArray[0];
        }
        for (var i = 1; i != mapTileArray.length; i++) {
            if (mapTileArray[i].getF() < minTile.getF()) {
                minTile = mapTileArray[i];
            }
        }
        return minTile;
    };
    AStar.prototype.swapTileElement = function (fromArray, toArray, tile) {
        this.removeElementFromTileArray(fromArray, tile);
        this.addElementToTileArray(toArray, tile);
    };
    AStar.prototype.addElementToTileArray = function (mapTileArray, tile) {
        if (!this.isExistTile(mapTileArray, tile)) {
            mapTileArray.push(tile);
        }
        return mapTileArray;
    };
    AStar.prototype.removeElementFromTileArray = function (mapTileArray, removedTile) {
        for (var i = 0; i != mapTileArray.length; i++) {
            if (mapTileArray[i].getId() == removedTile.getId()) {
                mapTileArray.splice(i, 1);
                break;
            }
        }
        return mapTileArray;
    };
    AStar.prototype.addAllToArray = function (fromArray, toArray) {
        for (var i = 0; i != fromArray.length; i++) {
            if (!this.isExistTile(toArray, fromArray[i])) {
                toArray.push(fromArray[i]);
            }
        }
    };
    AStar.prototype.isFreeTile = function (tile) {
        return tile.getType() != TILE_TYPE.START && tile.getType() != TILE_TYPE.WALL;
    };
    AStar.prototype.isExistTile = function (mapTileArray, searchedTile) {
        if (searchedTile != null) {
            return mapTileArray.filter(function (tile) { return tile.getId() == searchedTile.getId(); }).length == 1;
        }
        return false;
    };
    AStar.prototype.calcTileCosts = function (tile, isDiagonalTile) {
        tile.setG(!isDiagonalTile ? this.calcManhattanDistance(tile, this.mapControl.getStartTile(), this.cost) : this.calcDiagonalDistance(tile, this.mapControl.getStartTile(), this.cost, this.diagonalCost));
        tile.setH(!isDiagonalTile ? this.calcManhattanDistance(tile, this.mapControl.getEndTile(), this.cost) : this.calcDiagonalDistance(tile, this.mapControl.getEndTile(), this.cost, this.diagonalCost));
        return tile;
    };
    AStar.prototype.calcManhattanDistance = function (nodeTile, goalTile, cost) {
        var dx = Math.abs(nodeTile.getMapCoord().getX() - goalTile.getMapCoord().getX());
        var dy = Math.abs(nodeTile.getMapCoord().getY() - goalTile.getMapCoord().getY());
        return cost * (dx + dy);
    };
    AStar.prototype.calcDiagonalDistance = function (nodeTile, goalTile, cost, diagonalCost) {
        var dx = Math.abs(nodeTile.getMapCoord().getX() - goalTile.getMapCoord().getX());
        var dy = Math.abs(nodeTile.getMapCoord().getY() - goalTile.getMapCoord().getY());
        return cost * (dx + dy) + (diagonalCost - 2 * cost) * Math.min(dx, dy);
    };
    AStar.prototype.toConsoleTileArray = function (tileArray) {
        for (var i = 0; i != tileArray.length; i++) {
            var tile = tileArray[i];
            console.log('id: ' + tile.getId() + ' mX: ' + tile.getMapCoord().getX() + ' mY: ' + tile.getMapCoord().getY() + ' type: ' + TILE_TYPE[tile.getType()] + ' g: ' + tile.getG() + ' h: ' + tile.getH() + ' f: ' + tile.getF());
        }
    };
    return AStar;
}());
var TILE_TYPE;
(function (TILE_TYPE) {
    TILE_TYPE[TILE_TYPE["EMPTY"] = 0] = "EMPTY";
    TILE_TYPE[TILE_TYPE["WALL"] = 1] = "WALL";
    TILE_TYPE[TILE_TYPE["START"] = 2] = "START";
    TILE_TYPE[TILE_TYPE["END"] = 3] = "END";
    TILE_TYPE[TILE_TYPE["CURSOR"] = 4] = "CURSOR";
})(TILE_TYPE || (TILE_TYPE = {}));
var Coord = (function () {
    function Coord(x, y) {
        this.x = x;
        this.y = y;
    }
    Coord.prototype.getX = function () {
        return this.x;
    };
    Coord.prototype.getY = function () {
        return this.y;
    };
    return Coord;
}());
var MapTile = (function () {
    function MapTile(id, mapCoord, drawCoord, type) {
        this.id = id;
        this.mapCoord = mapCoord;
        this.drawCoord = drawCoord;
        this.type = type;
        this.f = this.g = this.h = this.parentTileId = 0;
    }
    MapTile.prototype.getId = function () {
        return this.id;
    };
    MapTile.prototype.getMapCoord = function () {
        return this.mapCoord;
    };
    MapTile.prototype.setMapCoord = function (mapCoord) {
        this.mapCoord = mapCoord;
    };
    MapTile.prototype.getDrawCoord = function () {
        return this.drawCoord;
    };
    MapTile.prototype.setDrawCoord = function (drawCoord) {
        this.drawCoord = drawCoord;
    };
    MapTile.prototype.getType = function () {
        return this.type;
    };
    MapTile.prototype.setType = function (type) {
        this.type = type;
    };
    MapTile.prototype.getF = function () {
        return this.g + this.h;
    };
    MapTile.prototype.getG = function () {
        return this.g;
    };
    MapTile.prototype.setG = function (value) {
        this.g = value;
    };
    MapTile.prototype.getH = function () {
        return this.h;
    };
    MapTile.prototype.setH = function (value) {
        this.h = value;
    };
    MapTile.prototype.getParentTileId = function () {
        return this.parentTileId;
    };
    MapTile.prototype.setPartenTileId = function (parentTileId) {
        this.parentTileId = parentTileId;
    };
    MapTile.prototype.toString = function () {
        console.log('id: ' + this.getId() + ' mX: ' + this.getMapCoord().getX() + '  mY: ' + this.getMapCoord().getY() + '  type: ' + TILE_TYPE[this.getType()]);
    };
    MapTile.prototype.toStringLight = function () {
        var typeTinyName = TILE_TYPE[this.getType()];
        typeTinyName = typeTinyName.substring(0, 1);
        return 'mX:' + this.getMapCoord().getX() + '  mY:' + this.getMapCoord().getY() + ' tp:' + typeTinyName;
    };
    return MapTile;
}());
var Constains = (function () {
    function Constains() {
    }
    Constains.MAP_HORIZONTAL_MINIMUM_TILE_NUMBER = 10;
    Constains.MAP_VERTICAL_MINIMUM_TILE_NUMBER = 10;
    Constains.MAP_HORIZONTAL_MAXIMUM_TILE_NUMBER = 300;
    Constains.MAP_VERTICAL_MAXIMUM_TILE_NUMBER = 300;
    Constains.MAP_HORIZONTAL_TILE_NUMBER = 60;
    Constains.MAP_VERTICAL_TILE_NUMBER = 28;
    Constains.MAP_TILE_SIZE = 26;
    Constains.MAP_TOP_COORD = 30;
    Constains.MAP_LEFT_COORD = 30;
    Constains.MAP_BACKGROUND_COLOR = '#fff';
    Constains.MAP_EMPTY_TILE_BACKGROUND_COLOR = '#fff7ed';
    Constains.MAP_START_TILE_BACKGROUND_COLOR = '#ff6568';
    Constains.MAP_END_TILE_BACKGROUND_COLOR = '#58f770';
    Constains.MAP_WALL_TILE_BACKGROUND_COLOR = '#c7d6f5';
    Constains.NEIGHBORE_TILE_BACKGROUND_COLOR = 'orange';
    Constains.MIN_TILE_BACKGROUND_COLOR = 'green';
    Constains.MAP_TILE_BORDER_COLOR = '#989898';
    Constains.MAP_TILE_CURSOR_BACKGROUND_COLOR = '#e4ded7';
    Constains.MAP_TILE_CURSOR_BORDER_COLOR = 'orange';
    Constains.MAP_SYMBOL_FONT = 'Consolas, monaco, monospace';
    Constains.MAP_SYMBOL_FONT_SIZE = (Constains.MAP_TILE_SIZE / 2.5) + 'px';
    Constains.MAP_SYMBOL_FONT_COLOR = '#989898';
    Constains.MAP_SYMBOL_HORIZONTAL_DISTANCE_FROM_GRIDS = 5;
    Constains.MAP_SYMBOL_VERTICAL_DISTANCE_FROM_GRIDS = 15;
    Constains.ASTAR_ENABLED_DIAGONAL = true;
    Constains.ASTAR_DISABLED_DIAGONAL = false;
    Constains.ASTAR_COST = 10;
    Constains.ASTAR_DIAGONAL_COST = 14;
    Constains.ASTAR_ERROR_MSG_MAP_IS_NULL = "ERROR: Map is null or not exists!";
    return Constains;
}());
