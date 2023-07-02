"use strict";

import { Grid } from "./grid.js";

export class CellularAutomata {

  constructor(gridDimensions, cellSize) {
    this.cellSize = cellSize;

    this.grid = new Grid(gridDimensions.width, gridDimensions.height, 0);
    this.gridSave = [];

    this.colorSettings = {
      0: "white",
      1: "black",
      2: "red",
      3: "blue"
    }
  }

  update() {

    this.saveGrid()

    for (let x = 0; x < this.grid.width; x++) {
      for (let y = 0; y < this.grid.height; y++) {
        const item = this.grid.getCell(x, y);

        const top = this.grid.getCell(x + 1, y - 1) + this.grid.getCell(x, y - 1) + this.grid.getCell(x - 1, y - 1);
        const mid = this.grid.getCell(x + 1, y) + this.grid.getCell(x - 1, y);
        const bot = this.grid.getCell(x + 1, y + 1) + this.grid.getCell(x, y + 1) + this.grid.getCell(x - 1, y + 1);
        const sum = top + mid + bot;

        console.log(sum);

        let result = 0;
        switch (sum) {
          case 0, 1, 4:
            result = 0; break;
          case 2:
            result = item; break;
          case 3:
            result = 1; break;
          default:
            result = 0; break;
        }

        this.gridSave[x][y] = result;

      }
    }

    this.applyGrid();
  }

  saveGrid() {
    this.gridSave = JSON.parse(JSON.stringify(this.grid.grid));
  }

  applyGrid() {
    this.grid.grid = JSON.parse(JSON.stringify(this.gridSave));
  }

  getCellFromMousePos(mousePosition) {
    return {
      x : Math.floor(mousePosition.x / this.cellSize),
      y : Math.floor(mousePosition.y / this.cellSize)
    }
  }

}