"use strict";

export class Mouse {

  constructor(canvas) {
    this.canvas = canvas;
    console.log(this.canvas);
    
    this.buttons = [0, 0, 0, 0, 0];
    this.currentPresses = 0;
    this.mousePos = { x: 0, y: 0 };

    this.leftClick = function() {
      return this.buttons[0];
    }

    this.mouseDown = (event) => {
      ++this.buttons[event.button];
      ++this.currentPresses;
    };

    this.mouseUp = (event) => {
      --this.buttons[event.button];
      --this.currentPresses;
    };

    this.mouseMove = (event) => {
      this.mousePos = this.canvas.getMousePos(event);
    };
    
  } 

  // mouseDown(event) {
  //   ++this.buttons[event.button];
  //   ++this.currentPresses;
  // }

  // mouseUp(event) {
  //   --this.buttons[event.button];
  //   --this.currentPresses;
  // }

}