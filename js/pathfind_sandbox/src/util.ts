class Util {  

  private canvas: any;
  private context: any;
  private map: MapControl;
  private mouseX: number;
  private mouseY: number;  
  private scrollOffsetX: number;
  private scrollOffsetY: number;
  private rect: any;

  constructor(canvas: any, context: any, map: MapControl) {    
    this.canvas = canvas;
    this.context = context;
    this.map = map;
    this.rect = canvas.getBoundingClientRect();
    this.mouseX = 0;
    this.mouseY = 0;
    this.scrollOffsetX = 0;
    this.scrollOffsetY = 0;
    this.updateScrollOffsets(this.scrollOffsetX, this.scrollOffsetY);
  }
  
  static getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * max)+ min;
  }

  //ez a canvas egér kurzor pontos helyzetét adja vissza, figyelembe véve az ablak scroll állapotát is
  setMouseCanvasPos(event: any): void {
    this.mouseX = (event.clientX - this.rect.left) + this.scrollOffsetX;
    this.mouseY = (event.clientY - this.rect.top) +this.scrollOffsetY;
    //console.log('mouseX: ' + this.mouseX + ' mouseY: ' + this.mouseY + ' scrollOffsetX: ' + this.scrollOffsetX + ' scrollOffsetY: ' + this.scrollOffsetY);
  }

  getCurrentSelectedTile(): MapTile {
    let tileX: number = Math.floor((this.mouseX - Constains.MAP_LEFT_COORD) / Constains.MAP_TILE_SIZE);
    let tileY: number = Math.floor((this.mouseY - Constains.MAP_TOP_COORD) / Constains.MAP_TILE_SIZE);    
    tileX < 0 ? tileX = 0 : tileX = tileX;
    tileY < 0 ? tileY = 0 : tileY = tileY;
    return this.map.getMapTile(tileX, tileY);
  }  

  updateScrollOffsets(scrollOffsetX: number, scrollOffsetY: number): void {
    this.scrollOffsetX = scrollOffsetX;
    this.scrollOffsetY = scrollOffsetY;
  }

}