"use strict";

import { Canvas } from "./modules/canvas.js";
import { ConwaysGameOfLife, WireWorld, Computer, Poggers } from "./modules/cellularautomata.js";
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
  canvas.renderGrid(cellularAutomata.grid, cellSize, cellularAutomata.colorFunc);
}

function loop(timestamp) {
  
  update();
  render();
  
  window.requestAnimationFrame(loop);
}

const canvasResolutionDimensions = { width: 2500, height: 2500 };
const canvas = new Canvas(canvasResolutionDimensions);

const gridDimensions = { width: 50, height: 50 };
const cellSize = canvas.resolutionWidth / gridDimensions.width;

const mouse = new Mouse(canvas);
const keyboard = new Keyboard();

document.body.onmousemove = mouse.mouseMove;
document.body.onmousedown = mouse.mouseDown;
document.body.onmouseup = mouse.mouseUp;
document.body.onkeydown = keyboard.keyDown;
document.body.onkeyup = keyboard.keyUp;

const conwaysGameOfLife = new ConwaysGameOfLife(canvas, gridDimensions);
const wireWorld = new WireWorld(canvas, gridDimensions);
const computer = new Computer(canvas, gridDimensions);
const poggers = new Poggers(canvas, gridDimensions);

const patterns = new GameOfLifePatterns(conwaysGameOfLife);
patterns.gliderGun(0, 0);
patterns.spawn();

conwaysGameOfLife.offload();
wireWorld.offload();
computer.offload();
poggers.offload();

document.getElementById("conwaysgameoflife").onclick = (event) => {
  cellularAutomata.offload();
  cellularAutomata = conwaysGameOfLife;
  cellularAutomata.reload();
};

document.getElementById("wireworld").onclick = (event) => {
  cellularAutomata.offload();
  cellularAutomata = wireWorld;
  cellularAutomata.reload();
};

document.getElementById("computer").onclick = (event) => {
  cellularAutomata.offload();
  cellularAutomata = computer;
  cellularAutomata.reload();
};

document.getElementById("poggers").onclick = (event) => {
  cellularAutomata.offload();
  cellularAutomata = poggers;
  cellularAutomata.reload();
}

let cellularAutomata = poggers;
cellularAutomata.reload();

loop();