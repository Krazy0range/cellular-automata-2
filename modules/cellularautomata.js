"use strict";

import { Grid } from "./grid.js";

export class CellularAutomata {

  constructor({width, height}, cellSize) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;    
    this.grid = new Grid(width, height, 0);
    this.colorSettings = {
      0 : "white",
      1 : "black",
      2 : "red",
      3 : "blue"
    }
  }

}