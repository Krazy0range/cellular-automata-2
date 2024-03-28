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

    this.EMPTY = 0;
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
        this.grid.setCell(x, y, this.EMPTY);
  }

  mobileGridPlacement() { }

  offload() { }

  reload() {
    this.reloadButtons();
    this.reloadInfo();
    this.reloadSpecificButtons();
  }

  reloadButtons() {
    this.clearBtn.onclick = (event) => {
      this.resetGrid();
    }
    this.stepBtn.onclick = (event) => {
      this.updateCells();
    }
    this.reloadSpecificButtons()
  }
  reloadInfo() { }
  reloadSpecificButtons() { }
  
  update() {
    this.updateDebug();
    for (let i = 0; i < this.simulationSpeed; i++)
      this.updateCells();
  }
  
  updateDebug() {
    const simulationSpeedDebug = this.simulationSpeedDebug();
    this.debug.innerHTML = simulationSpeedDebug;
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

    this.reloadInfo();
    this.reloadButtons();
  }

  reloadInfo() {
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
  }

  reloadSpecificButtons() {
    if (!document.getElementById("clearelectronsbtn")) {
      this.clearElectronsBtn = document.createElement("button");
      this.clearElectronsBtn.id = "clearelectronsbtn"
      this.clearElectronsBtn.innerText = "Clear Electrons";
      this.clearElectronsBtn.onclick = (event) => {
        this.clearElectrons();
      }
      this.buttons.appendChild(this.clearElectronsBtn);
    }
  }

  offload() {
    const btn = document.getElementById("clearelectronsbtn");
    btn.remove();
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

        this.workingGrid.setCell(x, y, result);

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

    this.reloadInfo();
  }

  reloadInfo() {
    this.instructions.innerHTML = `
    <b>Instructions</b>
    <p>
      Left click to draw living cells. Right click to draw dead cells.
      Press space to play/pause the simulation.
    </p>
    <b>Rules</b>
    <p>
      A dead cell becomes alive if it has by 3 living neighbors.
      A living cell persists if it is surrounded by 2 or 3 other living cells.
      A cell dies if it has less than 2 or greater than 3 living neighbors.
    </p>
    `;
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

export class Computer extends CellularAutomata {

  constructor(canvas, gridDimensions) {
    super(canvas, gridDimensions);

    this.EMPTY = 0;
    this.WIRE = 1;
    this.ELECTRON = 2;
    this.ELECTRONTAIL = 3;
    this.ANDGATE = 4;
    this.ORGATE = 5;
    this.NOTGATE = 6;
    this.XORGATE = 7;
    this.CROSSWIRE = 9;
    this.CROSSWIRE_ELECTRON_VERTICAL = 10;
    this.CROSSWIRE_ELECTRON_HORIZONTAL = 11;
    this.CROSSWIRE_ELECTRON_BOTH = 12;
    this.CROSSWIRE_ELECTRONTAIL_VERTICAL = 13;
    this.CROSSWIRE_ELECTRONTAIL_HORIZONTAL = 14;
    this.CROSSWIRE_ELECTRONTAIL_BOTH = 15;
    this.CROSSWIRE_ELECTRON_HORIZONTAL_ELECTRONTAIL_VERTICAL = 16;
    this.CROSSWIRE_ELECTRON_VERTICAL_ELECTRONTAIL_HORIZONTAL = 17;

    this.colorSettings = {
      0: "white",
      1: "black",
      2: "orange",
      3: "yellow",
      4: "red",
      5: "green",
      6: "blue",
      7: "purple",
      9: "gray",
      10: "orange",
      11: "orange",
      12: "orange",
      13: "yellow",
      14: "yellow",
      15: "yellow",
      16: "gold",
      17: "gold"
    };

    this.reloadInfo();
    this.reloadButtons();
  }

  reloadInfo() {
    this.instructions.innerHTML = `
    <b>Instructions</b>
    <p>
      Left click to draw, right click to clear.
      Press space to play/pause the simulation.<br>
      Button | Cell<br>
      0      | EMPTY<br>
      1      | WIRE<br>
      2      | ELECTRON<br>
      3      | ELECTRON TAIL<br>
      4      | AND GATE<br>
      5      | OR GATE<br>
      6      | NOT GATE<br>
      7      | XOR GATE<br>
      9      | CROSSWIRE<br>
    </p>
    <b>Rules</b>
    <p>
      Empty cells do not change.
      Wire cells become a electron cell if it has 1 or 2 neighboring electrons.
      Electrons become electron tails, and electron tails become a wire cell.
      Gates are in development lol
    </p>
    `;
  }
  
  reloadSpecificButtons() {
    if (!document.getElementById("clearelectronsbtn")) {
      this.clearElectronsBtn = document.createElement("button");
      this.clearElectronsBtn.id = "clearelectronsbtn"
      this.clearElectronsBtn.innerText = "Clear Electrons";
      this.clearElectronsBtn.onclick = (event) => {
        this.clearElectrons();
      }
      this.buttons.appendChild(this.clearElectronsBtn);
    }
  }

  offload() {
    const btn = document.getElementById("clearelectronsbtn");
    if (btn)
      btn.remove();
  }
  
  clearElectrons() {
    for (let x = 0; x < this.grid.width; x++) {
      for (let y = 0; y < this.grid.height; y++) {
        const cell = this.grid.getCell(x, y);
        const isElectron = cell == this.ELECTRON
                        || cell == this.ELECTRONTAIL
                        || cell == this.CROSSWIRE_ELECTRON_VERTICAL
                        || cell == this.CROSSWIRE_ELECTRON_HORIZONTAL
                        || cell == this.CROSSWIRE_ELECTRON_BOTH
                        || cell == this.CROSSWIRE_ELECTRONTAIL_VERTICAL
                        || cell == this.CROSSWIRE_ELECTRONTAIL_HORIZONTAL
                        || cell == this.CROSSWIRE_ELECTRONTAIL_BOTH
                        || cell == this.CROSSWIRE_ELECTRON_VERTICAL_ELECTRONTAIL_HORIZONTAL
                        || cell == this.CROSSWIRE_ELECTRON_HORIZONTAL_ELECTRONTAIL_VERTICAL;
        const isCrosswire = cell == this.CROSSWIRE
                         || cell == this.CROSSWIRE_ELECTRON_VERTICAL
                         || cell == this.CROSSWIRE_ELECTRON_HORIZONTAL
                         || cell == this.CROSSWIRE_ELECTRON_BOTH
                         || cell == this.CROSSWIRE_ELECTRONTAIL_VERTICAL
                         || cell == this.CROSSWIRE_ELECTRONTAIL_HORIZONTAL
                         || cell == this.CROSSWIRE_ELECTRONTAIL_BOTH
                         || cell == this.CROSSWIRE_ELECTRON_VERTICAL_ELECTRONTAIL_HORIZONTAL
                         || cell == this.CROSSWIRE_ELECTRON_HORIZONTAL_ELECTRONTAIL_VERTICAL;
        if (isElectron)
          if (isCrosswire)
            this.grid.setCell(x, y, this.CROSSWIRE);
          else
            this.grid.setCell(x, y, this.WIRE);
      }
    }
  }

  handleMouse(mouse) {
    let mouseCell = this.getCellFromMousePos(this.canvas.mousePosToCanvas(mouse.mousePos));

    if (mouse.leftClick())
      this.grid.setCell(mouseCell.x, mouseCell.y, this.currentInputCell);
    if (mouse.rightClick())
      this.grid.setCell(mouseCell.x, mouseCell.y, 0);
    if (mouse.middleClick())
      console.log(this.grid.getCell(mouseCell.x, mouseCell.y))
  }
  
  handleKeyboard(keyboard) {
    if (keyboard.keys["Digit0"])
      this.currentInputCell = 0;
    if (keyboard.keys["Digit1"])
      this.currentInputCell = 1;
    if (keyboard.keys["Digit2"])
      this.currentInputCell = 2;
    if (keyboard.keys["Digit3"])
      this.currentInputCell = 3;
    if (keyboard.keys["Digit4"])
      this.currentInputCell = 4;
    if (keyboard.keys["Digit5"])
      this.currentInputCell = 5;
    if (keyboard.keys["Digit6"])
      this.currentInputCell = 6;
    if (keyboard.keys["Digit7"])
      this.currentInputCell = 7;
    if (keyboard.keys["Digit9"])
      this.currentInputCell = 9;
    if (keyboard.keysDown["Space"])
      this.simulationSpeed = 1 - this.simulationSpeed;
  }

  updateCells() {
    this.saveGrid();

    for (let x = 0; x < this.grid.width; x++) {
      for (let y = 0; y < this.grid.height; y++) {
        const item = this.grid.getCell(x, y);

        let result = 0;

        switch (item) {
          case this.EMPTY:
            result = 0;
            break;
          case this.WIRE:
            result = this.evalWireCell(x, y);
            break;
          case this.CROSSWIRE:
            result = this.evalCrosswireCell(x, y);
            break;
          case this.ELECTRON:
            result = this.evalElectronCell(x, y);
            break;
          case this.CROSSWIRE_ELECTRON_VERTICAL:
            result = this.evalCrosswireElectronVerticalCell(x, y);
            break;
          case this.CROSSWIRE_ELECTRON_HORIZONTAL:
            result = this.evalCrosswireElectronHorizontalCell(x, y);
            break;
          case this.CROSSWIRE_ELECTRON_BOTH:
            result = this.evalCrosswireElectronBothCell(x, y);
            break;
          case this.ELECTRONTAIL:
            result = this.WIRE;
            break;
          case this.CROSSWIRE_ELECTRONTAIL_VERTICAL:
            result = this.CROSSWIRE;
            break;
          case this.CROSSWIRE_ELECTRONTAIL_HORIZONTAL:
            result = this.CROSSWIRE;
            break;
          case this.CROSSWIRE_ELECTRONTAIL_BOTH:
            result = this.CROSSWIRE;
            break;
          case this.CROSSWIRE_ELECTRON_HORIZONTAL_ELECTRONTAIL_VERTICAL:
            result = this.CROSSWIRE_ELECTRON_HORIZONTAL;
            break;
          case this.CROSSWIRE_ELECTRON_VERTICAL_ELECTRONTAIL_HORIZONTAL:
            result = this.CROSSWIRE_ELECTRON_VERTICAL;
            break;
          default:
            result = item;
            break;
        }

        this.workingGrid.setCell(x, y, result);

      }
    }

    this.applyGrid();
  }

  evalElectronCell(x, y) {
    const neighbors = [
      this.grid.getCell(x + 1, y),
      this.grid.getCell(x - 1, y),
      this.grid.getCell(x, y + 1),
      this.grid.getCell(x, y - 1)
    ];
    const verticalNeighbors = [
      this.grid.getCell(x, y + 1),
      this.grid.getCell(x, y - 1)
    ];
    const horizontalNeighbors = [
      this.grid.getCell(x + 1, y),
      this.grid.getCell(x - 1, y)
    ];
    
    const electronTails = count(neighbors, this.ELECTRONTAIL)
                        + count(verticalNeighbors, this.CROSSWIRE_ELECTRONTAIL_VERTICAL)
                        + count(horizontalNeighbors, this.CROSSWIRE_ELECTRONTAIL_HORIZONTAL)
                        + count(verticalNeighbors, this.CROSSWIRE_ELECTRON_HORIZONTAL_ELECTRONTAIL_VERTICAL)
                        + count(horizontalNeighbors, this.CROSSWIRE_ELECTRON_VERTICAL_ELECTRONTAIL_HORIZONTAL)
                        + count(neighbors, this.CROSSWIRE_ELECTRONTAIL_BOTH);

    if (this.isGateCell(x - 1, y))
      if (!this.evalGateCell(x, y))
        return this.ELECTRONTAIL;
    
    if (electronTails > 0)
      return this.ELECTRONTAIL;
    else
      return this.ELECTRON;
  }

  evalCrosswireElectronVerticalCell(x, y) {
    const verticalNeighbors = [
      this.grid.getCell(x, y + 1),
      this.grid.getCell(x, y - 1)
    ];
    const verticalElectronTails = count(verticalNeighbors, this.ELECTRONTAIL);
    if (verticalElectronTails > 0)
      return this.CROSSWIRE_ELECTRONTAIL_VERTICAL;

    const horizontalNeighbors = [
      this.grid.getCell(x + 1, y),
      this.grid.getCell(x - 1, y)
    ];
    const horizontalElectrons = count(horizontalNeighbors, this.ELECTRON);
    if (horizontalElectrons > 0)
      return this.CROSSWIRE_ELECTRON_BOTH;
    
    return this.CROSSWIRE_ELECTRON_VERTICAL;
  }

  evalCrosswireElectronHorizontalCell(x, y) {
    const horizontalNeighbors = [
      this.grid.getCell(x + 1, y),
      this.grid.getCell(x - 1, y)
    ];
    const horizontalElectronTails = count(horizontalNeighbors, this.ELECTRONTAIL)
    if (horizontalElectronTails > 0)
      return this.CROSSWIRE_ELECTRONTAIL_HORIZONTAL;


    const verticalNeighbors = [
      this.grid.getCell(x, y + 1),
      this.grid.getCell(x, y - 1)
    ];
    const verticalElectrons = count(verticalNeighbors, this.ELECTRON);
    if (verticalElectrons > 0)
      return this.CROSSWIRE_ELECTRON_BOTH;

    return this.CROSSWIRE_ELECTRON_HORIZONTAL;
  }

  evalCrosswireElectronBothCell(x, y) {
    const verticalNeighbors = [
      this.grid.getCell(x, y + 1),
      this.grid.getCell(x, y - 1)
    ];
    const horizontalNeighbors = [
      this.grid.getCell(x + 1, y),
      this.grid.getCell(x - 1, y)
    ];

    const verticalElectronTails = count(verticalNeighbors, this.ELECTRONTAIL);
    const horizontalElectronTails = count(horizontalNeighbors, this.ELECTRONTAIL);

    if (verticalElectronTails > 0 && horizontalElectronTails > 0)
      return this.CROSSWIRE_ELECTRONTAIL_BOTH;

    if (verticalElectronTails > 0)
      return this.CROSSWIRE_ELECTRON_HORIZONTAL_ELECTRONTAIL_VERTICAL;

    if (horizontalElectronTails > 0)
      return this.CROSSWIRE_ELECTRON_VERTICAL_ELECTRONTAIL_HORIZONTAL;

    return this.CROSSWIRE_ELECTRON_BOTH;
  }

  evalWireCell(x, y) {
    const neighbors = [
      this.grid.getCell(x + 1, y),
      this.grid.getCell(x - 1, y),
      this.grid.getCell(x, y + 1),
      this.grid.getCell(x, y - 1)
    ];
    const verticalNeighbors = [
      this.grid.getCell(x, y + 1),
      this.grid.getCell(x, y - 1)
    ];
    const horizontalNeighbors = [
      this.grid.getCell(x + 1, y),
      this.grid.getCell(x - 1, y)
    ];

    const surroundingElectrons = count(neighbors, this.ELECTRON)
                               + count(verticalNeighbors, this.CROSSWIRE_ELECTRON_VERTICAL)
                               + count(horizontalNeighbors, this.CROSSWIRE_ELECTRON_HORIZONTAL)
                               + count(neighbors, this.CROSSWIRE_ELECTRON_BOTH);

    if (surroundingElectrons > 0)
      return this.ELECTRON;
    
    if (this.evalGateCell(x, y))
      return this.ELECTRON;

    return this.WIRE;
  }

  isGateCell(x, y) {
    const cell = this.grid.getCell(x, y);
    const isGate = cell == this.ANDGATE || cell == this.ORGATE || cell == this.NOTGATE || cell == this.XORGATE;
    return isGate;
  }

  evalGateCell(x, y) {
    const gateCell = this.grid.getCell(x - 1, y);
    const inputA = this.grid.getCell(x - 2, y);
    const inputB = this.grid.getCell(x - 1, y - 1);
    const and = this.ANDGATE;
    const or = this.ORGATE;
    const not = this.NOTGATE;
    const xor = this.XORGATE;
    const one = this.ELECTRON;

    if (!this.isGateCell(x - 1, y))
      return false;
    
    if (gateCell == and && inputA == one && inputB == one)
      return true;
    
    if (gateCell == or && (inputA == one || inputB == one))
      return true;

    if (gateCell == not && inputA != one)
      return true;
    
    if (gateCell == xor && (inputA == one || inputB == one) && !(inputA == one && inputB == one))
      return true;

    return false;
  }

  evalCrosswireCell(x, y) {
    const vertical = this.grid.getCell(x, y + 1) == this.ELECTRON || this.grid.getCell(x, y - 1) == this.ELECTRON;
    const horizontal = this.grid.getCell(x + 1, y) == this.ELECTRON || this.grid.getCell(x - 1, y) == this.ELECTRON;

    if (vertical && horizontal)
      return this.CROSSWIRE_ELECTRON_BOTH;
    else if (vertical)
      return this.CROSSWIRE_ELECTRON_VERTICAL;
    else if (horizontal)
      return this.CROSSWIRE_ELECTRON_HORIZONTAL;
    else
      return this.CROSSWIRE;
  }
}