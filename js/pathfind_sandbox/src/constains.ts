class Constains {
  static MAP_HORIZONTAL_MINIMUM_TILE_NUMBER = 10;
  static MAP_VERTICAL_MINIMUM_TILE_NUMBER = 10;
  static MAP_HORIZONTAL_MAXIMUM_TILE_NUMBER = 300;
  static MAP_VERTICAL_MAXIMUM_TILE_NUMBER = 300;
  
  static MAP_HORIZONTAL_TILE_NUMBER = 60;       //default 60 (fullHD)
  static MAP_VERTICAL_TILE_NUMBER = 28;         //default 60 (fullHD)
  static MAP_TILE_SIZE: number = 26;            //default 30 (fullHD)

  static MAP_TOP_COORD: number = 30;           //honnan indul az bal-felső tile kirajzolása
  static MAP_LEFT_COORD: number = 30;

  static MAP_BACKGROUND_COLOR: string = '#fff';

  static MAP_EMPTY_TILE_BACKGROUND_COLOR: string = '#fff7ed';  
  static MAP_START_TILE_BACKGROUND_COLOR: string = '#ff6568';  
  static MAP_END_TILE_BACKGROUND_COLOR: string = '#58f770';
  static MAP_WALL_TILE_BACKGROUND_COLOR: string = '#c7d6f5';

  static NEIGHBORE_TILE_BACKGROUND_COLOR: string = 'orange';
  static MIN_TILE_BACKGROUND_COLOR: string = 'green';

  static MAP_TILE_BORDER_COLOR: string = '#989898';
  static MAP_TILE_CURSOR_BACKGROUND_COLOR: string = '#e4ded7';  
  static MAP_TILE_CURSOR_BORDER_COLOR: string = 'orange';
  
  static MAP_SYMBOL_FONT: string = 'Consolas, monaco, monospace';
  static MAP_SYMBOL_FONT_SIZE: string = (Constains.MAP_TILE_SIZE / 2.5) + 'px'; //'1.2em';
  static MAP_SYMBOL_FONT_COLOR: string = '#989898';
  static MAP_SYMBOL_HORIZONTAL_DISTANCE_FROM_GRIDS: number = 5;
  static MAP_SYMBOL_VERTICAL_DISTANCE_FROM_GRIDS: number = 15;

  static ASTAR_ENABLED_DIAGONAL: boolean = true;
  static ASTAR_DISABLED_DIAGONAL: boolean = false;
  static ASTAR_COST: number = 10;
  static ASTAR_DIAGONAL_COST: number = 14;
  static ASTAR_ERROR_MSG_MAP_IS_NULL: string = "ERROR: Map is null or not exists!";

  constructor() {
    //NOP
  }

}