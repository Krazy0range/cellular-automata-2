"use strict";

import { Grid } from "./grid.js";

function getRandomItem(list) {
  return list[Math.floor((Math.random() * list.length))];
}

function count(array, value) {
  let count = 0;
  array.forEach((element) => {
    if (element == value)
      count++;
  });
  return count;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

class CellularAutomata {

  constructor(canvas, gridDimensions) {
    this.canvas = canvas;

    this.EMPTY = { cell: 0, data: 0 };
    this.currentInputCell = this.EMPTY;

    this.gridDimensions = gridDimensions;
    this.grid = new Grid(this.gridDimensions.width, this.gridDimensions.height, this.EMPTY);
    this.workingGrid = new Grid(this.gridDimensions.width, this.gridDimensions.height, this.EMPTY);

    this.simulationSpeed = 1;

    this.colorSettings = {
      0: "white",
      1: "black"
    }

    this.instructions = document.getElementById("instructions");
    this.buttons = document.getElementById("buttons");

    this.clearBtn = document.getElementById("clearbtn");
    this.clearBtn.onclick = (event) => {
      this.resetGrid();
    }

    this.stepBtn = document.getElementById("stepbtn");
    this.stepBtn.onclick = (event) => {
      this.updateCells();
    }

    this.debug = document.getElementById("debugtext")
    this.debug.innerText = "loading...";
  }

  resetGrid() {
    for (let x = 0; x < this.grid.width; x++)
      for (let y = 0; y < this.grid.height; y++)
        this.grid.setCell(x, y, 0);
  }

  mobileGridPlacement() {}

  update() {
    this.updateDebug();
    for (let i = 0; i < this.simulationSpeed; i++)
      this.updateCells();
  }

  updateDebug() {
    const simulationSpeedDebug = this.simulationSpeedDebug();
    const gridDebug = this.gridDebug();
    
    this.debug.innerHTML = simulationSpeedDebug;
  }

  gridDebug() {
    const gridText = this.grid.grid.flat().reduce((accumulator, currentValue, currentIndex) => {
      let value = accumulator;
      if (currentIndex % this.grid.width == 0)
        value += "<br>";
      else
        value += " ";
      value += currentValue.data.toString();
      return value;
    }, "");
    const gridDebug = "gridData =" + gridText;
    return gridDebug;
  }

  simulationSpeedDebug() {
    const simulationSpeedDebug = `simulationSpeed = ${this.simulationSpeed};<br>`;
    return simulationSpeedDebug;
  }

  handleMouse(mouse) { }
  handleKeyboard(keyboard) { }

  updateCells() { }

  getNeighbors(x, y) {
    return {
      normal: [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1]
      ],
      moore: [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
        [x + 1, y + 1],
        [x - 1, y + 1],
        [x + 1, y - 1],
        [x - 1, y - 1]
      ]
    };
  }

  saveGrid() {
    this.workingGrid.grid = JSON.parse(JSON.stringify(this.grid.grid));
  }

  applyGrid() {
    this.grid.grid = JSON.parse(JSON.stringify(this.workingGrid.grid));
  }

  getCellFromMousePos(mousePosition) {
    const divisor = this.canvas.displayWidth() / this.gridDimensions.width;
    return {
      x: Math.floor(mousePosition.x / divisor),
      y: Math.floor(mousePosition.y / divisor)
    }
  }


}

export class Physics extends CellularAutomata {

  constructor(canvas, gridDimensions) {
    super(canvas, gridDimensions);

    this.EMPTY = { cell: 0, data: 0 };
    this.SAND = { cell: 1, data: 0 };

    this.colorSettings = {
      0: "dimgray",
      1: "yellow"
    };

    this.instructions.innerHTML = `
    <b>Instructions</b>
    <p>
      nu
      too bad
    </p>
    <b>Rules</b>
    <p>
      NO
      PLEASE
      HELP
    </p>
    `;
  }

  // TODO: STILL DEBUGGING THE TIMER CELL :/

