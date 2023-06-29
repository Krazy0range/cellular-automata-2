"use strict";

import { Canvas } from "./modules/canvas.js";
import { CellularAutomata } from "./modules/cellularautomata.js";

const canvasDisplayDimensions = { displayWidth : 500, displayHeight : 500 };
const canvasResolutionDimensions = { resolutionWidth : 2500, resolutionHeight : 2500 };
const canvas = new Canvas(canvasDisplayDimensions, canvasResolutionDimensions);

const cellGridSize = { width : 10, height : 10 };
const cellSize = canvas.resolutionWidth   / cellGridSize.width;
const cellularAutomata = new CellularAutomata(cellGridSize, cellSize);

cellularAutomata.grid.setCell(1, 1, 1);
cellularAutomata.grid.setCell(6, 4, 2);
cellularAutomata.grid.setCell(3, 8, 3);

while True:
  cellularAutomata.updateGrid();
  canvas.renderGrid(cellularAutomata.grid, cellSize, cellularAutomata.colorSettings);
