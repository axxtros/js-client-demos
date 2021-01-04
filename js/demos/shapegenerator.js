//shapegenerator.js
//Generating different shape for 2d map.
//17/05/2019 axtros@gmail.com

var Shape = {
	pivotX: 0,
	pivotY: 0,	
	vertexCoords: new Array()
}

function generateTriangle(pivotX, pivotY, height) {
	return generateMapCircleShape(pivotX, pivotY, height, 60, 3, false);
}

function generateMapCircleShape(pivotX, pivotY, triangleHeight, radius, sideNum, isWithPivotPoint) {
	let resultShape = Object.create(Shape);
	resultShape.pivotX = pivotX;
	resultShape.pivotY = pivotY;
	let shapeCoords = new Array();
	let coord = Object.create(Cord);
	if(isWithPivotPoint) {
		coord.x = pivotX;
		coord.y = pivotY;
		shapeCoords.push(coord);
	}
	resultShape.vertexCoords = shapeCoords;
	for(let i = 0; i != sideNum; i++) {
		resultShape.vertexCoords.push(calcCoordsLineWithAngle(resultShape.pivotX, resultShape.pivotY, radius * i, triangleHeight));		
	}
	return resultShape;
}

function generateMapRectangleShapeWithAngle(pivotX, pivotY, width, height, angle) {	
	let shape = generateMapRectangleShape(pivotX, pivotY, width, height);
	return rotateShape(shape.pivotX, shape.pivotY, shape, angle);
}

function rotateShape(pivotX, pivotY, shape, angle) {
	for(let coordIndex = 0; coordIndex != shape.vertexCoords.length; coordIndex++) {
		shape.vertexCoords[coordIndex] = rotatePoint(pivotX, pivotY, angle, shape.vertexCoords[coordIndex].x, shape.vertexCoords[coordIndex].y);
	}
	return shape;
}

function generateMapRectangleShape(pivotX, pivotY, width, height) {
	let resultShape = Object.create(Shape);
	resultShape.pivotX = pivotX;
	resultShape.pivotY = pivotY;
	let shapeCoords = new Array();
	let coord = Object.create(Cord);
	coord.x = pivotX - (width / 2);
	coord.y = pivotY - (height / 2);
	shapeCoords.push(coord);
	coord = [];	
	coord.x = pivotX + (width / 2);
	coord.y = pivotY - (height / 2);
	shapeCoords.push(coord);
	coord = [];
	coord.x = pivotX + (width / 2);
	coord.y = pivotY + (height / 2);
	shapeCoords.push(coord);
	coord = [];
	coord.x = pivotX - (width / 2);
	coord.y = pivotY + (height / 2);	
	shapeCoords.push(coord);
	resultShape.vertexCoords = shapeCoords;
	return resultShape;
}