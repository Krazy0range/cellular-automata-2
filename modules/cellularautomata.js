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

    // function spreadToCell(x, y, value) {
    const spreadToCell = (x, y, value) => {
      if (x < 0 || x >= this.grid.width) return;
      if (y < 0 || y >= this.grid.height) return;
      if (this.gridSave[x][y] != 0) return;
      
      this.grid.setCell(x, y, value);
    }

    // Read the unaffected grid save while modifying the main grid
    this.saveGrid()

    for (let row = 0; row < this.grid.width; row++) {
      for (let column = 0; column < this.grid.height; column++) {
        const item = this.gridSave[row][column];

        if (item == 0 || item == undefined)
          continue;

        spreadToCell(row + 1, column, item);
        spreadToCell(row - 1, column, item);
        spreadToCell(row, column + 1, item);
        spreadToCell(row, column - 1, item);

      }
    }
  }

  saveGrid() {
    this.gridSave = JSON.parse(JSON.stringify(this.grid.grid));
  }

}