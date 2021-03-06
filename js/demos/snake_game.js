//snake_game.js
//Classic snake game.
//06/01/2021 axtros@gmail.com

//use module pattern

//module pattern tutorial:
//https://medium.com/technofunnel/data-hiding-with-javascript-module-pattern-62b71520bddd

/*
    Kipróbálási feladatok:
    - javascript alapú gameLoop, [OK]
    - sprite-ok alkalmazása valamilyen grafikus programban létrehozva, és rárakva a canvas-re, [OK - grafikus sprite alapú a számok megjelenítése a dataDisplayCanvas-en]
    - canvas egér kezelés sprite-on, és egy kijelölt területen,
    - hang effektek létrehozása (+ esetleg zene), [OK - amikor eltalál egy target-et a snake, de előtte rá kell kattintani a canvas-re, mert user iterakció kell a böngésző alapú hanglejátszáshoz, biztonsági okokból, erre megoldást kell találni (programmatically click ???)]
    - a browser localDB-be adatot menteni / olvasni [OK]
*/

//GameObject (sprite object) example:
//https://mr-easy.github.io/2017-06-26-creating-spritesheet-animation-in-html5-canvas-using-javascript/
//http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/

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
        pos: tileObject,
        isRendered: false,
        hitPoint: 4
    }

    var snakeObject = {
        head: tileObject,     
        direction: SNAKE_DIRECTION,               //0-top, 1-right, 2-down, 3-left
        currentLength: 0,
        bodyTiles: new Array(),
        deletedElement: tileObject
    }

    var numberDrawObject = {        
        numberValue: 0,        
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }

    var gameMapRow;
    var gameMapColumn;
    var target;
    var snake;
    var isGameRunning = false;
    var isKeyDown = true;           //a render előtt ne lehessen dupla billentyűt használni, ez nélkül a snake-et vissza lehetne fordítani saját magába (a addEventListener független a gameLoop-tól)
    var gameSpeed = 40;
    var hitSoundEffect;
    var isLoadedNumbers;
    var numberImage;
    var userPoint;

    var numbersSpriteArray;

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
            let canvaswrapperDivWidht = Math.floor(document.getElementById("game-canvas-wrapper").offsetWidth);
            let canvaswrapperDivHeight = Math.floor(document.getElementById("game-canvas-wrapper").offsetHeight);

            let tileCanvasWidth = (Math.floor(/*window.innerWidth*/ canvaswrapperDivWidht / constans.TILESIZE) * constans.TILESIZE);
            //a game canvas-en kívüli terület nagysága, amelyet le kell vonni a teljes oldal magasságából
            //FIGYELEM: Ez egy közelítő szám, körübelüli kalkuláció, amely változhat az oldal CSS változásai során, vagy a constans.TILESIZE változása miatt.
            //oldal összetevők, amelyeket le kell vonni a magasságból:
            //(header + footer [azonos magasságúak, ez a kétszeres szorzó])
            //a dataDisplayCanvas magassága
            //a div-ek közötti padding-ok összege + ráhagyás
            let outerSnakeCanvasHeights = ((2 * (Math.floor(30 / constans.TILESIZE))) * constans.TILESIZE) +
                    (Math.floor(constans.DATA_CANVAS_HEIGHT / constans.TILESIZE) * constans.TILESIZE) + constans.WEB_PAGE_DIV_PADDING_HEIGHTS;
            let tileCanvasHeight = (Math.floor(window.innerHeight / constans.TILESIZE) * constans.TILESIZE) - ((Math.floor(outerSnakeCanvasHeights / constans.TILESIZE) * constans.TILESIZE));

            //fentről lefelé kell az egyes canvas layout-okat inicializálni, és kalkulálni a pontos pozícoikat (minden canvas-t méretezni kell, hogy a ráépített grafika méretarányos maradjon!)
            util.resizeCanvas(dataBackgroundCanvasElement, tileCanvasWidth, constans.DATA_CANVAS_HEIGHT);
            util.resizeCanvas(dataDisplayCanvasElement, tileCanvasWidth, constans.DATA_CANVAS_HEIGHT);
            util.addNewCanvasLayer('data-display-canvas', dataBackgroundCanvasElement.getBoundingClientRect());

            util.resizeCanvas(gameBackgroundCanvasElement, tileCanvasWidth, tileCanvasHeight);
            util.resizeCanvas(gameSnakeCanvasElement, tileCanvasWidth, tileCanvasHeight);
            util.addNewCanvasLayer('game-snake-canvas', gameBackgroundCanvasElement.getBoundingClientRect());

            gameMapRow = (tileCanvasHeight / constans.TILESIZE);
            gameMapColumn = (tileCanvasWidth / constans.TILESIZE);
            
            initCanvasContexts();            
            initDataBackgroundCanvas();
            initGameBackgroundCanvas();
            initSpriteImages();
        } else {
            console.log('Canvas initialization error!');
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

    function initSpriteImages() {
        isLoadedNumbers = false;
        numberImage = new Image;
        numberImage.onload = function() {            
            numbersSpriteArray = new Array();
            
            let xx = 0;
            for(let i = 0; i != 10; i++) {
                let numObject = Object.create(numberDrawObject);
                numObject.numberValue = i;
                numObject.x += xx;
                numObject.y = 0;
                numObject.width = numObject.numberValue != 1 ? 35 : 22;
                numObject.height = 40;

                numbersSpriteArray.push(numObject);
                
                switch(i) {
                    case 0: xx = 35; break;
                    case 1: xx = 58; break;
                    default: xx += 36; break;
                }

                draw.drawNumberImage(dataDisplayContext, numberImage, numbersSpriteArray[0], 10, 5);        //start: 0 point
            }
            //dataDisplayContext.drawImage(numberImage, 0, 0, 35, 40, 5, 5, 35, 40);
            isLoadedNumbers = true;
        };        
        numberImage.src = '../../img/numbers.png';
    }

    function initAudio() {
        hitSoundEffect = new Audio('../../audio/hit.mp3');
        hitSoundEffect.type = 'audio/mp3';        
    }

    function initGame() {
        initSnake();
        createTarget();        
        //https://www.kirupa.com/canvas/moving_shapes_canvas_keyboard.htm
        window.addEventListener("keydown", processInput, false);    //a billentyűzet kezelést nem kell a gameLoop-ban figyelni, ezt minden böngész támogatja
        userPoint = 0;
        isGameRunning = true;        
    }

    function initSnake() {
        let snakeStartRow = math.generateRandomNumberWithLimits(0, gameMapRow - 1);
        let snaketStartColumn = math.generateRandomNumberWithLimits(0, gameMapColumn - 1);
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
        snake.bodyTiles = new Array();
        snake.currentLength = constans.SNAKE_START_LENGTH;                
    }

    function createTarget() {
        let isCreateNew = false;        
        do {
            let targetStartRow = math.generateRandomNumberWithLimits(0, gameMapRow - 1);
            let targetStartColumn = math.generateRandomNumberWithLimits(0, gameMapColumn - 1);
            if(checkEmptyTile(targetStartRow, targetStartColumn)) {
                target = Object.create(targetObject);
                target.pos = Object.create(tileObject);
                target.pos.row = targetStartRow;
                target.pos.column = targetStartColumn;
                target.isRendered = true;
                target.hitPoint = 4;
                isCreateNew = true;
            }
        } while(!isCreateNew);
    }

    function checkEmptyTile(targetStartRow, targetStartColumn) {
        if(snake.bodyTiles.length !== 0) {
            for(let i = 0; i != snake.bodyTiles.length; i++) {
                if(snake.bodyTiles[i].row == targetStartRow && snake.bodyTiles[i].column == targetStartColumn) {
                    return false;
                }
            }
        }
        return true;
    }

    function processInput(keyEvent) {
        if(isKeyDown) {
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
            isKeyDown = false;
        }
    }

    function update() {
        //snake direction control
        switch(snake.direction) {
            case SNAKE_DIRECTION.UP: --snake.head.row; break;
            case SNAKE_DIRECTION.RIGHT: ++snake.head.column; break;
            case SNAKE_DIRECTION.DOWN: ++snake.head.row; break;
            case SNAKE_DIRECTION.LEFT: --snake.head.column; break;
        }
        //snake and target collision
        if(snake.head.row === target.pos.row && snake.head.column === target.pos.column) {
            playAudio();
            snake.currentLength += target.hitPoint;
            userPoint++;
            createTarget();          
        }
        //snake and wall collision (in default case, the snake new position on the other side)
        //top side
        if(snake.head.row === -1) {
            snake.head.row = gameMapRow - 1;
        }
        //right side
        if(snake.head.column === gameMapColumn) {
            snake.head.column = 0;
        }
        //bottom side
        if(snake.head.row === gameMapRow) {
            snake.head.row = 0;
        }
        //left side
        if(snake.head.column === -1) {
            snake.head.column = gameMapColumn - 1;
        }
        //snake collision with myself (penultimate step!!!)
        for(let i = 0; i !== snake.bodyTiles.length; i++) {
            let snakeBodyElement = snake.bodyTiles[i];
            if(snake.head.row === snakeBodyElement.row && snake.head.column === snakeBodyElement.column) {
                isGameRunning = false;
                return;
            }
        }
        //snake body control (last step!!!)
        let newSneakBodyElement = Object.create(tileObject);        
        newSneakBodyElement.row = snake.head.row;
        newSneakBodyElement.column = snake.head.column; 
        snake.bodyTiles.unshift(newSneakBodyElement);        //add head snake element to snakebody first place       
        snake.deletedElement = null;
        if(snake.bodyTiles.length > snake.currentLength) {
            snake.deletedElement = Object.create(tileObject);
            snake.deletedElement = snake.bodyTiles[snake.bodyTiles.length - 1];
            snake.bodyTiles.pop();                          //delete last element from snakebody
        }
    }

    async function playAudio() {
        await hitSoundEffect.play();        
    }

    //minden esetben csak a 'minimális' renderelés történik meg, ha valaminek nem változott a grafikus property-je, vagy a pozicíója, akkor nem rajzoljuk ki újra
    function render() { 
        //csak a snake head-et rajzoljuk ki, a body-ból csak az utolsó elem került törlésre  
        draw.drawFillSquare(gameSnakeContext, snake.head.column * constans.TILESIZE, snake.head.row * constans.TILESIZE, constans.TILESIZE, constans.SNAKE_TILE_GRID_COLOR);
        if(snake.deletedElement !== null) {
            draw.clearSquare(gameSnakeContext, snake.deletedElement.column * constans.TILESIZE, snake.deletedElement.row * constans.TILESIZE, constans.TILESIZE);
        }
        if(target.isRendered) {     //no redundant rendered
            draw.drawFillSquare(gameSnakeContext, target.pos.column * constans.TILESIZE, target.pos.row * constans.TILESIZE, constans.TILESIZE, constans.TARGET_TILE_GRID_COLOR);
            target.isRendered = false;            
            if(isLoadedNumbers) {
                renderedUserPoints();
            }
        }
    }

    function renderedUserPoints() {        
        let userPointString = userPoint.toString();
        let numberX = 10;
        for(let i = 0; i != userPointString.length; i++) {
            let number = userPointString.charAt(i);
            switch(number) {
                case '0': draw.drawNumberImage(dataDisplayContext, numberImage, numbersSpriteArray[0], numberX, 5); break;
                case '1': draw.drawNumberImage(dataDisplayContext, numberImage, numbersSpriteArray[1], numberX, 5); break;
                case '2': draw.drawNumberImage(dataDisplayContext, numberImage, numbersSpriteArray[2], numberX, 5); break;
                case '3': draw.drawNumberImage(dataDisplayContext, numberImage, numbersSpriteArray[3], numberX, 5); break;
                case '4': draw.drawNumberImage(dataDisplayContext, numberImage, numbersSpriteArray[4], numberX, 5); break;
                case '5': draw.drawNumberImage(dataDisplayContext, numberImage, numbersSpriteArray[5], numberX, 5); break;
                case '6': draw.drawNumberImage(dataDisplayContext, numberImage, numbersSpriteArray[6], numberX, 5); break;
                case '7': draw.drawNumberImage(dataDisplayContext, numberImage, numbersSpriteArray[7], numberX, 5); break;
                case '8': draw.drawNumberImage(dataDisplayContext, numberImage, numbersSpriteArray[8], numberX, 5); break;
                case '9': draw.drawNumberImage(dataDisplayContext, numberImage, numbersSpriteArray[9], numberX, 5); break;
            }
            if(number == '1') {
                numberX += 25;
            } else {
                numberX += 38;
            }
        }
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
        isKeyDown = true;
        
        last = now;
        
        if(isGameRunning) {
            setTimeout(() => { 
                //console.log("delay...");
                requestAnimationFrame(gameLoop); 
            }, gameSpeed);
            //requestAnimationFrame(gameLoop);
        }
    }

    return {
        
        init: function() {            
            //util.addNewItemToLocalStorage("test1", "ez egy érték");       //Local storage example [OK]
            //util.removeItemFromLocalStorage('test1');                     //[OK]

            initCanvases();
            initAudio();
            initGame();
            requestAnimationFrame(gameLoop);
        }

    };
}());