  mobileGridPlacement() {
    this.simulationSpeed = 0;
    this.grid.setCell(1, 1, this.TIMER);
  }

  handleMouse(mouse, keyboard) {
    let mouseCell = this.getCellFromMousePos(this.canvas.mousePosToCanvas(mouse.mousePos));

    if (mouse.leftClick())
      this.grid.setCell(mouseCell.x, mouseCell.y, this.currentInputCell);
    if (mouse.rightClick())
      this.grid.setCell(mouseCell.x, mouseCell.y, 0);

    if (mouse.leftClick() && keyboard.keys["ShiftLeft"]) {
      const cells = this.getNeighbors(mouseCell.x, mouseCell.y).moore;
      cells.forEach(cell => {
        this.grid.setCell(...cell, this.currentInputCell);
      });
    }
  }

  handleKeyboard(keyboard) {
    if (keyboard.keysDown["Space"])
      this.simulationSpeed = 1 - this.simulationSpeed;
    if (keyboard.keys["Digit1"])
      this.currentInputCell = this.TIMER;
    // if (keyboard.keys["Digit2"])
    //   this.currentInputCell = 2;
    // if (keyboard.keys["Digit3"])
    //   this.currentInputCell = 3;
    // if (keyboard.keys["Digit4"])
    //   this.currentInputCell = 4;
    // if (keyboard.keys["Digit5"])
    //   this.currentInputCell = 5;
    // if (keyboard.keys["Digit6"])
    //   this.currentInputCell = 6;
    // if (keyboard.keys["Digit7"])
    //   this.currentInputCell = 7;
    // if (keyboard.keys["Digit8"])
    //   this.currentInputCell = 8;
    // if (keyboard.keys["Digit9"])
    //   this.currentInputCell = 9;
  }

  updateCells() {
    this.saveGrid();

    for (let x = 0; x < this.grid.width; x++) {
      for (let y = 0; y < this.grid.height; y++) {

        const cell = this.grid.getCell(x, y);

        switch (cell.cell) {
          case this.TIMER.cell:
            this.evalTimer(cell, x, y);
        }

      }
    }

    this.applyGrid();
  }

  evalTimer(cell, x, y) {

    if (cell.data == 0) {
      this.workingGrid.setCell(x, y, this.EMPTY);
      return;
    }

    const cellData = cell.data;
    const decreasedTimer = { cell: 1, data: cellData - 1 };
    this.workingGrid.setCell(x, y, decreasedTimer);
  }

}

export class WireWorld extends CellularAutomata {

  constructor(canvas, gridDimensions) {
    super(canvas, gridDimensions);

    this.EMPTY = 0;
    this.WIRE = 1;
    this.ELECTRON = 2;
    this.ELECTRONTAIL = 3;

    this.colorSettings = {
      0: "dimgray",
      1: "black",
      2: "yellow",
      3: "white"
    };

    this.instructions.innerHTML = `
    <b>Instructions</b>
    <p>
      Left click to draw, right click to clear.
      Press 1 to select wire cells, 2 for electron cells, and 3 for electron tail cells.
      Press space to play/pause the simulation.
    </p>
    <b>Rules</b>
    <p>
      Empty cells do not change.
      Wire cells become a electron cell if it has 1 or 2 neighboring electrons.
      Electrons become electron tails, and electron tails become a wire cell.
    </p>
    `;

    // <button id="clearelectronsbtn">Clear Electrons</button>
    //document.getElementById("clearelectronsbtn");
    this.clearElectronsBtn = document.createElement("button");
    this.clearElectronsBtn.innerText = "Clear Electrons";
    this.clearElectronsBtn.onclick = (event) => {
      this.clearElectrons();
    }
    this.buttons.appendChild(this.clearElectronsBtn);
  }

  clearElectrons() {
    for (let x = 0; x < this.grid.width; x++)
      for (let y = 0; y < this.grid.height; y++)
        if (this.grid.getCell(x, y) == 2 ||
          this.grid.getCell(x, y) == 3)
          this.grid.setCell(x, y, 1);
  }

