"use strict";

export class Grid {
  
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = []
    this.initGrid();
  }

  initGrid() {
    for (let x = 0; x < this.width; x++) {
      this.grid.push([])
      for (let y = 0; y < this.width; y++) {
        this.grid[i].push(0)
      }
    }
  }
}