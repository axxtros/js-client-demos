//snake_game.js
//Classic snake game.
//06/01/2021 axtros@gmail.com

//use module pattern

//module pattern tutorial:
//https://medium.com/technofunnel/data-hiding-with-javascript-module-pattern-62b71520bddd

"use strict";

var snake = (function() {    
    
    var gameBackgroundCanvasElement;
    var gameSnakeCanvasElement;
    var dataBackgroundCanvasElement;
    var dataDisplayCanvasElement;

    var gameBackgroundContext;
    var gameSnakeContext;
    var dataBackgroundContext;
    var dataDisplayContext;

    var tileObject = {
        row: 0,
        column: 0
    };

    var targetObject = {
        pos: tileObject
    }

    var snakeObject = {
        head: tileObject,        
        bodyTiles: new Array()
    };

    var mapObject = {
        rowNum: 0,
        columnNum: 0,
        mapMatrix: new Array()
    }

    var target;
    var gameMap;

    function initCanvases() {
        dataBackgroundCanvasElement = document.getElementById('data-background-canvas');
        dataDisplayCanvasElement = document.getElementById('data-display-canvas');
        gameBackgroundCanvasElement = document.getElementById('game-background-canvas');
        gameSnakeCanvasElement = document.getElementById('game-snake-canvas');        

        if(gameBackgroundCanvasElement !== null && gameSnakeCanvasElement !== null && dataBackgroundCanvasElement !== null && dataDisplayCanvasElement !== null) {            

            //az egyes canvas-ek pontos mérete a tile méret alapján lesz kalkulálva úgy, hogy annyi tile legyen kirajzolva, amennyi elfér a böngésző aktuális méretében
            let tileCanvasWidth = (Math.floor(window.innerWidth / constans.TILESIZE) * constans.TILESIZE) - (2 * constans.TILESIZE);
            let tileCanvasHeight = (Math.floor(window.innerHeight / constans.TILESIZE) * constans.TILESIZE) - (6 * constans.TILESIZE);            

            //fentről lefelé kell az egyes canvas layout-okat inicializálni, és kalkulálni a pontos pozícoikat (minden canvas-t méretezni kell, hogy a ráépített grafika méretarányos maradjon!)
            util.resizeCanvas(dataBackgroundCanvasElement, tileCanvasWidth, constans.DATA_CANVAS_HEIGHT);
            util.resizeCanvas(dataDisplayCanvasElement, tileCanvasWidth, constans.DATA_CANVAS_HEIGHT);
            util.addNewCanvasLayer('data-display-canvas', dataBackgroundCanvasElement.getBoundingClientRect());

            util.resizeCanvas(gameBackgroundCanvasElement, tileCanvasWidth, tileCanvasHeight);
            util.resizeCanvas(gameSnakeCanvasElement, tileCanvasWidth, tileCanvasHeight);
            util.addNewCanvasLayer('game-snake-canvas', gameBackgroundCanvasElement.getBoundingClientRect());

            initMapMatrix(tileCanvasHeight / constans.TILESIZE, tileCanvasWidth / constans.TILESIZE);
            
            initCanvasContexts();
            initDataBackgroundCanvas();
            initGameBackgroundCanvas();
        } else {
            console.log('Canvas initialization error!');
        }
    }

    function initMapMatrix(row, column) {
        gameMap = Object.create(mapObject);
        gameMap.row = row;
        gameMap.column = column;
        for(let i = 0; i != row; i++) {
            gameMap.mapMatrix[i] = new Array(tileObject);
            for(let j = 0; j != column; j++) {
                let emptyTile = Object.create(tileObject);
                emptyTile.row = emptyTile.column = 0;                
                gameMap.mapMatrix[i][j] = emptyTile;
            }
        }
    }

    function initCanvasContexts() {
        gameBackgroundContext = util.initCanvasContext(gameBackgroundCanvasElement);
        gameSnakeContext = util.initCanvasContext(gameSnakeCanvasElement);
        dataBackgroundContext = util.initCanvasContext(dataBackgroundCanvasElement);
        dataDisplayContext = util.initCanvasContext(dataDisplayCanvasElement);
    }

    function initGameBackgroundCanvas() {
        draw.drawCanvasBackground(gameBackgroundContext, gameBackgroundCanvasElement.width, gameBackgroundCanvasElement.height, constans.CANVAS_BACKGROUND_COLOR);
        
        let tileNumberHorizontal = Math.floor(gameBackgroundCanvasElement.width / constans.TILESIZE);
        let tileNumberVertical = Math.floor(gameBackgroundCanvasElement.height / constans.TILESIZE);
        
        for(let i = 0; i !== tileNumberHorizontal + 1; i++) {
            draw.drawLine(gameBackgroundContext, i * constans.TILESIZE, 0, i * constans.TILESIZE, tileNumberVertical * constans.TILESIZE, constans.GAME_BACKGROUND_GRID_COLOR);
        }
        for(let i = 0; i !== tileNumberVertical + 1; i++) {
            draw.drawLine(gameBackgroundContext, 0, i * constans.TILESIZE, tileNumberHorizontal * constans.TILESIZE, i * constans.TILESIZE, constans.GAME_BACKGROUND_GRID_COLOR);
        }        
    }

    function initDataBackgroundCanvas() {
        draw.drawCanvasBackground(dataBackgroundContext, dataBackgroundCanvasElement.width, dataBackgroundCanvasElement.height, constans.CANVAS_BACKGROUND_COLOR);

    }

    function initGame() {
        initTarget();
    }

    function initTarget() {
        let isCreateNew = false;        
        do {
            let targetStartRow = math.generateRandomNumberWithLimits(0, gameMap.row - 1);
            let targetStartColumn = math.generateRandomNumberWithLimits(0, gameMap.column - 1);
            if(gameMap.mapMatrix[targetStartRow][targetStartColumn].row == 0 && gameMap.mapMatrix[targetStartRow][targetStartColumn].column == 0) {
                target = Object.create(targetObject);
                target.row = targetStartRow;
                target.column = targetStartColumn;
                draw.drawFillSquare(gameSnakeContext, target.column * constans.TILESIZE, target.row * constans.TILESIZE, constans.TILESIZE, constans._TARGET_TILE_GRID_COLOR);
                isCreateNew = true;
            }
        } while(!isCreateNew);
    }

    return {
        //public scope
        init: function() {
            initCanvases();
            initGame();
        }

        

    };
}());

