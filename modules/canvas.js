"use strict";

export class Canvas {
  
  constructor() {
    
    this.div = document.createElement("div")
    this.canv = document.createElement("canvas")
    this.canv.setAttribute("width", "500")
    this.canv.setAttribute("height", "500")
    this.canv.setAttribute("style", "border: 1px solid black")
    
    this.div.appendChild(this.canv);
    document.body.appendChild(this.div);
  }
  
}
