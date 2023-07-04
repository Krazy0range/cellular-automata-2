"use strict";

export class Canvas {

  constructor(resolutionDimensions) {
    this.resolutionWidth = resolutionDimensions.width;
    this.resolutionHeight = resolutionDimensions.height;

    this.div = document.createElement("div");

    this.canv = document.createElement("canvas");
    this.canv.id = "canvas";
    this.canv.width = this.resolutionWidth;
    this.canv.height = this.resolutionHeight;
    this.canv.style.width = "calc(100vmin - 20px)";
    this.canv.style.height = "calc(100vmin - 20px)";
    this.canv.style.border = "1px solid black";
    this.canv.oncontextmenu = function(event) {
      event.preventDefault();
    }

    this.div.style.width = "auto";
    this.div.style.height = "auto";

    document.body.appendChild(this.div);
    this.div.appendChild(this.canv);

    this.canvElement = document.getElementById("canvas");

    this.displayWidth = () => { return this.canvElement.offsetWidth };
    this.displayHeight = () => { return this.canvElement.offsetHeight };

    this.ctx = this.canv.getContext("2d");
  }

  updateCanvasSize(width, height) {
    this.canv.style.width = width;
    this.canv.style.height = height;
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

  getMousePos(mouseEvent) {
    let rect = this.canvElement.getBoundingClientRect();
    return {
      x: (mouseEvent.clientX - rect.left),
      y: (mouseEvent.clientY - rect.top)
    };
  }

}
