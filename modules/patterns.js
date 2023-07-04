"use strict";

function Point(x, y, value) {
  this.x = x;
  this.y = y;
  this.value = value;
}

export class GameOfLifePatterns {

  constructor(cellularAutomata) {
    this.cellularAutomata = cellularAutomata;
    this.cells = [];
  }

  glider(x, y) {
    this.cells.push(...[
      new Point(x + 1, y + 0, 1),
      new Point(x + 2, y + 1, 1),
      new Point(x + 0, y + 2, 1),
      new Point(x + 1, y + 2, 1),
      new Point(x + 2, y + 2, 1)
    ]);
  }

  gliderSquadron(x, y) {
    this.glider(x + 0, y + 0);
    this.glider(x + 5, y + 0);
    this.glider(x + 10, y + 0);
    this.glider(x + 0, y + 5);
    this.glider(x + 5, y + 5);
    this.glider(x + 10, y + 5);
    this.glider(x + 0, y + 10);
    this.glider(x + 5, y + 10);
    this.glider(x + 10, y + 10);
  }

  gliderChonk(x, y) {
    this.gliderSquadron(x + 0, y + 0);
    this.gliderSquadron(x + 15, y + 0);
    this.gliderSquadron(x + 0, y + 15);
    this.gliderSquadron(x + 15, y + 15);
    this.gliderSquadron(x + 30, y + 30);
    this.gliderSquadron(x + 30, y + 15);
    this.gliderSquadron(x + 30, y + 0);
    this.gliderSquadron(x + 15, y + 30);
    this.gliderSquadron(x + 0, y + 30);
  }

  gliderArmy(x, y) {
    this.gliderChonk(x + 0, y + 0);
    this.gliderChonk(x + 0, y + 45);
    this.gliderChonk(x + 45, y + 0);
    this.gliderChonk(x + 45, y + 45);
  }

  gliderGun(x, y) {
    this.cells.push(
      // Leftmost square
      new Point(x + 1, y + 5, 1),
      new Point(x + 2, y + 5, 1),
      new Point(x + 1, y + 6, 1),
      new Point(x + 2, y + 6, 1),
      // Rightmost square
      new Point(x + 35, y + 3, 1),
      new Point(x + 36, y + 3, 1),
      new Point(x + 35, y + 4, 1),
      new Point(x + 36, y + 4, 1),
      // Left part
      new Point(x + 11, y + 5, 1),
      new Point(x + 11, y + 6, 1),
      new Point(x + 11, y + 7, 1),
      new Point(x + 12, y + 8, 1), // bottom
      new Point(x + 13, y + 9, 1),
      new Point(x + 14, y + 9, 1),
      new Point(x + 12, y + 4, 1), // top
      new Point(x + 13, y + 3, 1),
      new Point(x + 14, y + 3, 1),
      new Point(x + 15, y + 6, 1), // middle of left part
      new Point(x + 17, y + 6, 1),
      new Point(x + 18, y + 6, 1),
      new Point(x + 17, y + 5, 1),
      new Point(x + 17, y + 7, 1),
      new Point(x + 16, y + 4, 1),
      new Point(x + 16, y + 8, 1),
      new Point(x + 17, y + 5, 1),
      new Point(x + 21, y + 5, 1),  // Right part
      new Point(x + 22, y + 5, 1),
      new Point(x + 21, y + 4, 1),
      new Point(x + 22, y + 4, 1),
      new Point(x + 21, y + 3, 1),
      new Point(x + 22, y + 3, 1),
      new Point(x + 23, y + 2, 1),
      new Point(x + 23, y + 6, 1), // Right part of the right part
      new Point(x + 25, y + 2, 1),
      new Point(x + 25, y + 6, 1),
      new Point(x + 25, y + 1, 1),
      new Point(x + 25, y + 7, 1)
    );
  }

  spawn() {
    for (let cell of this.cells) {
      this.cellularAutomata.grid.setCell(cell.x, cell.y, cell.value);
    }
  }

  clear() {
    this.cells = [];
  }

}