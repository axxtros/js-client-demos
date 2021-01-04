//matrix_shapegenerator.js
//Generating different shape for 2d map.
//17/05/2019 axtros@gmail.com

var Shape = {	
	pivotMX: 0,
	pivotMY: 0,
	widthM : 0,
	heightM: 0,
	pivotVX: 0,
	pivotVY: 0,
	farDistance: 0,							//a shape pivot pontja, és a legtávolabbi pontja közötti távolság
	vertexCoords: new Array()
}

function generateMapRectangleShapeWithAngle(pivotMX, pivotMY, widthM, heightM, angle, matrixCellSize) {	
	let shape = generateMatrixRectangleShape(pivotMX, pivotMY, widthM, heightM, matrixCellSize);
	return rotateShape(shape.pivotVX, shape.pivotVY, shape, angle);
}

function rotateShape(pivotX, pivotY, shape, angle) {
	for(let coordIndex = 0; coordIndex != shape.vertexCoords.length; coordIndex++) {
		shape.vertexCoords[coordIndex] = rotatePoint(pivotX, pivotY, angle, shape.vertexCoords[coordIndex].x, shape.vertexCoords[coordIndex].y);
	}
	return shape;
}

function generateMatrixRectangleShape(pivotMX, pivotMY, widthM, heightM, matrixCellSize) {
	let resultShape = Object.create(Shape);
	resultShape.vertexCoords = [];
	resultShape.pivotMX = pivotMX;
	resultShape.pivotMY = pivotMY;
	resultShape.widthM = widthM;
	resultShape.heightM = heightM;
	let pivotVertexCoord = getVertexCoord(pivotMX, pivotMY, matrixCellSize);
	resultShape.pivotVX = pivotVertexCoord.x;
	resultShape.pivotVY = pivotVertexCoord.y;
	
	let widthDistance = calcVertexDistance(widthM, matrixCellSize);
	let heightDistance = calcVertexDistance(heightM, matrixCellSize);
	
	let coord = Object.create(Cord);
	coord.x = Math.floor(resultShape.pivotVX - widthDistance);
	coord.y = Math.floor(resultShape.pivotVY - heightDistance);
	resultShape.vertexCoords.push(coord);
	coord = [];	
	coord.x = Math.floor(resultShape.pivotVX + widthDistance);
	coord.y = Math.floor(resultShape.pivotVY - heightDistance);
	resultShape.vertexCoords.push(coord);
	coord = [];	
	coord.x = Math.floor(resultShape.pivotVX + widthDistance);
	coord.y = Math.floor(resultShape.pivotVY + heightDistance);
	resultShape.vertexCoords.push(coord);
	coord = [];
	coord.x = Math.floor(resultShape.pivotVX - widthDistance);
	coord.y = Math.floor(resultShape.pivotVY + heightDistance);
	resultShape.vertexCoords.push(coord);
	resultShape.farDistance = getShapeFarDistancePoint(resultShape);
	return resultShape;
}