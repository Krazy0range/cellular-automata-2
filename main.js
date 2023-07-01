"use strict";

import { Canvas } from "./modules/canvas.js";
import { CellularAutomata } from "./modules/cellularautomata.js";
import { Mouse } from "./modules/mouse.js";

let lastRender = 0;
function loop(timestamp) {
  var progress = timestamp - lastRender

  update(progress)
  render()

  lastRender = timestamp
  window.requestAnimationFrame(loop)
}

function update(progress) {
  // cellularAutomata.update();
  
  if (mouse.leftClick()) {
    let mouseCell = cellularAutomata.getCellFromMousePos(mouse.mousePos);
    const cellOpposite = 1 - cellularAutomata.grid.getCell(mouseCell.x, mouseCell.y);
    cellularAutomata.grid.setCell(mouseCell.x, mouseCell.y, cellOpposite);
  }
}

function render() {
  canvas.renderGrid(cellularAutomata.grid, cellSize, cellularAutomata.colorSettings);
}

const canvasDisplayDimensions = { width: 500, height: 500 };
const canvasResolutionDimensions = { width: 2500, height: 2500 };
const canvas = new Canvas(canvasDisplayDimensions, canvasResolutionDimensions);

const cellGridSize = { width: 10, height: 10 };
const cellSize = canvas.resolutionWidth / cellGridSize.width;
const cellularAutomata = new CellularAutomata(cellGridSize, cellSize);

const mouse = new Mouse(canvas);

// cellularAutomata.grid.setCell(1, 1, 1);
// cellularAutomata.grid.setCell(6, 4, 2);
// cellularAutomata.grid.setCell(3, 8, 3);

document.body.onmousemove = mouse.mouseMove;
document.body.onmousedown = mouse.mouseDown;
document.body.onmouseup = mouse.mouseUp;

loop();