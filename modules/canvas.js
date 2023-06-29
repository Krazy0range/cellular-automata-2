"use strict";

export class Canvas {

  constructor({displayWidth, displayHeight}, {resolutionWidth, resolutionHeight}) {
    this.displayWidth = displayWidth;
    this.displayHeight = displayHeight;
    this.resolutionWidth = resolutionWidth;
    this.resolutionHeight = resolutionHeight;
    
    this.div = document.createElement("div");
    
    this.canv = document.createElement("canvas");
    this.canv.setAttribute("width", this.resolutionWidth.toString());
    this.canv.setAttribute("height", this.resolutionHeight.toString());
    // let widthStyle = `border: 1px solid black;`;
    // let widthStyle = `width: ${this.displayWidth}px;`;
    // let heightStyle = `height: ${this.displayHeight}px;`;
    // this.canv.setAttribute("style", `${borderStyle} ${widthStyle} ${heightStyle}`);

    this.div.appendChild(this.canv);
    document.body.appendChild(this.div);

    this.ctx = this.canv.getContext("2d");
  }

  renderGrid(cellSize) {
    this.drawCell(0, 0, cellSize);
  }

  drawCell(x, y, cellSize) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, x+cellSize, y+cellSize);
    this.ctx.stroke();
  }
  
}
