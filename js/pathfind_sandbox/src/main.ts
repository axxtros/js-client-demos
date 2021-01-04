//tsc --p ../tsconfig.json

var main: any;

class Main {

  private canvas: any;
  private context: any;    
  private draw: any;
  private mapControl: any;
  private util: any;
  
  headerDiv = document.getElementById('header-wrapper-id') as HTMLElement;
  footerDiv = document.getElementById('footer-wrapper-id') as HTMLElement;
  canvasWrapper = document.getElementById('canvas-wrapper-div') as HTMLElement;   //https://stackoverflow.com/questions/52325814/why-we-are-using-htmlinputelement-in-typescript

  constructor() {
    this.init();
  }

  private init() {
    //a mérete, és a canvas-en található tile-ok száma a böngésző belső szélességének és magasságának értékének a függvényében lesz kikalkulálva
    let tileNumberHorizontal = Math.floor((window.innerWidth - Constains.MAP_LEFT_COORD) / Constains.MAP_TILE_SIZE) - 2;
    let tileNumberVertical = Math.floor((window.innerHeight - Constains.MAP_TOP_COORD) / Constains.MAP_TILE_SIZE) - 3;

    let canvasWrapperDivWidth: number = (tileNumberHorizontal * Constains.MAP_TILE_SIZE) + Constains.MAP_LEFT_COORD;
    let canvasWrapperDivHeight: number = (tileNumberVertical * Constains.MAP_TILE_SIZE) + Constains.MAP_TOP_COORD;
                  
    this.headerDiv.setAttribute("style", "width: " + canvasWrapperDivWidth + "px");
    this.footerDiv.setAttribute("style", "width: " + canvasWrapperDivWidth + "px");

    this.canvasWrapper.setAttribute("style", "width: " + canvasWrapperDivWidth + "px");
    this.canvasWrapper.setAttribute("style", "height: " + canvasWrapperDivHeight + "px");

    this.canvas = document.getElementById('pathfind-sandbox-canvas-id');
    this.canvas.width = canvasWrapperDivWidth;
    this.canvas.height = canvasWrapperDivHeight;

    this.context = this.canvas.getContext('2d');
    this.context.scale(1, 1);        

    this.mapControl = new MapControl(tileNumberHorizontal, tileNumberVertical); //ezt majd limitált kertek között az UI-ről lehessen beállítani
    this.util = new Util(this.canvas, this.context, this.mapControl);
    this.draw = new Draw(this.canvas, this.context, this.mapControl, this.util);
  }

  private main(): void {
    //NOP
  }

  //a canvas tile pontos beazonosítása miatt az ablak aktuális scroll-ját is figyelembe kell venni
  private updateWindow(): void {    
    //this.util.updateScrollOffsets(window.pageXOffset, window.pageYOffset);
  }

  startAStar(): void {
    let astar: AStar = new AStar(this.draw, this.mapControl, Constains.ASTAR_ENABLED_DIAGONAL, Constains.ASTAR_COST, Constains.ASTAR_DIAGONAL_COST);
  }

  printMapToConsole(): void {
    this.mapControl.printMapToConsole();
  }

}

window.onload = () => {
  main = new Main();  
  main.main();  
};

window.onresize = () => { 
  main = new Main();  
  main.main();  
};

window.onscroll = () => { 
  main.updateWindow();
}