var constans = (function() {

    var _TILESIZE = 10;
    var _WEB_PAGE_DIV_PADDING_HEIGHTS = 60;        
    var _DATA_CANVAS_HEIGHT = 50;
    var _MAP_EMPTY_GRID = 0;
    var _CANVAS_BACKGROUND_COLOR = '#204060';
    var _GAME_BACKGROUND_GRID_COLOR = '#1f3852';
    var _TARGET_TILE_GRID_COLOR = '#eeab0d';
    var _SNAKE_TILE_GRID_COLOR = '#fff';
    var _SNAKE_START_LENGTH = 4;

    return {

        TILESIZE: _TILESIZE,
        WEB_PAGE_DIV_PADDING_HEIGHTS: _WEB_PAGE_DIV_PADDING_HEIGHTS,      
        DATA_CANVAS_HEIGHT: _DATA_CANVAS_HEIGHT,
        MAP_EMPTY_GRID: _MAP_EMPTY_GRID,
        CANVAS_BACKGROUND_COLOR: _CANVAS_BACKGROUND_COLOR,
        GAME_BACKGROUND_GRID_COLOR: _GAME_BACKGROUND_GRID_COLOR,
        TARGET_TILE_GRID_COLOR: _TARGET_TILE_GRID_COLOR,
        SNAKE_TILE_GRID_COLOR: _SNAKE_TILE_GRID_COLOR,
        SNAKE_START_LENGTH: _SNAKE_START_LENGTH,
};
}());