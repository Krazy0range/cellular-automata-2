"use strict";

export class Grid {
  
  constructor(width, height, startingValue) {
    this.width = width;
    this.height = height;
    this.grid = [];
    this.initGrid(startingValue);
  }

  initGrid(value) {
    this.grid.forEach(row => {
      row.forEach(cell => {
        cell = value;
      })
    });
  }
  
}