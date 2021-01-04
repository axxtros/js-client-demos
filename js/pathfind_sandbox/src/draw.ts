class Draw {

  private canvas: any;
  private context: any;
  private mapControl: MapControl;
  private util: Util;
  private lastSelectedTile: MapTile;  
  private currentSelectedTile: MapTile;
  private isMousePressed: boolean;
  private isMoveStartTile: boolean;
  private isMoveEndTile: boolean;  
  private hiddenStartTileType: TILE_TYPE;
  private hiddenEndTileType: TILE_TYPE;

  constructor(canvas: any, context: any, mapControl: MapControl, util: Util) {
    this.canvas = canvas;
    this.context = context;    
    this.mapControl = mapControl;
    this.util = util;
    this.lastSelectedTile = mapControl.getDummyMapTile();
    this.currentSelectedTile = mapControl.getDummyMapTile();
    this.isMousePressed = false;
    this.isMoveStartTile = false;         
    this.isMoveEndTile = false;
    this.hiddenStartTileType = TILE_TYPE.EMPTY;
    this.hiddenEndTileType = TILE_TYPE.EMPTY;
    
    this.clearMap();
    this.drawMap();
  }

  clearMap(): void {
    this.context.clearRect(0, 0,  this.canvas.width,  this.canvas.height);
    this.context.fillStyle = Constains.MAP_BACKGROUND_COLOR;
    this.context.fillRect(0, 0,  this.canvas.width,  this.canvas.height);
  }

  drawMap(): void {
    this.drawMapSymbols();  
    this.drawGridMap();
  }
  
  drawMapSymbols(): void {
    //horizontal map coords
    let x = Constains.MAP_LEFT_COORD + (Constains.MAP_TILE_SIZE / 2), 
        y = Constains.MAP_TOP_COORD - Constains.MAP_SYMBOL_HORIZONTAL_DISTANCE_FROM_GRIDS;
    for(let i = 0; i != this.mapControl.getWidth(); i++) {
      this.drawMapSymbol(x, y, (i + 1) + '');
      x += Constains.MAP_TILE_SIZE;
    }
    //vertical map coords
    x = Constains.MAP_LEFT_COORD - Constains.MAP_SYMBOL_VERTICAL_DISTANCE_FROM_GRIDS, 
    y = Constains.MAP_TOP_COORD + (Constains.MAP_TILE_SIZE / 2) + 4;
    for(let i = 0; i != this.mapControl.getHeight(); i++) {
      this.drawMapSymbol(x, y, (i + 1) + '');
      y += Constains.MAP_TILE_SIZE;
    }
  }

  drawGridMap(): void {
    // console.log('this.map.getWidth(): ' + this.map.getWidth() + ' this.map.getHeight(): ' + this.map.getHeight());
    for(let mapCoordW = 0; mapCoordW != this.mapControl.getWidth(); mapCoordW++) {
      for(let mapCoordH = 0; mapCoordH != this.mapControl.getHeight(); mapCoordH++) {
        let mapTile: MapTile = this.mapControl.getMapMatrix()[mapCoordW][mapCoordH];
        // console.log('draw mapTile mapX: ' + mapTile.getMapCoord().getX() + ' mapY: ' + mapTile.getMapCoord().getY() + ' drawX: ' + mapTile.getDrawCoord().getX() + ' drawY: ' + mapTile.getDrawCoord().getY());         
        this.drawMapTile(mapTile);
      }
    }
  }

  //events --------------------------------------------------------------------
  mouseButtonDownEvent(): void {    
    if(this.currentSelectedTile != null) {      
      if(this.currentSelectedTile.getType() == TILE_TYPE.START) {
        this.isMoveStartTile = true;
      }
      if(this.currentSelectedTile.getType() == TILE_TYPE.END) {
        this.isMoveEndTile = true;
      }
      this.isMousePressed = true;
      this.clickCanvasEvent();    
    }
  }

  mouseButtonUpEvent(): void {    
    if(this.currentSelectedTile != null) {
      this.isMousePressed = false;
      this.isMoveStartTile = false;
      this.isMoveEndTile = false;
      this.clickCanvasEvent();
    }    
  }

  mouseMoveEvent(): void {    
    this.currentSelectedTile = this.getCurrentSelectedTile();    
    //csak akkor legyen rajz, ha az egér kurzor átmegy egy másik tile-ra
    if(this.isSwitchTile()) {            

      if(this.isMousePressed) {
        this.clickCanvasEvent();
      } else {  //kurzor rajz
        this.drawMapTile(this.lastSelectedTile);
        this.drawCursorMapTile(this.currentSelectedTile.getDrawCoord().getX(), this.currentSelectedTile.getDrawCoord().getY());      
      }
      this.lastSelectedTile = this.currentSelectedTile;
    }
  }

  clickCanvasEvent(): void {    
    if(this.currentSelectedTile != null) {      
      if(this.isMoveStartTile && this.currentSelectedTile.getType() != TILE_TYPE.END) {  //START tile mozgatása (END típusú tile-t nem takarhatja le)
        
        let hiddenTile = this.mapControl.getStartTile();                            //lekérdezzük a térképről a START tile-t
        this.changeTileTypeAndDraw(hiddenTile, this.hiddenStartTileType);           //visszaállítjuk a letakart tile eredeti típusát
        this.hiddenStartTileType = this.currentSelectedTile.getType();              //elmeni egy ideiglenes változóba annak a tile-nak a típusát, amit le fog takarni a START tile
        this.changeTileTypeAndDraw(this.currentSelectedTile, TILE_TYPE.START);      //az újonan kiválasztott tile letakarása (felülírása) a START tile-al
        this.mapControl.setStartTile(this.currentSelectedTile);                     //beálítjuk az akutális start tile-t a térképen

      } else if(this.isMoveEndTile && this.currentSelectedTile.getType() != TILE_TYPE.START) { //END tile mozgatása (START típusú tile-t nem takarhatja le)
        
        let hiddenTile = this.mapControl.getEndTile();
        this.changeTileTypeAndDraw(hiddenTile, this.hiddenEndTileType);
        this.hiddenEndTileType = this.currentSelectedTile.getType();
        this.changeTileTypeAndDraw(this.currentSelectedTile, TILE_TYPE.END);
        this.mapControl.setEndTile(this.currentSelectedTile);

      } else {  //draw/delete WALL
        switch(this.currentSelectedTile.getType()) {
          case TILE_TYPE.EMPTY:           
            this.changeTileTypeAndDraw(this.currentSelectedTile, TILE_TYPE.WALL); //EMPTY -> WALL
          break;
          case TILE_TYPE.WALL:
            this.changeTileTypeAndDraw(this.currentSelectedTile, TILE_TYPE.EMPTY);  //WALL -> EMPTY
          break;        
        }
      }
    }
  }

  //draw functions ------------------------------------------------------------
  changeTileTypeAndDraw(tile: MapTile, newType: TILE_TYPE): void {
    this.mapControl.changeTileType(tile, newType);
    this.drawMapTile(tile);
  }

  drawMapTile(mapTile: MapTile): void {
    switch(mapTile.getType()) {
      case TILE_TYPE.EMPTY: this.drawEmptyMapTile(mapTile.getDrawCoord().getX(), mapTile.getDrawCoord().getY()); break;
      case TILE_TYPE.WALL: this.drawWallMapTile(mapTile.getDrawCoord().getX(), mapTile.getDrawCoord().getY()); break;
      case TILE_TYPE.START: this.drawStartMapTile(mapTile.getDrawCoord().getX(), mapTile.getDrawCoord().getY()); break;
      case TILE_TYPE.END: this.drawEndMapTile(mapTile.getDrawCoord().getX(), mapTile.getDrawCoord().getY()); break;
      default: this.drawEmptyMapTile(mapTile.getDrawCoord().getX(), mapTile.getDrawCoord().getY()); break;
    }
  }
  
  drawEmptyMapTile(x: number, y: number): void {
    this.drawBorderSquare(x, y, Constains.MAP_TILE_SIZE, Constains.MAP_EMPTY_TILE_BACKGROUND_COLOR, Constains.MAP_TILE_BORDER_COLOR, 1);
  }

  drawStartMapTile(x: number, y: number): void {
    this.drawBorderSquare(x, y, Constains.MAP_TILE_SIZE, Constains.MAP_START_TILE_BACKGROUND_COLOR, Constains.MAP_TILE_BORDER_COLOR, 1);
  }

  drawEndMapTile(x: number, y: number): void {
    this.drawBorderSquare(x, y, Constains.MAP_TILE_SIZE, Constains.MAP_END_TILE_BACKGROUND_COLOR, Constains.MAP_TILE_BORDER_COLOR, 1);
  }

  drawWallMapTile(x: number, y: number): void {
    this.drawBorderSquare(x, y, Constains.MAP_TILE_SIZE, Constains.MAP_WALL_TILE_BACKGROUND_COLOR, Constains.MAP_TILE_BORDER_COLOR, 1);
  }
  
  drawCursorMapTile(x: number, y: number): void {
    this.drawBorderSquare(x, y, Constains.MAP_TILE_SIZE, Constains.MAP_TILE_CURSOR_BACKGROUND_COLOR, Constains.MAP_TILE_CURSOR_BORDER_COLOR, 1);
  }

  drawNeigborTiles(mapTiles: MapTile[]): void {
    if(mapTiles.length > 0) {
      for(let i = 0; i != mapTiles.length; i++) {
        let drawingTile = mapTiles[i];
        this.drawBorderSquare(drawingTile.getDrawCoord().getX(), drawingTile.getDrawCoord().getY(), Constains.MAP_TILE_SIZE, Constains.NEIGHBORE_TILE_BACKGROUND_COLOR, Constains.MAP_TILE_BORDER_COLOR, 1);
      }
    }
  }

  drawMinMapTile(tile: MapTile): void {
    this.drawBorderSquare(tile.getDrawCoord().getX(), tile.getDrawCoord().getY(), Constains.MAP_TILE_SIZE, Constains.MIN_TILE_BACKGROUND_COLOR, Constains.MAP_TILE_BORDER_COLOR, 1);
  }

  drawBorderSquare(x: number, y: number, size: number, fillColor: string, borderColor: string, borderTickness: number): void {
    this.drawBorderRectangle(x, y, size, size, fillColor, borderColor, borderTickness);
  }  

  drawBorderRectangle(x: number, y: number, width: number, height: number, fillColor: string, borderColor: string, borderTickness: number): void {
    this.context.fillStyle = borderColor;
    this.context.fillRect(x, y, width, height);    
    this.drawFillRectangle(x + borderTickness, y + borderTickness, width - (2 * borderTickness), height - (2 * borderTickness), fillColor);
  }

  drawFillSquare(x: number, y: number, size: number, color: string): void {
    this.drawFillRectangle(x, y, size, size, color);
  }

  drawFillRectangle(x: number, y: number, width: number, height: number, color: string): void {	
    this.context.fillStyle = color;
    this.context.fillRect(x, y, width, height);
  }

  drawMapSymbol(x: number, y: number, text: string): void {
    this.drawText(x, y, text, Constains.MAP_SYMBOL_FONT_SIZE, Constains.MAP_SYMBOL_FONT, Constains.MAP_SYMBOL_FONT_COLOR);
  }

  drawText(x: number, y: number, text: string, fontSize: string, font: string, color: string): void {
    this.context.font = fontSize + ' ' + font;
    this.context.fillStyle = color;
    this.context.textAlign = "center";
    this.context.fillText(text, x, y);
  }

  //getters/setters -----------------------------------------------------------
  isSwitchTile(): boolean {
    return this.currentSelectedTile.getMapCoord().getX() != this.lastSelectedTile.getMapCoord().getX() || this.currentSelectedTile.getMapCoord().getY() != this.lastSelectedTile.getMapCoord().getY();
  }

  getCurrentSelectedTile(): MapTile {
    return this.util.getCurrentSelectedTile();
  }

}