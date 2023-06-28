"use strict";

import { Grid } from "./modules/grid.js";
import { Canvas } from "./modules/canvas.js";

document.body.onload = start;

function start() {
  const canvas = new Canvas();
  const ctx = canvas.canv.getContext("2d")
  ctx.font = "20px Georgia";
  ctx.fillText("Hello World!", 10, 30);
}


// const ctx = canvas.getContext("2d");