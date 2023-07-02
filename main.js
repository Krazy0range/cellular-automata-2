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

const canvasDisplayDimensions = { width: 500, height: 500 };
const canvasResolutionDimensions = { width: 2500, height: 2500 };
const canvas = new Canvas(canvasDisplayDimensions, canvasResolutionDimensions);

const cellGridSize = { width: 100, height: 100 };
const cellSize = canvas.resolutionWidth / cellGridSize.width;
const cellularAutomata = new CellularAutomata(cellGridSize, cellSize);

const mouse = new Mouse(canvas);

function makeGlider(x, y) {
  cellularAutomata.grid.setCell(x+1, y+0, 1);
  cellularAutomata.grid.setCell(x+2, y+1, 1);
  cellularAutomata.grid.setCell(x+0, y+2, 1);
  cellularAutomata.grid.setCell(x+1, y+2, 1);
  cellularAutomata.grid.setCell(x+2, y+2, 1);
}

function gliderSquadron(x,y) {
  makeGlider(x+0,y+0);
  makeGlider(x+5,y+0);
  makeGlider(x+10,y+0);
  makeGlider(x+0,y+5);
  makeGlider(x+5,y+5);
  makeGlider(x+10,y+5);
  makeGlider(x+0,y+10);
  makeGlider(x+5,y+10);
  makeGlider(x+10,y+10);
}

function gliderChonk(x,y) {
  gliderSquadron(0,0);
  gliderSquadron(15,0);
  gliderSquadron(0,15);
  gliderSquadron(15,15);
}

gliderChonk(0,0);

document.body.onmousemove = mouse.mouseMove;
document.body.onmousedown = mouse.mouseDown;
document.body.onmouseup = mouse.mouseUp;

loop();