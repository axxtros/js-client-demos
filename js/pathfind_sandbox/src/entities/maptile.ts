enum TILE_TYPE {
  EMPTY = 0,
  WALL = 1,
  START = 2,
  END = 3,
  CURSOR = 4
}

class Coord {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }
}

class MapTile {

  private id: number;
  private mapCoord: Coord;
  private drawCoord: Coord;
  private type: TILE_TYPE;
  private f: number;
  private g: number;
  private h: number;
  private parentTileId: number

  constructor(id: number, mapCoord: Coord, drawCoord: Coord, type: TILE_TYPE) {
    this.id = id;
    this.mapCoord = mapCoord;
    this.drawCoord = drawCoord;
    this.type = type;
    this.f = this.g = this.h = this.parentTileId = 0;    
  }

  getId(): number {
    return this.id;
  }

  getMapCoord(): Coord {
    return this.mapCoord;
  }

  setMapCoord(mapCoord: Coord): void {
    this.mapCoord = mapCoord;
  }

  getDrawCoord(): Coord {
    return this.drawCoord;
  }

  setDrawCoord(drawCoord: Coord): void {
    this.drawCoord = drawCoord;
  }

  getType(): TILE_TYPE {
    return this.type;
  }

  setType(type: TILE_TYPE): void {
    this.type = type;
  }

  getF(): number {
    return this.g + this.h;
  }

  getG(): number {
    return this.g;
  }

  setG(value: number): void {
    this.g = value;
  }

  getH(): number {
    return this.h;
  }

  setH(value: number): void {
    this.h = value;
  }

  getParentTileId(): number {
    return this.parentTileId;
  }

  setPartenTileId(parentTileId: number) {
    this.parentTileId = parentTileId;
  }

  toString(): void {    
    console.log('id: ' + this.getId() + ' mX: ' + this.getMapCoord().getX() + '  mY: ' + this.getMapCoord().getY() + '  type: ' + TILE_TYPE[this.getType()]);
  }

  toStringLight(): string {
    let typeTinyName: string = TILE_TYPE[this.getType()];
    typeTinyName = typeTinyName.substring(0, 1);
    return 'mX:' + this.getMapCoord().getX() + '  mY:' + this.getMapCoord().getY() + ' tp:' + typeTinyName;
  }

}