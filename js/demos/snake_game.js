//snake_game.js
//Classic snake game.
//06/01/2021 axtros@gmail.com

//use module pattern

//module pattern tutorial:
//https://medium.com/technofunnel/data-hiding-with-javascript-module-pattern-62b71520bddd

/*
    Kipróbálási feladatok:
    - sprite-ok alkalmazása valamilyen grafikus programban létrehozva, és rárakva a canvas-re,
    - canvas egér kezelés sprite-on, és egy kijelölt területen területen,
    - hang effektek létrehozása (+ esetleg zene),
*/

"use strict";

var snakeGame = (function() {    
    
    var gameBackgroundCanvasElement;
    var gameSnakeCanvasElement;
    var dataBackgroundCanvasElement;
    var dataDisplayCanvasElement;

    var gameBackgroundContext;
    var gameSnakeContext;
    var dataBackgroundContext;
    var dataDisplayContext;    

    const SNAKE_DIRECTION = {
        UP: 0,
        RIGHT: 1,
        DOWN: 2,
        LEFT: 3
    };

    var tileObject = {
        row: 0,
        column: 0
    };

    var targetObject = {
        pos: tileObject
    }

    var snakeObject = {
        head: tileObject,     
        direction: SNAKE_DIRECTION,               //0-top, 1-right, 2-down, 3-left
        length: 4,
        bodyTiles: new Array()
    };

    var mapObject = {
        rowNum: 0,
        columnNum: 0,
        mapMatrix: new Array()
    }

    var gameMap;
    var target;
    var snake;
    var isRunning = false;

    //game loop variables
    var now; 
    var deltaTime = 0; 
    var last = util.nowTimeStamp();
    var step = 1/60;

    function initCanvases() {
        dataBackgroundCanvasElement = document.getElementById('data-background-canvas');
        dataDisplayCanvasElement = document.getElementById('data-display-canvas');
        gameBackgroundCanvasElement = document.getElementById('game-background-canvas');
        gameSnakeCanvasElement = document.getElementById('game-snake-canvas');        

        if(gameBackgroundCanvasElement !== null && gameSnakeCanvasElement !== null && dataBackgroundCanvasElement !== null && dataDisplayCanvasElement !== null) {            

            //az egyes canvas-ek pontos mérete a tile méret alapján lesz kalkulálva úgy, hogy annyi tile legyen kirajzolva, amennyi elfér a böngésző aktuális méretében
            let canvaswrapperDivWidht = document.getElementById("game-canvas-wrapper").offsetWidth;
            let canvaswrapperDivHeight = document.getElementById("game-canvas-wrapper").offsetHeight;

            let tileCanvasWidth = (Math.floor(/*window.innerWidth*/ canvaswrapperDivWidht / constans.TILESIZE) * constans.TILESIZE); // - (2 * constans.TILESIZE);
            let tileCanvasHeight = (Math.floor(window.innerHeight / constans.TILESIZE) * constans.TILESIZE) - (2 * (constans.TILESIZE * constans.TILESIZE));

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
        initSnake();
        createTarget();
        //https://www.kirupa.com/canvas/moving_shapes_canvas_keyboard.htm
        window.addEventListener("keydown", processInput, false);    //a billentyűzet kezelést nem kell a gameLoop-ban figyelni, ezt minden böngész támogatja
        isRunning = true;
    }

    function initSnake() {
        let snakeStartRow = math.generateRandomNumberWithLimits(0, gameMap.row - 1);
        let snaketStartColumn = math.generateRandomNumberWithLimits(0, gameMap.column - 1);
        snake = Object.create(snakeObject);
        snake.head = Object.create(tileObject);
        snake.head.row = snakeStartRow;
        snake.head.column = snaketStartColumn;        
        switch(math.generateRandomNumberWithLimits(0, 3)) {
            case 0: snake.direction = SNAKE_DIRECTION.UP; break;
            case 1: snake.direction = SNAKE_DIRECTION.RIGHT; break;
            case 2: snake.direction = SNAKE_DIRECTION.DOWN; break;
            case 3: snake.direction = SNAKE_DIRECTION.LEFT; break;
        }
        console.log('snake.direction: ' + snake.direction);
        console.log('snake start snake.head.column: ' + snake.head.column + ' snake.head.row: ' + snake.head.row);
        draw.drawFillSquare(gameSnakeContext, snake.head.column * constans.TILESIZE, snake.head.row * constans.TILESIZE, constans.TILESIZE, constans.SNAKE_TILE_GRID_COLOR);
    }

    function createTarget() {
        let isCreateNew = false;        
        do {
            let targetStartRow = math.generateRandomNumberWithLimits(0, gameMap.row - 1);
            let targetStartColumn = math.generateRandomNumberWithLimits(0, gameMap.column - 1);
            if(gameMap.mapMatrix[targetStartRow][targetStartColumn].row == 0 && gameMap.mapMatrix[targetStartRow][targetStartColumn].column == 0) {
                target = Object.create(targetObject);
                target.pos = Object.create(tileObject);
                target.pos.row = targetStartRow;
                target.pos.column = targetStartColumn;                
                isCreateNew = true;
            }
        } while(!isCreateNew);
        console.log('target start target.pos.column: ' + target.pos.column + ' target.pos.row: ' + target.pos.row);
        draw.drawFillSquare(gameSnakeContext, target.pos.column * constans.TILESIZE, target.pos.row * constans.TILESIZE, constans.TILESIZE, constans.TARGET_TILE_GRID_COLOR);
    }

    function processInput(keyEvent) {
        switch(keyEvent.keyCode) {
            case 37:    //left                
                if(snake.direction !== SNAKE_DIRECTION.RIGHT) {
                    snake.direction = SNAKE_DIRECTION.LEFT;
                }   
            break;
            case 38:    //up                
                if(snake.direction !== SNAKE_DIRECTION.DOWN) {
                    snake.direction = SNAKE_DIRECTION.UP;
                }                
            break;
            case 39:    //right                
                if(snake.direction !== SNAKE_DIRECTION.LEFT) {
                    snake.direction = SNAKE_DIRECTION.RIGHT;
                }                
            break;
            case 40:    //down                
                if(snake.direction !== SNAKE_DIRECTION.UP) {
                    snake.direction = SNAKE_DIRECTION.DOWN;
                }                
            break;
        }
    }

    function update() {
        switch(snake.direction) {
            case SNAKE_DIRECTION.UP: --snake.head.row; break;
            case SNAKE_DIRECTION.RIGHT: ++snake.head.column; break;
            case SNAKE_DIRECTION.DOWN: ++snake.head.row; break;
            case SNAKE_DIRECTION.LEFT: --snake.head.column; break;
        }
    }

    function render() {
        console.log('snake move snake.head.column: ' + snake.head.column + ' snake.head.row: ' + snake.head.row);
        draw.drawFillSquare(gameSnakeContext, snake.head.column * constans.TILESIZE, snake.head.row * constans.TILESIZE, constans.TILESIZE, constans.SNAKE_TILE_GRID_COLOR);
        //draw.clearSquare(gameSnakeContext, (snake.head.column) * constans.TILESIZE, snake.head.row * constans.TILESIZE, constans.TILESIZE, constans.SNAKE_TILE_GRID_COLOR);
        //console.log('render...');
    }

    //gameloop tutorials: 
    //https://codeincomplete.com/articles/javascript-game-foundations-the-game-loop/
    //https://coderwall.com/p/iygcpa/gameloop-the-correct-way
    function gameLoop() {
        now = util.nowTimeStamp();
        deltaTime = deltaTime + Math.min(1, (now - last) / 1000); 
        while(deltaTime > step) { //0,016
            deltaTime = deltaTime - step;            
            //processInput();
            //update();
        }
        update();
        render();
        last = now;
        
        if(isRunning) {
            setTimeout(() => { 
                //console.log("delay...");
                requestAnimationFrame(gameLoop); 
            }, 100);
            //requestAnimationFrame(gameLoop);
        }
    }

    return {
        
        init: function() {
            initCanvases();
            initGame();            
            requestAnimationFrame(gameLoop);
        }

    };
}());

var constans = (function() {

    var _TILESIZE = 10;        
    var _DATA_CANVAS_HEIGHT = 30;
    var _MAP_EMPTY_GRID = 0;
    var _CANVAS_BACKGROUND_COLOR = '#204060';
    var _GAME_BACKGROUND_GRID_COLOR = '#1f3852';
    var _TARGET_TILE_GRID_COLOR = '#000';
    var _SNAKE_TILE_GRID_COLOR = '#fff';

    return {

        TILESIZE: _TILESIZE,        
        DATA_CANVAS_HEIGHT: _DATA_CANVAS_HEIGHT,
        MAP_EMPTY_GRID: _MAP_EMPTY_GRID,
        CANVAS_BACKGROUND_COLOR: _CANVAS_BACKGROUND_COLOR,
        GAME_BACKGROUND_GRID_COLOR: _GAME_BACKGROUND_GRID_COLOR,
        TARGET_TILE_GRID_COLOR: _TARGET_TILE_GRID_COLOR,
        SNAKE_TILE_GRID_COLOR: _SNAKE_TILE_GRID_COLOR,
        
};
}());