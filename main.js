"use strict";

import { Canvas } from "./modules/canvas.js";
import { ConwaysGameOfLife, WireWorld, Ultimata } from "./modules/cellularautomata.js";
import { Mouse, Keyboard } from "./modules/input.js";
import { GameOfLifePatterns } from "./modules/patterns.js";

function handleInput() {
  cellularAutomata.handleMouse(mouse, keyboard);
  cellularAutomata.handleKeyboard(keyboard);
}

function update() {
  cellularAutomata.update();
  handleInput();
  keyboard.updateKeysDown();
}

function render() {
  canvas.renderGrid(cellularAutomata.grid, cellSize, cellularAutomata.colorSettings);
}

let lastRender = 0;
function loop(timestamp) {
  var progress = timestamp - lastRender;

  update();
  render();

  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}

const canvasResolutionDimensions = { width: 2500, height: 2500 };
const canvas = new Canvas(canvasResolutionDimensions);

const gridDimensions = { width: 50, height: 50 };
const cellSize = canvas.resolutionWidth / gridDimensions.width;
const cellularAutomata = new Ultimata(canvas, gridDimensions);

const mouse = new Mouse(canvas);
const keyboard = new Keyboard();

document.body.onmousemove = mouse.mouseMove;
document.body.onmousedown = mouse.mouseDown;
document.body.onmouseup = mouse.mouseUp;
document.body.onkeydown = keyboard.keyDown;
document.body.onkeyup = keyboard.keyUp;

loop();