var constans = (function() {

    var _TILESIZE = 20;    
    var _CANVAS_WIDTH_CORRECTION = 50;
    var _CANVAS_HEIGHT_CORRECTION = 100;
    var _DATA_CANVAS_HEIGHT = 30;
    var _MAP_EMPTY_GRID = 0;
    var _CANVAS_BACKGROUND_COLOR = '#204060';
    var _GAME_BACKGROUND_GRID_COLOR = '#1f3852';
    var _TARGET_TILE_GRID_COLOR = '#000';

    return {

        TILESIZE: _TILESIZE,
        CANVAS_WIDTH_CORRECTION: _CANVAS_WIDTH_CORRECTION,
        CANVAS_HEIGHT_CORRECTION: _CANVAS_HEIGHT_CORRECTION,
        DATA_CANVAS_HEIGHT: _DATA_CANVAS_HEIGHT,
        MAP_EMPTY_GRID: _MAP_EMPTY_GRID,
        CANVAS_BACKGROUND_COLOR: _CANVAS_BACKGROUND_COLOR,
        GAME_BACKGROUND_GRID_COLOR: _GAME_BACKGROUND_GRID_COLOR,
        TARGET_TILE_GRID_COLOR: _TARGET_TILE_GRID_COLOR,
        
};
}());