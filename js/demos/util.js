//util.js
//utils functions
//17/05/2019 axtros@gmail.com

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function generateRandomEvenNumber(minValue, maxValue) {
	let genNumber = generateRandomNumber(minValue, maxValue);
	if(genNumber % 2 != 0) {
		--genNumber;
	}
	return genNumber;
}

function generateRandomOddNumber(minValue, maxValue) {
	let genNumber = generateRandomNumber(minValue, maxValue);
	if(genNumber % 2 == 0) {
		++genNumber;
	}
	return genNumber;
}

function generateRandomNumber(minValue, maxValue) {
	return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
}

function refreshPage() {
	location.reload();
}

/** 
 * Init a new game canvas layer from template canvas.
 */
function initCanvasLayerCSS(canvasNameID, templateCanvasPos) {
	let canvasID = '#' + canvasNameID;
	$(canvasID).css('position', 'absolute');
	$(canvasID).css({ top: templateCanvasPos.top + 'px' });	
	$(canvasID).css({ left: templateCanvasPos.left + 'px' });	
	$(canvasID).css({ width: templateCanvasPos.width + 'px' });	
	$(canvasID).css({ height: templateCanvasPos.height + 'px' });
}