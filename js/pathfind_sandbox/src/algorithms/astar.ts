//tutorials:
//https://www.geeksforgeeks.org/a-search-algorithm/
//https://www.redblobgames.com/pathfinding/a-star/introduction.html
//http://theory.stanford.edu/~amitp/GameProgramming/

//videos:
//https://www.youtube.com/channel/UCmtyQOKKmrMVaKuRXz02jbQ

class AStar {
  
  private draw: Draw;
  private mapControl: MapControl;  
  private map: MapTile[][];
  private openList: MapTile[];
  private closeList: MapTile[];
  private isDiagonal: boolean;
  private cost: number;
  private diagonalCost: number;

  constructor(draw: Draw, mapControl: MapControl, isDiagonal: boolean, cost: number, diagonalCost: number) {
    this.draw = draw;
    this.mapControl = mapControl;    
    this.map = mapControl.getMapMatrix();
    this.isDiagonal = isDiagonal;
    this.cost = cost;
    this.diagonalCost = diagonalCost;
    this.openList = new Array();
    this.openList.push(mapControl.getStartTile());        //az open list-nek tartalmaznia kell a start tile-t
    this.closeList = new Array();
    this.run();
  }

  run(): void {
    
    let endFindPath = false;

    while(!endFindPath) {

      if(this.openList.length == 0) {
        endFindPath = true;
      } else {

        let currentTile = this.getMinTileF(this.openList);
        this.swapTileElement(this.openList, this.closeList, currentTile);
        let neighbourTiles: MapTile[] = this.getNeighbourTiles(currentTile);

        for(let i = 0; i != neighbourTiles.length; i++) {
          let neighbourTile = neighbourTiles[i];
          if(!this.isExistTile(this.closeList, neighbourTile)) {
            if(neighbourTile.getId() == this.mapControl.getEndTile().getId()) {
              endFindPath = true;
              break;            
            } else if(neighbourTile.getF() < currentTile.getF()) {
              currentTile = neighbourTile;
            }
          }
        }
        this.closeList.push(currentTile);

      }

    }

    /*
    //https://bleki.hu/hu/a-path-finding/
    1. Rakjuk be a kezdőpontot az open list-be, 0 eddigi költséggel és a becsült hátralévővel
    2. Rakjuk át az open-list-ből a legkisebb becsült teljes költségűt a closed-list-be
    3. Ha ez a célpont, akkor kész vagyunk
    4. Ha nem volt már node az open-list-ben, akkor nem létezik útvonal
    5. Kérjük le az átrakott node összes szomszédját az oda való eljutás költségével együtt
    6. Vegyük az első (következő) kifejtett child node-ot, ha van, amúgy vissza a 2-es pontra
    7. Ha a kifejtett node már a closed-list-ben szerepel, akkor a 6-os ponttól folytassuk
    8. Az új node eddigi költsége az átrakott node eddigi költsége és az onnan az új node-ba való eljutás költségének összege lesz
    9. Ha az új node még nem szerepel az open listában, akkor vegyük fel oda és kérjük le a becsült hátralévő költséget, vagyis számoljunk heurisztikát a végpontra
    10. Ha szerepel az open-list-ben, akkor frissítsük be, amennyiben a számolt új költség kisebb mint az eddigi
    11. Amennyiben ez előző két pontban történt változás, számoljuk ki a becsült teljes költséget, ami az eddigi költség és a becsült hátralévő összege
    12. Menjünk vissza a 6-os pontra
    
    Amennyiben az algoritmusunk talált útvonalat, a szülő node-okon végigmenve a kezdőpontig megkapjuk a teljes útvonalat fordított sorrendben. 
    Ha esetleg nem találtunk volna utat, a closed-list-ből kikereshető a legkisebb H értékű node, ami a célponthoz legközelebbi pont, és ehhez is visszafejthető egy út.
    */

    /*
    //https://www.geeksforgeeks.org/a-search-algorithm/    
    1.  Initialize the open list
    2.  Initialize the closed list
        put the starting node on the open 
        list (you can leave its f at zero)

    3.  while the open list is not empty
        a) find the node with the least f on 
          the open list, call it "q"

        b) pop q off the open list
      
        c) generate q's 8 successors and set their 
          parents to q
      
        d) for each successor
            i) if successor is the goal, stop search
              successor.g = q.g + distance between 
                                  successor and q
              successor.h = distance from goal to 
              successor (This can be done using many 
              ways, we will discuss three heuristics- 
              Manhattan, Diagonal and Euclidean 
              Heuristics)
              
              successor.f = successor.g + successor.h

            ii) if a node with the same position as 
                successor is in the OPEN list which has a 
              lower f than successor, skip this successor

            iii) if a node with the same position as 
                successor  is in the CLOSED list which has
                a lower f than successor, skip this successor
                otherwise, add  the node to the open list
        end (for loop)
      
        e) push q on the closed list
        end (while loop) 

    */
    
  }

