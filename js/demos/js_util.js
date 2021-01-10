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
  //private scope

  function drawFillRectangle(context, x, y, width, height, color) {	
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
    console.log('draw...');
  }
  
  return {
    //public scope

    drawFillSquare: function (context, x, y, size, color) {
      drawFillRectangle(context, x, y, size, size, color);
    }

  };
}());