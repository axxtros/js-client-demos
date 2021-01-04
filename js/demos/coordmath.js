//coordmath.js
//coordinate geometry mathematical functions
//17/05/2019 axtros@gmail.com

//http://csharphelper.com/blog/2015/10/draw-a-hexagonal-grid-in-c/

var cord = {
	x: 0,
	y: 0
}

//Ha van, akkor visszaadja két szakasz metszéspontját. (line1: x1, y1, x2, y2 | line2: x3, y3, x4, y4)
function calcLinesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
	let intersectPoint = null;
  let ua, ub;
  let denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);   
  if (denom == 0) {	//denimnator == 0 is not divide!
      return null;
  }
  ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  //console.log('ua, ub  (' + ua + ', ' + ub + ')');

  let m = x1 + ua * (x2 - x1);
  let n = y1 + ua * (y2 - y1); //ub helyett ua !!!
	//console.log('m,n  (' + m + ', ' + n + ')');
				
	if(ua > 0 && ua < 1 && ub > 0 && ub < 1) {	//ekkor metszi egymást a két szakasz
		intersectPoint = Object.create(cord);
		intersectPoint.x = Math.round(m);
		intersectPoint.y = Math.round(n);
	}
	return intersectPoint;	
}

//Visszaadja egy megadott koordinátától, adott szögben, és távolságban lévő új koordinátát.
function calcCoordsLineWithAngle(x, y, angle, distance) {
	point = Object.create(cord);
	point.x = Math.round(x + Math.cos(Math.PI * angle / 180) * distance);
  	point.y = Math.round(y + Math.sin(Math.PI * angle / 180) * distance);
  return point;
}

//Visszaadja két pont közötti szöget, 360 fokos metrikában.
function calcAngleBetweenCoordDegrees360(x1, y1, x2, y2) {
	let angle = calcAngleBetweenCoordsDegrees(x1, y1, x2, y2);
	if(angle < 0) 
		return 180 + (360 - (180 - angle));	
	return angle;
}

//Visszaadja két pont közötti szöget, fokban. Fontos, hogy az érték 0-180 fokig megegyezik a 360 fokos metrikával,
//de 180 fok felett, egy -180 - 0 fok közötti értéket ad vissza.
function calcAngleBetweenCoordsDegrees(x1, y1, x2, y2) {
	return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
}

//Visszaadja két pont közötti szöget, radiánban.
function calcAngleBetweenCoordsRadian(x1, y1, x2, y2) {
	return Math.atan2(y2 - y1, x2 - x1);
}

//Visszaadja két koordináta közötti távolságot.
function calcCoordsDistance(x1, y1, x2, y2) {
	var xDist = x1 - x2;
	var yDist = y1 - y2;
	return Math.round(Math.sqrt((xDist * xDist) + (yDist * yDist)));
}

//True, ha a pointX, pointY koordináta rajta van a lineX1, lineY1, lineX2, lineY2 által meghatározott egyenesen.
function checkPointOnLine(lineX1, lineY1, lineX2, lineY2, pointX, pointY) {
	var slope = (lineY2 - lineY1) / (lineX2 - lineX1);
	var newSlope = (lineY2 - pointY) / (lineX2 - pointX);
	if (slope == newSlope && pointX > lineX1 && pointX < lineX2 && pointY > lineY1 && pointY < lineY2) {
		return true;
	}
	return false;
}

//True, ha a px, py pont benne van az ax, ay, bx, by, cx, cy pontok által határolt háromszögben.
//https://koozdra.wordpress.com/2012/06/27/javascript-is-point-in-triangle
//http://www.blackpawn.com/texts/pointinpoly/default.html
function checkPointIsInTriangle(px, py, ax, ay, bx, by, cx, cy) {
	var v0 = [cx-ax,cy-ay];
	var v1 = [bx-ax,by-ay];
	var v2 = [px-ax,py-ay];

	var dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1]);
	var dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1]);
	var dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1]);
	var dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1]);
	var dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1]);

	var invDenom = 1/ (dot00 * dot11 - dot01 * dot01);

	var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

	return ((u >= 0) && (v >= 0) && (u + v < 1));
}

//Egy megadott pivotX, pivotY pont körül megadott szögben elforgatja a pointX, pointY által megadott pontot, és az új koordinátáját adja vissza.
function rotatePoint(pivotX, pivotY, angle, pointX, pointY) {
  pointX -= pivotX;
  pointY -= pivotY;

  let sin = Math.sin(angle);
  let cos = Math.cos(angle);
  let xnew = (pointX * cos) - (pointY * sin);
  let ynew = (pointX * sin) + (pointY * cos);

  point = Object.create(cord);
  point.x = xnew + pivotX;
  point.y = ynew + pivotY;
  return point;
}

function getMatrixCoord(vertexCoordX, vertexCoordY, matrixCellSize) {
	matrixPoint = Object.create(cord);
	matrixPoint.x = Math.floor(vertexCoordX / matrixCellSize);
	matrixPoint.y = Math.floor(vertexCoordY / matrixCellSize);
	return matrixPoint;
}