  getNeighbourTiles(tile: MapTile): MapTile[] {
    let neighbourArray: MapTile[] = new Array();
    let neighbourTile: MapTile | null;    

    neighbourTile = this.mapControl.searchNeighbourTile(tile, NEIGHBOUR_TYPE.TOP);
    if(neighbourTile != null && this.isFreeTile(neighbourTile) && !this.isExistTile(neighbourArray, neighbourTile)) {      
      neighbourArray.push(this.calcTileCosts(neighbourTile, false));
    }
    neighbourTile = this.mapControl.searchNeighbourTile(tile, NEIGHBOUR_TYPE.RIGHT);
    if(neighbourTile != null && this.isFreeTile(neighbourTile) && !this.isExistTile(neighbourArray, neighbourTile)) {
      neighbourArray.push(this.calcTileCosts(neighbourTile, false));
    }
    neighbourTile = this.mapControl.searchNeighbourTile(tile, NEIGHBOUR_TYPE.BOTTOM);
    if(neighbourTile != null && this.isFreeTile(neighbourTile) && !this.isExistTile(neighbourArray, neighbourTile)) {
      neighbourArray.push(this.calcTileCosts(neighbourTile, false));
    }
    neighbourTile = this.mapControl.searchNeighbourTile(tile, NEIGHBOUR_TYPE.LEFT);
    if(neighbourTile != null && this.isFreeTile(neighbourTile) && !this.isExistTile(neighbourArray, neighbourTile)) {
      neighbourArray.push(this.calcTileCosts(neighbourTile, false));
    }

    if(this.isDiagonal) {      
      neighbourTile = this.mapControl.searchNeighbourTile(tile, NEIGHBOUR_TYPE.TOP_RIGHT);
      if(neighbourTile != null && this.isFreeTile(neighbourTile) && !this.isExistTile(neighbourArray, neighbourTile)) {
        neighbourArray.push(this.calcTileCosts(neighbourTile, true));
      }
      neighbourTile = this.mapControl.searchNeighbourTile(tile, NEIGHBOUR_TYPE.BOTTOM_RIGHT);
      if(neighbourTile != null && this.isFreeTile(neighbourTile) && !this.isExistTile(neighbourArray, neighbourTile)) {
        neighbourArray.push(this.calcTileCosts(neighbourTile, true));
      }
      neighbourTile = this.mapControl.searchNeighbourTile(tile, NEIGHBOUR_TYPE.BOTTOM_LEFT);
      if(neighbourTile != null && this.isFreeTile(neighbourTile) && !this.isExistTile(neighbourArray, neighbourTile)) {
        neighbourArray.push(this.calcTileCosts(neighbourTile, true));
      }
      neighbourTile = this.mapControl.searchNeighbourTile(tile, NEIGHBOUR_TYPE.TOP_LEFT);
      if(neighbourTile != null && this.isFreeTile(neighbourTile) && !this.isExistTile(neighbourArray, neighbourTile)) {
        neighbourArray.push(this.calcTileCosts(neighbourTile, true));
      }
    }

    if(neighbourArray.length != 0) {
      neighbourArray.forEach(neighbour => {
        neighbour.setPartenTileId(tile.getId());
      });
    }

    return neighbourArray;
  }  

