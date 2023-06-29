"use strict";

import { Grid } from "./grid.js";

export class CellularAutomata {

  constructor({ width, height }, cellSize) {
    this.cellSize = cellSize;

    this.grid = new Grid(width, height, 0);
    this.gridSave = [];

    this.colorSettings = {
      0: "white",
      1: "black",
      2: "red",
      3: "blue"
    }
  }

  update() {
    // Read the unaffected grid save while modifying the main grid
    this.saveGrid()

    for (let row = 0; row < this.grid.width; row++) {
      for (let column = 0; column < this.grid.height; column++) {
        const item = this.gridSave[row][column];

        if (item == 0 || item == undefined)
          continue;

        this.grid.setCell(row + 1, column, item);
        this.grid.setCell(row - 1, column, item);
        this.grid.setCell(row, column + 1, item);
        this.grid.setCell(row, column - 1, item);

      }
    }
  }

  saveGrid() {
    this.gridSave = JSON.parse(JSON.stringify(this.grid.grid));
  }

}