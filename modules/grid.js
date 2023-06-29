"use strict";

export class Grid {
  
  constructor(width, height, startingValue) {
    this.width = width;
    this.height = height;
    this.grid = [];
    this.initGrid(startingValue);
  }

  initGrid(value) {
    this.grid = Array(this.width);
    for (let x = 0; x < this.width; x++)
      this.grid[x] = Array(this.height).fill(0);
  }

  setCell(x, y, value) {
    this.grid[x][y] = value;
  }
  
}