enum NEIGHBOUR_TYPE {
  TOP = 1,
  TOP_RIGHT = 2,
  RIGHT = 3,
  BOTTOM_RIGHT = 4,
  BOTTOM = 5,
  BOTTOM_LEFT = 6,
  LEFT = 7,  
  TOP_LEFT = 8
}

class MapControl {

  private width: number;
  private height: number;
  private mapMatrix: MapTile[][];
  private startTile: MapTile;
  private endTile: MapTile;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.mapMatrix = [];
    
    this.initMap();

    this.startTile = this.getSearchedTileByType(TILE_TYPE.START);
    this.endTile = this.getSearchedTileByType(TILE_TYPE.END);
  }

  initMap(): void {
    let drawCoordX = Constains.MAP_LEFT_COORD, 
        drawCoordY = Constains.MAP_TOP_COORD;
    
    let tileId = 1;
    for(let mapCoordW = 0; mapCoordW != this.width; mapCoordW++) {
      this.mapMatrix[mapCoordW] = [];
      for(let mapCoordH = 0; mapCoordH != this.height; mapCoordH++) {
        let mapTile = new MapTile(tileId++, new Coord(mapCoordW, mapCoordH), new Coord(drawCoordY, drawCoordX), TILE_TYPE.EMPTY);
        this.mapMatrix[mapCoordW][mapCoordH] = mapTile;
        // console.log('init mapTile mapX: ' + mapTile.getMapCoord().getX() + ' mapY:' + mapTile.getMapCoord().getY() + ' drawX:' + mapTile.getDrawCoord().getX() + ' drawY: ' + mapTile.getDrawCoord().getY());
        drawCoordX += Constains.MAP_TILE_SIZE;
      }
      drawCoordX = Constains.MAP_LEFT_COORD;
      drawCoordY += Constains.MAP_TILE_SIZE;
    }
    this.initStartAndEndTiles();    
  }

  initStartAndEndTiles(): void {
    let startTileCoord: Coord = new Coord((Math.floor(this.width / 2) - Math.floor(this.width / 8)), Math.floor(this.height / 2));
    this.mapMatrix[startTileCoord.getX()][startTileCoord.getY()].setType(TILE_TYPE.START);
    let endTileCoord: Coord = new Coord((Math.floor(this.width / 2) + Math.floor(this.width / 8)), Math.floor(this.height / 2));
    this.mapMatrix[endTileCoord.getX()][endTileCoord.getY()].setType(TILE_TYPE.END);
  }  
  
  searchNeighbourTile(tile: MapTile, neighbourType: NEIGHBOUR_TYPE): MapTile | null {
    switch(neighbourType) {
      case NEIGHBOUR_TYPE.TOP:
        if(tile.getMapCoord().getY() <= 0) {
          return null;
        }
        return this.getMapTile(tile.getMapCoord().getX(), tile.getMapCoord().getY() - 1);
      case NEIGHBOUR_TYPE.TOP_RIGHT: 
        if(tile.getMapCoord().getX() >= this.getWidth() - 1 || tile.getMapCoord().getY() <= 0) {
          return null;
        }
        return this.getMapTile(tile.getMapCoord().getX() + 1, tile.getMapCoord().getY() - 1);
      case NEIGHBOUR_TYPE.RIGHT:
        if(tile.getMapCoord().getX() >= this.getWidth() - 1) {
          return null;
        }
        return this.getMapTile(tile.getMapCoord().getX() + 1, tile.getMapCoord().getY());
      case NEIGHBOUR_TYPE.BOTTOM_RIGHT: 
        if(tile.getMapCoord().getX() >= this.getWidth() - 1 || tile.getMapCoord().getY() >= this.getHeight()) {
          return null;
        }
        return this.getMapTile(tile.getMapCoord().getX() + 1, tile.getMapCoord().getY() + 1);
      case NEIGHBOUR_TYPE.BOTTOM: 
        if(tile.getMapCoord().getY() >= this.getHeight()) {
          return null;
        }
        return this.getMapTile(tile.getMapCoord().getX(), tile.getMapCoord().getY() + 1);
      case NEIGHBOUR_TYPE.BOTTOM_LEFT: 
        if(tile.getMapCoord().getX() <= 0 || tile.getMapCoord().getY() >= this.getHeight()) {
          return null;
        }
        return this.getMapTile(tile.getMapCoord().getX() - 1, tile.getMapCoord().getY() + 1);
      case NEIGHBOUR_TYPE.LEFT: 
        if(tile.getMapCoord().getX() <= 0) {
          return null;
        }
        return this.getMapTile(tile.getMapCoord().getX() - 1, tile.getMapCoord().getY());
      case NEIGHBOUR_TYPE.TOP_LEFT: 
        if(tile.getMapCoord().getX() <= 0 || tile.getMapCoord().getY() <= 0) {
          return null;
        }
        return this.getMapTile(tile.getMapCoord().getX() - 1, tile.getMapCoord().getY() - 1);
      default: return tile;
    }
  }  

  getStartTile(): MapTile {
    return this.startTile;
  }

  setStartTile(newTile: MapTile): void {
    this.startTile = newTile;
  }

  getEndTile(): MapTile {
    return this.endTile;
  }

  setEndTile(newTile: MapTile): void {
    this.endTile = newTile;
  }

  getSearchedStartTile(): MapTile {
    return this.getSearchedTileByType(TILE_TYPE.START);
  }

  getSearchedEndTile(): MapTile {
    return this.getSearchedTileByType(TILE_TYPE.END);
  }

  getSearchedTileByType(tileType: TILE_TYPE): MapTile {    
    if(this.mapMatrix != null) {            
      for(let mapCoordW = 0; mapCoordW != this.getWidth(); mapCoordW++) {
        for(let mapCoordH = 0; mapCoordH != this.getHeight(); mapCoordH++) {
          let mapTile: MapTile = this.getMapMatrix()[mapCoordW][mapCoordH];
          if(mapTile.getType() == tileType) {
            return mapTile;   //first!!!
          }
        }
      }      
    }  
    return this.getDummyMapTile();
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getMapMatrix(): MapTile[][] {
    return this.mapMatrix;
  }

  changeTileType(selectedTile: MapTile, tileType: TILE_TYPE): void {
    if(selectedTile != null) {
      this.getMapTile(selectedTile.getMapCoord().getX(), selectedTile.getMapCoord().getY()).setType(tileType);
    }
  }  

  getMapTile(mapCoordW: number, mapCoordH: number): MapTile {
    return this.getMapMatrix()[mapCoordW][mapCoordH];
  }  
  /**
   * Visszaad egy üres tile-t, ami csak az inicializálás miatt szükséges. A tile nem látható a canvas-an.
   */
  getDummyMapTile(): MapTile {
    return new MapTile(0, new Coord(-1, -1), new Coord(-100, -100), TILE_TYPE.EMPTY);
  }

  printMapToConsole(): void {
    if(this.mapMatrix != null) {
      for(let mapCoordH = 0; mapCoordH != this.getHeight(); mapCoordH++) {
        let rowTiles: string = "";
        for(let mapCoordW = 0; mapCoordW != this.getWidth(); mapCoordW++) {        
          let mapTile: MapTile = this.getMapMatrix()[mapCoordW][mapCoordH];
          rowTiles += mapTile.toStringLight() + '|';
        }
        console.log(rowTiles);
        console.log('--- ' + (mapCoordH + 1) + '.row ---');
      }
    } else {
      console.log('Map is empty!');
    }    
  }

}