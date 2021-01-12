//draw_util.js
//canvas draw functions
//08/01/2021 axtros@gmail.com

//utis ----------------------------------------------------------------------------------------------------------------
var util = (function() {

  //private scope
  
  
  return {
    //public scope

    /** 
     * Init a new game canvas layer from template canvas.
     */
    initCanvasLayerCSS: function(canvasNameID, templateCanvasPos) {
      let canvasID = '#' + canvasNameID;
      $(canvasID).css('position', 'absolute');
      $(canvasID).css({ top: templateCanvasPos.top + 'px' });	
      $(canvasID).css({ left: templateCanvasPos.left + 'px' });	
      $(canvasID).css({ width: templateCanvasPos.width + 'px' });	
      $(canvasID).css({ height: templateCanvasPos.height + 'px' });
    }

  };
}());

//math ----------------------------------------------------------------------------------------------------------------
var math = (function() {
  //private scope
  
  
  return {
    //public scope

  };
}());

//draw ----------------------------------------------------------------------------------------------------------------
var draw = (function() {

  function resizeCanvas(canvasElement, newWidth, newHeight) {
    canvasElement.width = newWidth;
    canvasElement.height = newHeight;
    canvasElement.setAttribute("style", "width: " + canvasElement.width + "px");    //importanat: Need resize the CSS protperties!
    canvasElement.setAttribute("style", "height: " + canvasElement.height + "px");
  }

  function drawFillRectangle(canvasContext, x, y, width, height, color) {	
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
    console.log('draw...');
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
  
  return {
    //public scope

    resizeCanvas: function (canvasElement, newWidth, newHeight) {
      resizeCanvas(canvasElement, newWidth, newHeight);
    },

    drawFillSquare: function (canvasContext, x, y, size, color) {
      drawFillRectangle(canvasContext, x, y, size, size, color);
    },

    drawLine: function(canvasContext, x1, y1, x2, y2, color) {
      drawLine(canvasContext, x1, y1, x2, y2, color);
    }

  };
}());