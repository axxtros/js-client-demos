//draw_util.js
//canvas draw functions
//08/01/2021 axtros@gmail.com

//utis ----------------------------------------------------------------------------------------------------------------
var util = (function() {

  return {    

    resizeCanvas: function(canvasElement, newWidth, newHeight) {
      canvasElement.width = newWidth;
      canvasElement.height = newHeight;
      canvasElement.setAttribute("style", "width: " + canvasElement.width + "px");    //importanat: Need resize the CSS protperties!
      canvasElement.setAttribute("style", "height: " + canvasElement.height + "px");
    },

    /** 
     * Init a new game canvas layer from template canvas.
     */
    addNewCanvasLayer: function(canvasNameID, templateCanvasBoundingClientRect) {
      let canvasID = '#' + canvasNameID;
      $(canvasID).css('position', 'absolute');
      $(canvasID).css({ top: templateCanvasBoundingClientRect.top + 'px' });	
      $(canvasID).css({ left: templateCanvasBoundingClientRect.left + 'px' });	
      $(canvasID).css({ width: templateCanvasBoundingClientRect.width + 'px' });	
      $(canvasID).css({ height: templateCanvasBoundingClientRect.height + 'px' });
    },

    initCanvasContext(canvasElement) {
      let canvasContext = canvasElement.getContext("2d");
      canvasContext.scale(1, 1);
      return canvasContext;
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
  
  function drawFillRectangle(canvasContext, x, y, width, height, color) {	
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);    
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

    drawCanvasBackground: function(canvasContext, width, height, color) {
      drawFillRectangle(canvasContext, 0, 0, width, height, color);
    },

    drawFillSquare: function (canvasContext, x, y, size, color) {
      drawFillRectangle(canvasContext, x, y, size, size, color);
    },

    drawLine: function(canvasContext, x1, y1, x2, y2, color) {
      drawLine(canvasContext, x1, y1, x2, y2, color);
    }

  };
}());