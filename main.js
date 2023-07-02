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
  cellularAutomata.update();
  
  if (mouse.leftClick()) {
    let mouseCell = cellularAutomata.getCellFromMousePos(mouse.mousePos);
    const cellOpposite = 1 - cellularAutomata.grid.getCell(mouseCell.x, mouseCell.y);
    cellularAutomata.grid.setCell(mouseCell.x, mouseCell.y, cellOpposite);
  }
}

function render() {
  canvas.renderGrid(cellularAutomata.grid, cellSize, cellularAutomata.colorSettings);
}

const canvasDisplayDimensions = { width: 250, height: 250 };
const canvasResolutionDimensions = { width: 2500, height: 2500 };
const canvas = new Canvas(canvasDisplayDimensions, canvasResolutionDimensions);

const cellGridSize = { width: 100, height: 100 };
const cellSize = canvas.resolutionWidth / cellGridSize.width;
const cellularAutomata = new CellularAutomata(cellGridSize, cellSize);

const mouse = new Mouse(canvas);

cellularAutomata.grid.setCell(1, 0, 1);
cellularAutomata.grid.setCell(2, 1, 1);
cellularAutomata.grid.setCell(0, 2, 1);
cellularAutomata.grid.setCell(1, 2, 1);
cellularAutomata.grid.setCell(2, 2, 1);

document.body.onmousemove = mouse.mouseMove;
document.body.onmousedown = mouse.mouseDown;
document.body.onmouseup = mouse.mouseUp;

loop();