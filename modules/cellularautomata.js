"use strict";

import { Grid } from "./grid.js";

function count(array, value) {
  let count = 0;
  array.forEach((element) => {
    if (element == value)
      count++;
  });
  return count;
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

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
    };

    this.colorFunc = (item) => {
      return this.colorSettings[item];
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
      0: "white",
      1: "black",
      2: "orange",
      3: "yellow"
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
      Idk figure it out lol
    </p>
    `;
  }

  reloadSpecificButtons() {
    if (!document.getElementById("clearelectronsbtn")) {
      this.clearElectronsBtn = document.createElement("button");
      this.clearElectronsBtn.id = "clearelectronsbtn";
      this.clearElectronsBtn.innerText = "Clear Electrons";
      this.clearElectronsBtn.onclick = (event) => {
        this.clearElectrons();
      }
      this.buttons.appendChild(this.clearElectronsBtn);
    }
    if (!document.getElementById("randomwiresbtn")) {
      this.randomWiresBtn = document.createElement("button");
      this.randomWiresBtn.id = "randomwiresbtn";
      this.randomWiresBtn.innerText = "Random Wires";
      this.randomWiresBtn.onclick = (event) => {
        this.randomWires();
      }
      this.buttons.appendChild(this.randomWiresBtn);
    }
  }

  offload() {
    const clearElectronsBtn = document.getElementById("clearelectronsbtn");
    const randomWiresBtn = document.getElementById("randomwiresbtn");
    if (clearElectronsBtn) clearElectronsBtn.remove();
    if (randomWiresBtn) randomWiresBtn.remove();
  }

  randomWires() {
    for (let x = 0; x < this.grid.width; x++) {
      for (let y = 0; y < this.grid.height; y++) {
        if (Math.random() < 0.75) {
          this.grid.setCell(x, y, this.WIRE);
        }
      }
    }
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
            result = this.evalCrosswireElectronTailVerticalCell(x, y);
            // result = this.CROSSWIRE;
            break;
          case this.CROSSWIRE_ELECTRONTAIL_HORIZONTAL:
            result = this.evalCrosswireElectronTailHorizontalCell(x, y);
            // result = this.CROSSWIRE;
            break;
          case this.CROSSWIRE_ELECTRONTAIL_BOTH:
            result = this.CROSSWIRE;
            break;
          case this.CROSSWIRE_ELECTRON_HORIZONTAL_ELECTRONTAIL_VERTICAL:
            result = this.evalCrosswireElectronHorizontalElectrontailVerticalCell(x, y); // TODO: fix when there is another electron tail coming right after it
            break;                                                                       //
          case this.CROSSWIRE_ELECTRON_VERTICAL_ELECTRONTAIL_HORIZONTAL:                 //
            result = this.evalCrosswireElectronVerticalElectrontailHorizontalCell(x, y); //
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
    const verticalElectronTails = count(verticalNeighbors, this.ELECTRONTAIL)
                                + count(verticalNeighbors, this.CROSSWIRE_ELECTRONTAIL_VERTICAL)
                                + count(verticalNeighbors, this.CROSSWIRE_ELECTRON_HORIZONTAL_ELECTRONTAIL_VERTICAL)
                                + count(verticalNeighbors, this.CROSSWIRE_ELECTRONTAIL_BOTH);
    if (verticalElectronTails > 0)
      return this.CROSSWIRE_ELECTRONTAIL_VERTICAL;

    const horizontalNeighbors = [
      this.grid.getCell(x + 1, y),
      this.grid.getCell(x - 1, y)
    ];
    const horizontalElectrons = count(horizontalNeighbors, this.ELECTRON)
                              + count(horizontalNeighbors, this.CROSSWIRE_ELECTRON_HORIZONTAL)
                              + count(horizontalNeighbors, this.CROSSWIRE_ELECTRON_BOTH)
                              + count(horizontalNeighbors, this.CROSSWIRE_ELECTRON_HORIZONTAL_ELECTRONTAIL_VERTICAL);
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
                                  + count(horizontalNeighbors, this.CROSSWIRE_ELECTRONTAIL_HORIZONTAL)
                                  + count(horizontalNeighbors, this.CROSSWIRE_ELECTRON_VERTICAL_ELECTRONTAIL_HORIZONTAL)
                                  + count(horizontalNeighbors, this.CROSSWIRE_ELECTRONTAIL_BOTH);
    if (horizontalElectronTails > 0)
      return this.CROSSWIRE_ELECTRONTAIL_HORIZONTAL;


    const verticalNeighbors = [
      this.grid.getCell(x, y + 1),
      this.grid.getCell(x, y - 1)
    ];
    const verticalElectrons = count(verticalNeighbors, this.ELECTRON)
                            + count(verticalNeighbors, this.CROSSWIRE_ELECTRON_VERTICAL)
                            + count(verticalNeighbors, this.CROSSWIRE_ELECTRON_BOTH)
                            + count(verticalNeighbors, this.CROSSWIRE_ELECTRON_VERTICAL_ELECTRONTAIL_HORIZONTAL);
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

    const verticalElectronTails = count(verticalNeighbors, this.ELECTRONTAIL)
                                + count(verticalNeighbors, this.CROSSWIRE_ELECTRONTAIL_VERTICAL)
                                + count(verticalNeighbors, this.CROSSWIRE_ELECTRON_HORIZONTAL_ELECTRONTAIL_VERTICAL)
                                + count(verticalNeighbors, this.CROSSWIRE_ELECTRONTAIL_BOTH);
    const horizontalElectronTails = count(horizontalNeighbors, this.ELECTRONTAIL)
                                  + count(horizontalNeighbors, this.CROSSWIRE_ELECTRONTAIL_HORIZONTAL)
                                  + count(horizontalNeighbors, this.CROSSWIRE_ELECTRON_VERTICAL_ELECTRONTAIL_HORIZONTAL)
                                  + count(horizontalNeighbors, this.CROSSWIRE_ELECTRONTAIL_BOTH);

    if (verticalElectronTails > 0 && horizontalElectronTails > 0)
      return this.CROSSWIRE_ELECTRONTAIL_BOTH;

    if (verticalElectronTails > 0)
      return this.CROSSWIRE_ELECTRON_HORIZONTAL_ELECTRONTAIL_VERTICAL;

    if (horizontalElectronTails > 0)
      return this.CROSSWIRE_ELECTRON_VERTICAL_ELECTRONTAIL_HORIZONTAL;

    return this.CROSSWIRE_ELECTRON_BOTH;
  }

  evalCrosswireElectronTailVerticalCell(x, y) {
    const horizontalNeighbors = [
      this.grid.getCell(x + 1, y),
      this.grid.getCell(x - 1, y)
    ];

    const horizontalElectrons = count(horizontalNeighbors, this.ELECTRON)
                     + count(horizontalNeighbors, this.CROSSWIRE_ELECTRON_HORIZONTAL)
                     + count(horizontalNeighbors, this.CROSSWIRE_ELECTRON_HORIZONTAL_ELECTRONTAIL_VERTICAL)
                     + count(horizontalNeighbors, this.CROSSWIRE_ELECTRON_BOTH);

    if (horizontalElectrons > 0)
      return this.CROSSWIRE_ELECTRON_HORIZONTAL;
    else
      return this.CROSSWIRE;
  }

  evalCrosswireElectronTailHorizontalCell(x, y) {
    const verticalNeighbors = [
      this.grid.getCell(x, y + 1),
      this.grid.getCell(x, y - 1)
    ];

    const verticalElectrons = count(verticalNeighbors, this.ELECTRON)
                   + count(verticalNeighbors, this.CROSSWIRE_ELECTRON_VERTICAL)
                   + count(verticalNeighbors, this.CROSSWIRE_ELECTRON_VERTICAL_ELECTRONTAIL_HORIZONTAL)
                   + count(verticalNeighbors, this.CROSSWIRE_ELECTRON_BOTH);

    if (verticalElectrons > 0)
      return this.CROSSWIRE_ELECTRON_VERTICAL;
    else
      return this.CROSSWIRE;
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

    if (gateCell == not && inputA == one)
      return false;

    if (gateCell == not && inputA != one)
      return true;
    
    if (gateCell == xor && (inputA == one || inputB == one) && !(inputA == one && inputB == one))
      return true;

    return false;
  }

  evalCrosswireCell(x, y) {
    const verticalNeighbors = [
      this.grid.getCell(x, y + 1),
      this.grid.getCell(x, y - 1)
    ];
    const horizontalNeighbors = [
      this.grid.getCell(x + 1, y),
      this.grid.getCell(x - 1, y)
    ];
    // const vertical = this.grid.getCell(x, y + 1) == this.ELECTRON || this.grid.getCell(x, y - 1) == this.ELECTRON;
    // const horizontal = this.grid.getCell(x + 1, y) == this.ELECTRON || this.grid.getCell(x - 1, y) == this.ELECTRON;
    const verticalElectrons = count(verticalNeighbors, this.ELECTRON)
                   + count(verticalNeighbors, this.CROSSWIRE_ELECTRON_VERTICAL)
                   + count(verticalNeighbors, this.CROSSWIRE_ELECTRON_VERTICAL_ELECTRONTAIL_HORIZONTAL)
                   + count(verticalNeighbors, this.CROSSWIRE_ELECTRON_BOTH);
    const horizontalElectrons = count(horizontalNeighbors, this.ELECTRON)
                     + count(horizontalNeighbors, this.CROSSWIRE_ELECTRON_HORIZONTAL)
                     + count(horizontalNeighbors, this.CROSSWIRE_ELECTRON_HORIZONTAL_ELECTRONTAIL_VERTICAL)
                     + count(horizontalNeighbors, this.CROSSWIRE_ELECTRON_BOTH);

    const vertical = verticalElectrons > 0;
    const horizontal = horizontalElectrons > 0;

    if (vertical && horizontal)
      return this.CROSSWIRE_ELECTRON_BOTH;
    else if (vertical)
      return this.CROSSWIRE_ELECTRON_VERTICAL;
    else if (horizontal)
      return this.CROSSWIRE_ELECTRON_HORIZONTAL;
    else
      return this.CROSSWIRE;
  }

  evalCrosswireElectronHorizontalElectrontailVerticalCell(x, y) {
    const horizontalNeighbors = [
      this.grid.getCell(x + 1, y),
      this.grid.getCell(x - 1, y)
    ];

    const horizontalElectrontails = count(horizontalNeighbors, this.ELECTRONTAIL)

    if (horizontalElectrontails > 0)
      return this.CROSSWIRE_ELECTRONTAIL_HORIZONTAL;
    else
      return this.CROSSWIRE_ELECTRON_HORIZONTAL;
  }

  evalCrosswireElectronVerticalElectrontailHorizontalCell(x, y) {
    const verticalNeighbors = [
      this.grid.getCell(x, y + 1),
      this.grid.getCell(x, y - 1)
    ];

    const verticalElectrontails = count(verticalNeighbors, this.ELECTRONTAIL);

    if (verticalElectrontails > 0)
      return this.CROSSWIRE_ELECTRONTAIL_VERTICAL;
    else
      return this.CROSSWIRE_ELECTRON_VERTICAL;
  }

}

export class Poggers extends CellularAutomata {

  constructor(canvas, gridDimensions) {
    super(canvas, gridDimensions);

    this.EMPTY = {x: 0, vx: 0, vy: 0};
    this.FULL = {x: 1, vx: 0, vy: 0};

    /*
      particle properties:
        d - density
        vx - velocity x
        vy - velocity y
      particles:
        a b
      cell:
        ad avx avy
        bd bvx bvy
      interaction:
        a and b repulse eachother
      theory:
        two parts: movement and magnetism
        movement:
          density distributed by velocity to neighboring cells
            v: (1, 0) d: 1 would transfer 1 to the cell to the right
            use sin and cos to distribute velocity
            fuck i cant think

        density over 1 is distributed to surrounding cells
        density is transferred in the direction of the velocity to surrounding cells
          v(1, 0.5)
        anti alias the pixel

        think of the cell as a pixel with d brightness and vx vy velocity
        move the pixel the velocity distance and antialias the density

        TODO: make antialias function

        FIGURE THIS OUT IG
    */

    this.colorFunc = (item) => {
      let r = (1) * 255;
      let g = (1 - item.x) * 255;
      let b = (1 - item.x) * 255;
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }

    this.resetGrid();

    this.reloadInfo();
  }

  reloadInfo() {
    this.instructions.innerHTML = `
      much pog
    `
  }

  handleMouse(mouse) {
    let mouseCell = this.getCellFromMousePos(this.canvas.mousePosToCanvas(mouse.mousePos));

    let cell = this.grid.getCell(mouseCell.x, mouseCell.y);

    if (mouse.leftClick())
      this.grid.setCell(mouseCell.x, mouseCell.y, {...cell, x: 1});
    if (mouse.rightClick())
      this.grid.setCell(mouseCell.x, mouseCell.y, {...cell, x: 1, vx: 1, vy: 0.1});
    if (mouse.middleClick())
      console.log(cell);
  }

  handleKeyboard(keyboard) {
    if (keyboard.keysDown["Space"])
      this.simulationSpeed = 1 - this.simulationSpeed;
  }

  updateCells() {
    this.saveGrid()

    for (let x = 0; x < this.grid.width; x++) {
      for (let y = 0; y < this.grid.height; y++) {
        const cell = this.grid.getCell(x, y);
        // const result = { ...cell };

        // [
        //   {x: x + 1, y: y},
        //   {x: x - 1, y: y},
        //   {x: x, y: y + 1},
        //   {x: x, y: y - 1},
        //   {x: x + 1, y: y + 1},
        //   {x: x + 1, y: y - 1},
        //   {x: x - 1, y: y + 1},
        //   {x: x - 1, y: y - 1}
        // ]

        // this.workingGrid.setCell(x, y, result);

        // this.workingGrid.setCell(x, y, this.EMPTY);

        this.antiAliasPoint(x + cell.vx, y + cell.vy, cell);

        const clamped = {...this.grid.getCell(x, y)};

        clamped.x = clamp(cell.x, 0, 1);
        clamped.vx = clamp(cell.vx, -1, 1);
        clamped.vy = clamp(cell.vy, -1, 1);

        this.workingGrid.setCell(x, y, clamped);

      }
    }

    this.applyGrid();
  }

  antiAliasPoint(x, y, cell) {
    for (let _x = Math.floor(x); _x <= Math.ceil(x); _x++) {
      for (let _y = Math.floor(y); _y <= Math.ceil(y); _y++) {
        const px = 1 - Math.abs(x - _x);
        const py = 1 - Math.abs(y - _y);
        const p = px * py;
        const _cell = this.grid.getCell(_x, _y);
        if (_cell == 0)
          continue;
        _cell.x += cell.x * p;
        _cell.vx += cell.vx * p;
        _cell.vy += cell.vy * p;
        this.workingGrid.setCell(_x, _y, _cell);
      }
    }
  }

}