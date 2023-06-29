"use strict";

import { Canvas } from "./modules/canvas.js";
import { CellularAutomata } from "./modules/cellularautomata.js";


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
  let mouseCell = cellularAutomata.getCellFromMousePos(mousePos);
  if (mouseDown[0] > 0)
    cellularAutomata.grid.setCell(mouseCell.x, mouseCell.y, 1);
}

function render() {
  canvas.renderGrid(cellularAutomata.grid, cellSize, cellularAutomata.colorSettings);
}

const canvasDisplayDimensions = { width: 500, height: 500 };
const canvasResolutionDimensions = { width: 2500, height: 2500 };
const displayToResolutionScale = canvasResolutionDimensions.width / canvasDisplayDimensions.width;
const canvas = new Canvas(canvasDisplayDimensions, canvasResolutionDimensions);

const cellGridSize = { width: 100, height: 100 };
const cellSize = canvas.resolutionWidth / cellGridSize.width;
const cellularAutomata = new CellularAutomata(cellGridSize, cellSize);

// cellularAutomata.grid.setCell(1, 1, 1);
// cellularAutomata.grid.setCell(6, 4, 2);
// cellularAutomata.grid.setCell(3, 8, 3);

let mousePos = { x: 0, y: 0 };

canvas.canv.addEventListener("mousemove", function(event) {
  mousePos = canvas.getMousePos(event, displayToResolutionScale);
}, false);

// let's pretend that a mouse doesn't have more than 9 buttons
let mouseDown = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let mouseDownCount = 0;
document.body.onmousedown = function(evt) { 
  ++mouseDown[evt.button];
  ++mouseDownCount;
}
document.body.onmouseup = function(evt) {
  --mouseDown[evt.button];
  --mouseDownCount;
}

loop();