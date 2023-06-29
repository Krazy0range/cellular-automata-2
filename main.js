"use strict";

import { Canvas } from "./modules/canvas.js";
import { CellularAutomata } from "./modules/cellularautomata.js";

const canvasDisplayDimensions = { displayWidth : 500, displayHeight : 500 };
const canvasResolutionDimensions = { resolutionWidth : 500, resolutionHeight : 500 };
const canvas = new Canvas(canvasDisplayDimensions, canvasResolutionDimensions);

const cellGridSize = { width : 10, height : 10 };
const cellSize = canvas.width / cellGridSize.width;
const cellularAutomata = new CellularAutomata(cellGridSize, cellSize);

canvas.renderGrid(cellSize);