  getMinTileF(mapTileArray: MapTile[]): MapTile {
    let minTile: MapTile;
    if(mapTileArray.length == 1) {
      return mapTileArray[0];
    } else {
      minTile = mapTileArray[0];
    }
    for(let i = 1; i != mapTileArray.length; i++) {
      if(mapTileArray[i].getF() < minTile.getF()) {
        minTile = mapTileArray[i];
      }
    }
    return minTile;
  }

  swapTileElement(fromArray: MapTile[], toArray: MapTile[], tile: MapTile) {
    this.removeElementFromTileArray(fromArray, tile);
    this.addElementToTileArray(toArray, tile);
  }

  addElementToTileArray(mapTileArray: MapTile[], tile: MapTile): MapTile[] {
    if(!this.isExistTile(mapTileArray, tile)) {
      mapTileArray.push(tile);
    }
    return mapTileArray;
  }

  removeElementFromTileArray(mapTileArray: MapTile[], removedTile: MapTile): MapTile[] {    
    for(let i = 0; i != mapTileArray.length; i++) {
      if(mapTileArray[i].getId() == removedTile.getId()) {
        mapTileArray.splice(i, 1);
        break;
      }
    }
    return mapTileArray;
  }

  addAllToArray(fromArray: MapTile[], toArray: MapTile[]) {
    for(let i = 0; i != fromArray.length; i++) {      
      if(!this.isExistTile(toArray, fromArray[i])) {
        toArray.push(fromArray[i]);        
      }
    }
  }

  isFreeTile(tile: MapTile): boolean {
    return tile.getType() != TILE_TYPE.START && tile.getType() != TILE_TYPE.WALL;
  }

  isExistTile(mapTileArray: MapTile[], searchedTile: MapTile | null): boolean {          
    if(searchedTile != null) {
      return mapTileArray.filter(tile => tile.getId() == searchedTile.getId()).length == 1;
    }
    return false;
  }

  calcTileCosts(tile: MapTile, isDiagonalTile: boolean): MapTile {    
    tile.setG(!isDiagonalTile ? this.calcManhattanDistance(tile, this.mapControl.getStartTile(), this.cost) : this.calcDiagonalDistance(tile, this.mapControl.getStartTile(), this.cost, this.diagonalCost));
    tile.setH(!isDiagonalTile ? this.calcManhattanDistance(tile, this.mapControl.getEndTile(), this.cost) : this.calcDiagonalDistance(tile, this.mapControl.getEndTile(), this.cost, this.diagonalCost));
    return tile;    
  }

  calcManhattanDistance(nodeTile: MapTile, goalTile: MapTile, cost: number): number {
    let dx = Math.abs(nodeTile.getMapCoord().getX() - goalTile.getMapCoord().getX());
    let dy = Math.abs(nodeTile.getMapCoord().getY() - goalTile.getMapCoord().getY());
    return cost * (dx + dy);
  }

  /**
   * D2 is the cost of moving diagonally.
   * When cost = 1 and diagonalCose = 1, this is called the Chebyshev distance. When cost = 1 and diagonalCost = sqrt(2), this is called the octile distance.
   */
  calcDiagonalDistance(nodeTile: MapTile, goalTile: MapTile, cost: number, diagonalCost: number): number {
    let dx = Math.abs(nodeTile.getMapCoord().getX() - goalTile.getMapCoord().getX());
    let dy = Math.abs(nodeTile.getMapCoord().getY() - goalTile.getMapCoord().getY());
    return cost * (dx + dy) + (diagonalCost - 2 * cost) * Math.min(dx, dy);
  }

  //getters/setters -----------------------------------------------------------
  toConsoleTileArray(tileArray: MapTile[]): void {
    for(let i = 0; i != tileArray.length; i++) {
      let tile = tileArray[i];
      console.log('id: ' + tile.getId() + ' mX: ' + tile.getMapCoord().getX() + ' mY: ' + tile.getMapCoord().getY() + ' type: ' + TILE_TYPE[tile.getType()] + ' g: ' + tile.getG() + ' h: ' + tile.getH() + ' f: ' + tile.getF());
    }
  }

}