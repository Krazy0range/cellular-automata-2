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
    this.gridDimensions = gridDimensions;
    this.grid = new Grid(this.gridDimensions.width, this.gridDimensions.height, 0);
    this.workingGrid = new Grid(this.gridDimensions.width, this.gridDimensions.height, 0);

    this.currentInputCell = 1;
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


  update() {
    this.updateDebug();
    for (let i = 0; i < this.simulationSpeed; i++)
      this.updateCells();
  }

  updateDebug() {
    const simulationSpeedDebug = `simulationSpeed = ${this.simulationSpeed};`;
    this.debug.innerHTML = simulationSpeedDebug;
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

export class Ultimata extends CellularAutomata {

  constructor(canvas, gridDimensions) {
    super(canvas, gridDimensions);

    this.EMPTY = 0;
    this.NUCLEUS = 1;
    this.DENDRITE = 2;
    this.AXON = 3;

    this.colorSettings = {
      0: "dimgray",
      1: "blue",
      2: "red",
      3: "orange"
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
      this.currentInputCell = 1;
    if (keyboard.keys["Digit2"])
      this.currentInputCell = 2;
    if (keyboard.keys["Digit3"])
      this.currentInputCell = 3;
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

        const item = this.grid.getCell(x, y);

        switch (item) {

        }

      }
    }

    this.applyGrid();
  }

  evalPlantCell(x, y) {
    const neighbors = this.getNeighbors(x, y);

    const foodCells = neighbors.normal.filter(cell => this.grid.getCell(...cell) == this.FOOD);
    const foodFound = foodCells.length != 0;

    if (foodFound) {
      this.workingGrid.setCell(x, y, this.FOODPROP);
      foodCells.forEach(cell => {
        this.workingGrid.setCell(...cell, this.EMPTY);
      });
    }
  }

  evalFoodPropCell(x, y) {
    const neighbors = this.getNeighbors(x, y);

    const plantCells = neighbors.normal.filter(cell => this.grid.getCell(...cell) == this.PLANT);

    plantCells.forEach(cell => {
      this.workingGrid.setCell(...cell, this.FOODPROP);
    });
    this.workingGrid.setCell(x, y, this.FOODPROPTAIL);
  }

  evalFoodPropTailCell(x, y) {
    const neighbors = this.getNeighbors(x, y);
    neighbors.moore.forEach(cell => {
      this.workingGrid.setCell(...cell, this.PLANT);
    });
    this.workingGrid.setCell(x, y, this.PLANT);
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