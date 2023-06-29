"use strict";

export class Canvas {

  constructor({ displayWidth, displayHeight }, { resolutionWidth, resolutionHeight }) {
    this.displayWidth = displayWidth;
    this.displayHeight = displayHeight;
    this.resolutionWidth = resolutionWidth;
    this.resolutionHeight = resolutionHeight;

    this.div = document.createElement("div");

    this.canv = document.createElement("canvas");
    this.canv.width = this.resolutionWidth;
    this.canv.height = this.resolutionHeight;
    this.canv.style.width = this.displayWidth + "px";
    this.canv.style.height = this.displayHeight + "px";
    this.canv.style.border = "1px solid black";

    this.div.appendChild(this.canv);
    document.body.appendChild(this.div);

    this.ctx = this.canv.getContext("2d");
  }

  renderGrid(grid, cellSize, colorSettings) {
    for (let row = 0; row < grid.width; row++) {
      for (let column = 0; column < grid.height; column++) {
        const item = grid.grid[row][column];
        const cellX = row * cellSize;
        const cellY = column * cellSize;
        this.drawCell(cellX, cellY, cellSize, colorSettings[item]);
      }
    }
  }

  drawCell(x, y, cellSize, color) {
    this.ctx.beginPath();

    this.ctx.strokeStyle = color;
    this.ctx.rect(x, y, cellSize, cellSize);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    
    this.ctx.stroke();
  }

}
