'use strict';

let buffer = {};
let split = [];
let p1 = document.getElementById("p1");
let p2 = document.getElementById("p2");
let canvas1 = document.getElementById('circle1');
let canvas2 = document.getElementById('circle2');
let context1 = canvas1.getContext("2d");
let context2 = canvas2.getContext("2d");
let arcInfo = [];
let c1 = new Path2D();
let c2 = new Path2D();

function addClick1(e) {
  if (checkInCircle(e.targetTouches[0].clientX, e.targetTouches[0].clientY, arcInfo[0])) {
    buffer["p1"] = true;
  }
}

function addClick2(e) {
  if (checkInCircle(e.targetTouches[0].clientX, e.targetTouches[0].clientY-canvas1.height, arcInfo[1])) {
    buffer["p2"] = true;
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function calculateArc(domRect) {
  let width = domRect['width'];
  let height = domRect['height'];
  let x = getRandomInt(80, width-80);
  let y = getRandomInt(80, height-80);
  let r = Math.sqrt(1/(height/2000))*40;
  return [x, y, r];
}

function drawCircle1() {
  let arc = arcInfo[0];
  context1.clearRect(0, 0, canvas1.width, canvas1.height);
  c1 = new Path2D();
  c1.arc(arc[0], arc[1], arc[2], 0, 2*Math.PI);
  context1.fill(c1);
}

function drawCircle2() {
  let arc = arcInfo[1];
  context2.clearRect(0, 0, canvas2.width, canvas2.height);
  c2 = new Path2D();
  c2.arc(arc[0], arc[1], arc[2], 0, 2*Math.PI);
  c2.fillStyle= 'green';
  context2.fill(c2);
}

function checkInCircle(x, y, arc) {
  if ((Math.pow(x-arc[0], 2) + Math.pow(y-arc[1], 2)) < (Math.pow(arc[2], 2))) {
    return true;
  }
  return false;
}

function intitialize() {
  split = [50, 50];
  let domRect1 = p1.getBoundingClientRect();
  let domRect2 = p2.getBoundingClientRect();
  context1.height = domRect1["height"];
  context1.width = domRect1["width"];
  context2.height = domRect2["height"];
  context2.width = domRect2["width"];
  canvas1.height = domRect1["height"];
  canvas1.width = domRect1["width"];
  canvas2.height = domRect2["height"];
  canvas2.width = domRect2["width"];
  arcInfo[0] = calculateArc(domRect1);
  arcInfo[1] = calculateArc(domRect2);
  drawCircle1();
  drawCircle2();
  buffer = {"p1": false, "p2": false};
  canvas1.addEventListener('touchstart', addClick1);
  canvas2.addEventListener('touchstart', addClick2);
  gameLoop(performance.now());
}

function gameLoop() {
  let input = getInput();
  let end = false;
  split, end = update(input);
  render();
  if (!end) {
    requestAnimationFrame(gameLoop);
  }
  else {
    intitialize();
  }
}

function getInput() {
  let input = [0, 0];
  let diff = 4;
  if (buffer["p1"]) {
    input[0] = diff;
  }
  if (buffer["p2"]) {
    input[1] = diff;  
  }
  buffer = {"p1": false, "p2": false};
  return input;
}

function update(input) {
  if (input[0] || input[1]) {
    let domRect1 = p1.getBoundingClientRect();
    arcInfo[0] = calculateArc(domRect1);
    let domRect2 = p2.getBoundingClientRect();
    arcInfo[1] = calculateArc(domRect2);
  }
  split[0] = split[0] + input[0] - input[1];
  split[1] = split[1] + input[1] - input[0];
  if (split[0] < 10 || split[1] < 10) {
    return split, true;
  }
  return split, false;
}

function render() {
  p1.style.height = "" + split[0] + "vh";
  p2.style.height = "" + split[1] + "vh";
  let domRect1 = p1.getBoundingClientRect();
  let domRect2 = p2.getBoundingClientRect();
  canvas1.height = domRect1["height"];
  canvas2.height = domRect2["height"];
  context1.height = domRect1["height"];
  context2.height = domRect2["height"];
  drawCircle1();
  drawCircle2();
}

intitialize();
