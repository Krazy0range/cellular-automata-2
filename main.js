"use strict";

import { Canvas } from "./modules/canvas.js";
import { CellularAutomata } from "./modules/cellularautomata.js";
import { Mouse } from "./modules/mouse.js";
import { GameOfLifePatterns } from "./modules/patterns.js";

// TODO:
// Fix canvas resizing, mouse position being recorded incorrectly

function getWidth() {
  return Math.max(
    // document.body.scrollWidth,
    // document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

function handleMouse() {
  let mouseCell = cellularAutomata.getCellFromMousePos(mouse.mousePos);
  if (mouse.leftClick())
    cellularAutomata.grid.setCell(mouseCell.x, mouseCell.y, 1);
  if (mouse.rightClick())
    cellularAutomata.grid.setCell(mouseCell.x, mouseCell.y, 0);
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

const gridDimensions = { width: 100, height: 100 };
const cellSize = canvas.resolutionWidth / gridDimensions.width;
const cellularAutomata = new CellularAutomata(canvas, gridDimensions);

const mouse = new Mouse(canvas);
const patterns = new GameOfLifePatterns(cellularAutomata);

patterns.gliderGun(0, 0);
patterns.spawn();

document.body.onmousemove = mouse.mouseMove;
document.body.onmousedown = mouse.mouseDown;
document.body.onmouseup = mouse.mouseUp;

loop();