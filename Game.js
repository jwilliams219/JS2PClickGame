'use strict';

function Game() {
  let buffer = {};
  let split = {};
  let p1 = document.getElementById("p1");
  let p2 = document.getElementById("p2");
  let canvas1 = document.getElementById('canvas1');
  let canvas2 = document.getElementById('canvas2');
  let context1 = canvas1.getContext("2d");
  let context2 = canvas2.getContext("2d");
  let arcInfo = {};
  let c1 = new Path2D();
  let c2 = new Path2D();

  function addClick1(e) {
    if (checkInCircle(e.targetTouches[0].clientX, e.targetTouches[0].clientY, arcInfo.p1)) {
      buffer["p1"] = true;
    }
  }

  function addClick2(e) {
    if (checkInCircle(e.targetTouches[0].clientX, e.targetTouches[0].clientY-canvas1.height, arcInfo.p2)) {
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
    let r = Math.sqrt(1/(height/2000))*20; // Temporary formula.
    return { "x": x, "y": y, "r": r};
  }

  function drawCircle1() {
    let arc = arcInfo.p1;
    context1.clearRect(0, 0, canvas1.width, canvas1.height);
    c1 = new Path2D();
    c1.arc(arc.x, arc.y, arc.r, 0, 2*Math.PI);
    context1.fill(c1);
  }

  function drawCircle2() {
    let arc = arcInfo.p2;
    context2.clearRect(0, 0, canvas2.width, canvas2.height);
    c2 = new Path2D();
    c2.arc(arc.x, arc.y, arc.r, 0, 2*Math.PI);
    c2.fillStyle= 'green';
    context2.fill(c2);
  }

  // Math to check if a point is in an arc.
  // Necessary because the canvas is used as listener.
  function checkInCircle(x, y, arc) {
    if ((Math.pow(x-arc.x, 2) + Math.pow(y-arc.y, 2)) < (Math.pow(arc.r, 2))) {
      return true;
    }
    return false;
  }

  // Make sure the arc doesn't go off the edge of the canvas vertically.
  function arcInBounds1(domRect, arc, heightDiff) { // Possible minor bug if p1 and p2 have click in same frame.
    if (arc.y + arc.r > domRect["height"] - heightDiff) {
      arc.y = domRect["height"] - arc.r - heightDiff;
    }
  }

  function arcInBounds2(arc) {
    if (arc.y - arc.r < 0) {
      arc.y = arc.r;
    }
  }

  function initialize() {
    split = { "p1": 50, "p2": 50};
    p1.style.height = "50vh";
    p2.style.height = "50vh";
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
    arcInfo = { "p1": calculateArc(domRect1), "p2": calculateArc(domRect2) };
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
      initialize();
    }
  }

  function getInput() {
    let input = { "p1": 0, "p2": 0}; 
    let diff = 4;
    if (buffer["p1"]) {
      input.p1 = diff;
    }
    if (buffer["p2"]) {
      input.p2 = diff;  
    }
    buffer = {"p1": false, "p2": false};
    return input;
  }

  function update(input) {
    let domRect1 = p1.getBoundingClientRect();
    let domRect2 = p2.getBoundingClientRect();
    split.p1 = split.p1 + input.p1 - input.p2;
    split.p2 = split.p2 + input.p2 - input.p1;
    if (split.p1 < 10 || split.p2 < 10) {
      return split, true;
    }
    if (input.p1) {
      arcInfo.p1 = calculateArc(domRect1);
      let heightDiff = Math.round(4*((domRect1["height"]+domRect2["height"])/100));
      arcInfo.p2.y = arcInfo.p2.y - heightDiff; // Prevent p2 dot from moving when only p1 moves.
      arcInBounds2(arcInfo.p2);
    }
    if (input.p2) {
      arcInfo.p2 = calculateArc(domRect2);
      let heightDiff = Math.round(4*((domRect1["height"]+domRect2["height"])/100));
      arcInBounds1(domRect1, arcInfo.p1, heightDiff);
    }
    return split, false;
  }

  function render() {
    p1.style.height = "" + split.p1 + "vh";
    p2.style.height = "" + split.p2 + "vh";
    let domRect1 = p1.getBoundingClientRect();
    let domRect2 = p2.getBoundingClientRect();
    canvas1.height = domRect1["height"];
    canvas2.height = domRect2["height"];
    context1.height = domRect1["height"];
    context2.height = domRect2["height"];
    drawCircle1();
    drawCircle2();
  }
  initialize();
}

let game = Game();
