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

    // Read the unaffected grid save while modifying the main grid
    this.saveGrid()

    for (let row = 0; row < this.grid.width; row++) {
      for (let column = 0; column < this.grid.height; column++) {
        const item = this.grid.getCell(row, column);

        // // const neighbors = [
        // //   this.grid.getCell(row + 1, column),
        // //   this.grid.getCell(row - 1, column),
        // //   this.grid.getCell(row, column + 1),
        // //   this.grid.getCell(row, column - 1)
        // // ]

        // // let sumcounter = 0;
        // // for (let n in neighbors)
        // //   sumcounter += n;
        // // const sum = sumcounter;//neighbors.reduce(
        // // //   (total, next) => {
        // // //     return total + next;
        // // //   }
        // // // );

        const top = this.grid.getCell(row + 1, column)+this.grid.getCell(row + 1, column - 1)+this.grid.getCell(row + 1, column + 1);
        const mid = this.grid.getCell(row + 0, column - 1)+this.grid.getCell(row + 0, column + 1);
        const bot = this.grid.getCell(row - 1, column)+this.grid.getCell(row - 1, column - 1)+this.grid.getCell(row - 1, column + 1);
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

        this.gridSave[row][column] = result;

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