  handleMouse(mouse) {
    let mouseCell = this.getCellFromMousePos(this.canvas.mousePosToCanvas(mouse.mousePos));

    if (mouse.leftClick())
      this.grid.setCell(mouseCell.x, mouseCell.y, this.currentInputCell);
    if (mouse.rightClick())
      this.grid.setCell(mouseCell.x, mouseCell.y, 0);
  }

  handleKeyboard(keyboard) {
    if (keyboard.keys["Digit1"])
      this.currentInputCell = 1;
    if (keyboard.keys["Digit2"])
      this.currentInputCell = 2;
    if (keyboard.keys["Digit3"])
      this.currentInputCell = 3;
    if (keyboard.keysDown["Space"])
      this.simulationSpeed = 1 - this.simulationSpeed;
  }

  updateCells() {
    this.saveGrid();

    for (let x = 0; x < this.grid.width; x++) {
      for (let y = 0; y < this.grid.height; y++) {
        const item = this.grid.getCell(x, y);

        const neighbors = [
          this.grid.getCell(x + 1, y),
          this.grid.getCell(x - 1, y),
          this.grid.getCell(x, y + 1),
          this.grid.getCell(x, y - 1),
          this.grid.getCell(x + 1, y + 1),
          this.grid.getCell(x - 1, y + 1),
          this.grid.getCell(x + 1, y - 1),
          this.grid.getCell(x - 1, y - 1)
        ];

        let result = 0;

        switch (item) {
          case this.EMPTY:
            result = 0;
            break;
          case this.WIRE:
            result = this.evalWireCell(neighbors);
            break;
          case this.ELECTRON:
            result = this.ELECTRONTAIL;
            break;
          case this.ELECTRONTAIL:
            result = this.WIRE;
            break;
          default:
            result = item;
            break;
        }

        this.workingGrid.setCell(x, y);

      }
    }

    this.applyGrid();
  }

  evalWireCell(neighbors) {

    const surroundingElectrons = count(neighbors, this.ELECTRON);

    if (surroundingElectrons == 1 || surroundingElectrons == 2)
      return this.ELECTRON;

    return this.WIRE;
  }



}

export class ConwaysGameOfLife extends CellularAutomata {

  constructor(canvas, gridDimensions) {
    super(canvas, gridDimensions);

    this.colorSettings = {
      0: "white",
      1: "black",
      2: "red",
      3: "blue"
    }
  }

  handleMouse(mouse) {
    let mouseCell = this.getCellFromMousePos(this.canvas.mousePosToCanvas(mouse.mousePos));

    if (mouse.leftClick())
      this.grid.setCell(mouseCell.x, mouseCell.y, 1);
    if (mouse.rightClick())
      this.grid.setCell(mouseCell.x, mouseCell.y, 0);
  }

  handleKeyboard(keyboard) {
    if (keyboard.keysDown["Space"])
      this.simulationSpeed = 1 - this.simulationSpeed;
  }

  updateCells() {
    this.saveGrid()

    for (let x = 0; x < this.grid.width; x++) {
      for (let y = 0; y < this.grid.height; y++) {
        const item = this.grid.getCell(x, y);

        const top = this.grid.getCell(x + 1, y - 1) + this.grid.getCell(x, y - 1) + this.grid.getCell(x - 1, y - 1);
        const mid = this.grid.getCell(x + 1, y) + this.grid.getCell(x - 1, y);
        const bot = this.grid.getCell(x + 1, y + 1) + this.grid.getCell(x, y + 1) + this.grid.getCell(x - 1, y + 1);
        const neighbors = top + mid + bot;

        let result = 0;
        switch (neighbors) {
          case 0, 1, 4:
            result = 0; break;
          case 2:
            result = item; break;
          case 3:
            result = 1; break;
          default:
            result = 0; break;
        }

        this.workingGrid.grid[x][y] = result;

      }
    }

    this.applyGrid();
  }

}