"use strict";

export class Mouse {

  constructor(canvas) {
    this.canvas = canvas;
    
    this.buttons = [0, 0, 0, 0, 0];
    this.currentPresses = 0;
    this.mousePos = { x: 0, y: 0 };

    this.mouseDown = (event) => {
      ++this.buttons[event.button];
      ++this.currentPresses;
    };

    this.mouseUp = (event) => {
      --this.buttons[event.button];
      --this.currentPresses;
    };

    this.mouseMove = (event) => {
      this.mousePos = {
        x: event.clientX,
        y: event.clientY
      };
        // this.canvas.getMousePos(event);
    };
    
  }

  leftClick() {
    return this.buttons[0];
  }

  rightClick() {
    return this.buttons[2];
  }

  middleClick() {
    return this.buttons[1];
  }

}

export class Keyboard {

  constructor() {
    this.keys = {};
    this.keysDown = {};
    
    this.keyDown = (event) => {
      this.keys[event.code] = true;
      this.keysDown[event.code] = true;
    }

    this.keyUp = (event) => {
      this.keys[event.code] = false;
    }
  }

  updateKeysDown() {
    this.keysDown = {};
  }
  
}