"use strict";

import { Grid } from "./grid.js";

export class CellularAutomata {

  constructor({width, height}, cellSize) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    
    this.grid = new Grid(width, height, 0);
  }

}