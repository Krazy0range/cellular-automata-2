"use strict";

import { Canvas } from "./modules/canvas.js";
import { WireWorld } from "./modules/cellularautomata.js";
import { Mouse } from "./modules/mouse.js";
import { GameOfLifePatterns } from "./modules/patterns.js";

function handleMouse() {
  let mouseCell = cellularAutomata.getCellFromMousePos(mouse.mousePos);
  cellularAutomata.handleMouse(mouse, mouseCell);
}

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
  handleMouse();
}

function render() {
  canvas.renderGrid(cellularAutomata.grid, cellSize, cellularAutomata.colorSettings);
}

const canvasResolutionDimensions = { width: 2500, height: 2500 };
const canvas = new Canvas(canvasResolutionDimensions);

const gridDimensions = { width: 25, height: 25 };
const cellSize = canvas.resolutionWidth / gridDimensions.width;
const cellularAutomata = new WireWorld(canvas, gridDimensions);

const mouse = new Mouse(canvas);
const patterns = new GameOfLifePatterns(cellularAutomata);

document.body.onmousemove = mouse.mouseMove;
document.body.onmousedown = mouse.mouseDown;
document.body.onmouseup = mouse.mouseUp;

loop();