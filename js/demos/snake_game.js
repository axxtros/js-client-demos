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

    var mapMatrix = new Array();

    function initCanvases() {
        gameBackgroundCanvasElement = document.getElementById('background-canvas');
        gameSnakeCanvasElement = document.getElementById('snake-canvas');
        dataBackgroundCanvasElement = document.getElementById('data-background-canvas');
        dataDisplayCanvasElement = document.getElementById('data-display-canvas');

        if(gameBackgroundCanvasElement !== null && gameSnakeCanvasElement !== null && dataBackgroundCanvasElement !== null ) {            

            //az egyes canvas-ek pontos mérete a tile méret alapján lesz kalkulálva úgy, hogy annyi tile legyen kirajzolva, amennyi elfér a böngésző aktuális méretében
            let tileCanvasWidth = (Math.floor(window.innerWidth / constans.TILESIZE) * constans.TILESIZE) - (2 * constans.TILESIZE);
            let tileCanvasHeight = (Math.floor(window.innerHeight / constans.TILESIZE) * constans.TILESIZE) - (6 * constans.TILESIZE);

            draw.resizeCanvas(gameBackgroundCanvasElement, tileCanvasWidth, tileCanvasHeight);
            draw.resizeCanvas(gameSnakeCanvasElement, tileCanvasWidth, tileCanvasHeight);
            draw.resizeCanvas(dataBackgroundCanvasElement, tileCanvasWidth, 30);
            let backgroundCanvasPos = gameBackgroundCanvasElement.getBoundingClientRect();
            util.initCanvasLayerCSS('snake-canvas', backgroundCanvasPos);
            //util.initCanvasLayerCSS('data-canvas', backgroundCanvasPos);

            gameBackgroundContext = gameBackgroundCanvasElement.getContext("2d");
            gameSnakeContext = gameSnakeCanvasElement.getContext("2d");
            dataBackgroundContext = dataBackgroundCanvasElement.getContext("2d");
            dataDisplayContext = dataDisplayCanvasElement.getContext("2d");

            gameBackgroundContext.scale(1, 1);
            gameSnakeContext.scale(1, 1);
            dataBackgroundContext.scale(1, 1);        

            initGameBackgroundCanvas();
            initDataBackgroundCanvas();
            initMapMatrix(tileCanvasHeight / constans.TILESIZE, tileCanvasWidth / constans.TILESIZE);
        } else {
            console.log('Canvas initialization error!');
        }
    }

    function initGameBackgroundCanvas() {
        let tileNumberHorizontal = Math.floor(gameBackgroundCanvasElement.width / constans.TILESIZE);
        let tileNumberVertical = Math.floor(gameBackgroundCanvasElement.height / constans.TILESIZE);

        gameBackgroundContext.fillStyle = "#204060";
	    gameBackgroundContext.fillRect(0, 0, gameBackgroundCanvasElement.width, gameBackgroundCanvasElement.height);

        for(let i = 0; i !== tileNumberHorizontal + 1; i++) {
            draw.drawLine(gameBackgroundContext, i * constans.TILESIZE, 0, i * constans.TILESIZE, tileNumberVertical * constans.TILESIZE, '#1f3852');
        }
        for(let i = 0; i !== tileNumberVertical + 1; i++) {
            draw.drawLine(gameBackgroundContext, 0, i * constans.TILESIZE, tileNumberHorizontal * constans.TILESIZE, i * constans.TILESIZE, '#1f3852');
        }
    }

    function initDataBackgroundCanvas() {

    }

    function initMapMatrix(row, column) {
        for(let i = 0; i != row; i++) {
            mapMatrix[i] = new Array();
            for(let j = 0; j != column; j++) {
                mapMatrix[i][j] = constans.MAP_EMPTY_GRID;
            }
        }
    }

    return {
        //public scope
        init: function() {
            initCanvases();
        }

        

    };
}());

var constans = (function() {

    var _TILESIZE = 20;    
    var _CANVAS_WIDTH_CORRECTION = 50;
    var _CANVAS_HEIGHT_CORRECTION = 100;
    var _MAP_EMPTY_GRID = 0;

    return {

        TILESIZE: _TILESIZE,
        CANVAS_WIDTH_CORRECTION: _CANVAS_WIDTH_CORRECTION,
        CANVAS_HEIGHT_CORRECTION: _CANVAS_HEIGHT_CORRECTION,
        MAP_EMPTY_GRID: _MAP_EMPTY_GRID,
        
};
}());