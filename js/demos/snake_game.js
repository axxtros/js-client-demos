//snake_game.js
//Classic snake game.
//06/01/2021 axtros@gmail.com

//use module pattern

"use strict";

var snake = (function() {

    //private scope
    var backgroundCanvas;
    var snakeCanvas;
    var dataCanvas;
    var backgroundContext;
    var snakeContext;
    var dataContext;

    function initCanvases() {
        backgroundCanvas = document.getElementById('background-canvas');
        snakeCanvas = document.getElementById('snake-canvas');
        dataCanvas = document.getElementById('data-canvas');

        if(backgroundCanvas !== null && snakeCanvas !== null && dataCanvas !== null ) {
            let backgroundCanvasPos = backgroundCanvas.getBoundingClientRect();
            util.initCanvasLayerCSS('snake-canvas', backgroundCanvasPos);
            util.initCanvasLayerCSS('data-canvas', backgroundCanvasPos);
        }

        backgroundContext = backgroundCanvas.getContext("2d");
        snakeContext = snakeCanvas.getContext("2d");
        dataContext = dataCanvas.getContext("2d");

        backgroundContext.scale(1, 1);
        snakeContext.scale(1, 1);
        dataContext.scale(1, 1);        

        backgroundContext.fillStyle = "#204060";
        backgroundContext.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
        
        draw.drawFillSquare(snakeContext, 10, 10, 10, 10, 0);
    }

    return {
        //public scope
        init: function() {
            console.log('init snake...');
            initCanvases();
        }

        

    };
}());