function getVertexCoord(matrixCoordX, matrixCoordY, matrixCellSize) {
	vertexPoint = Object.create(cord);
	vertexPoint.x = Math.floor(matrixCoordX * matrixCellSize) + (matrixCellSize / 2);
	vertexPoint.y = Math.floor(matrixCoordY * matrixCellSize) + (matrixCellSize / 2);
	return vertexPoint;
}

function calcVertexDistance(sizeM, matrixCellSize) {
	return (sizeM / 2) * matrixCellSize;
}

function getShapeFarDistancePoint(shape) {
	let shapeCoord = shape.vertexCoords[0];
	let maxDistance = Math.round(calcCoordsDistance(shape.pivotVX, shape.pivotVY, shapeCoord.x, shapeCoord.y));
	for(let i = 1; i != shape.vertexCoords.length; i++) {
		shapeCoord = shape.vertexCoords[i];
		let distance = Math.round(calcCoordsDistance(shape.pivotVX, shape.pivotVY, shapeCoord.x, shapeCoord.y));
		if(distance > maxDistance) {
			maxDistance = distance;
		}
	}
	return maxDistance;
}

function angle_between(n, a, b) {
	n = (360 + (n % 360)) % 360;
	a = (3600000 + a) % 360;
	b = (3600000 + b) % 360;

	if (a < b)
		return a <= n && n <= b;
	return a <= n || n <= b;
}

//True, ha az angle a két min..max szög között van.
function checkAngleBetweenAngles(angle, minAngle, maxAngle) {
	angle = (360 + (angle % 360)) % 360;
	minAngle = (3600000 + minAngle) % 360;
	maxAngle = (3600000 + maxAngle) % 360;

	if (minAngle < maxAngle)
		return minAngle <= angle && angle <= maxAngle;
	return minAngle <= angle || angle <= maxAngle;
}

//Hexagons math ---------------------------------------------------------------

/**
 * Szögre állított hexagrid koordináták számítása. 
 */
function calcPointyHexCoord(centerCoordX, centerCoordY, size, cornerNum) {
	var angle_deg = 60 * cornerNum - 30;			//30 fokos elfordítása a hex-nak, amúgy azonos a falt típusúval
	var angle_rad = Math.PI / 180 * angle_deg;
	point = Object.create(cord);
  point.x = centerCoordX + size * Math.cos(angle_rad);
  point.y = centerCoordY + size * Math.sin(angle_rad);
  return point;
}

function getPointyHexaWidth(size) {
	return Math.sqrt(3) * size;
}

function getPointyHexaHeight(size) {
	return size + (size / 2);
}

/**
 * Élre állított hexagrid koordináták számítása.
 */
function calcFlatHexCoord(centerCoordX, centerCoordY, size, cornerNum) {
	var angle_deg = 60 * cornerNum;
	var angle_rad = Math.PI / 180 * angle_deg;
	point = Object.create(cord);
  point.x = centerCoordX + size * Math.cos(angle_rad);
  point.y = centerCoordY + size * Math.sin(angle_rad);
  return point;
}

function getFlatHexaWidth(size) {
	return 3 * (size / 2);
}

function getFlatHexaHeight(size) {
	return Math.sqrt(3) * size;
}

function pixelToFlatHex(x, y, size) {    
    var q = Math.round(( 2./3 * x) / size);
    var r = Math.round((-1./3 * x  +  Math.sqrt(3)/3 * y) / size);		
		console.log('HEX Q: ' + q);
  	console.log('HEX R: ' + r);
}

//https://stackoverflow.com/questions/40776014/javascript-point-collision-with-regular-hexagon
var retPos = {
	x: 0,
	y: 0
};

function getSelectedHexagon(x, y, size) {
	var r = size; 
	var w = r * 2;
	var h = Math.sqrt(3) * r;

	var xa, ya, xpos, xx, yy, r2, h2;
	r2 = r / 2;
	h2 = h / 2;
	xx = Math.floor(x / r2);
	yy = Math.floor(y / h2);
	xpos = Math.floor(xx / 3);
	xx %= 6;
	if (xx % 3 === 0) {      // column with diagonals
		xa = (x % r2) / r2;  // to find the diagonals
		ya = (y % h2) / h2;
		if (yy % 2===0) {
			ya = 1 - ya;
		}
		if (xx === 3) {
			xa = 1 - xa;
		}
		if (xa > ya) {
			retPos.x = xpos + (xx === 3 ? -1 : 0);
			retPos.y = Math.floor(yy / 2);
			return retPos;
		}
		retPos.x = xpos + (xx === 0 ? -1 : 0);
		retPos.y = Math.floor((yy + 1) / 2);
		return retPos;
	}
	if (xx < 3) {
		retPos.x = xpos + (xx === 3 ? -1 : 0);
		retPos.y = Math.floor(yy / 2);
		return retPos;
	}
	retPos.x = xpos + (xx === 0 ? -1 : 0);
	retPos.y = Math.floor((yy + 1) / 2);
	return retPos;
}

//Hexagons math end -----------------------------------------------------------