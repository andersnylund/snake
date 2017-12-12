$(document).ready(function () {
  iframe = document.getElementById('iframe');
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  snake = new Snake();
  start();
});


/**
 * Global variables
 */
var iframe;
var canvas;
var context;
var snake;
var size = 10; // the size of one rectangle


/**
 * Clear everything from the canvas 
 */
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}


/**
 * Direction enum
 */
const Direction = Object.freeze({
  left: 1,
  up: 2,
  right: 3,
  down: 4
});


/**
 * Snake 
 */
class Snake {
  constructor() {
    this.direction = Direction.right;
    this.rects = [];
    for (var i = 5; i > 0; --i) {
      this.rects.push(new Position(i * size, size));
    }
  }
}

/**
 * Position of one rectangle
 */
class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}



function moveSnake() {

  var newHead = snake.rects.pop();

  switch (snake.direction) {
    case 1: // left
      newHead.x = snake.rects[0].x - size;
      newHead.y = snake.rects[0].y;
      break;

    case 2: // up
      newHead.x = snake.rects[0].x;
      newHead.y = snake.rects[0].y - size;
      break;

    case 3: // right
      newHead.x = snake.rects[0].x + size;
      newHead.y = snake.rects[0].y;
      break;

    case 4: // down
      newHead.x = snake.rects[0].x;
      newHead.y = snake.rects[0].y + size;
      break;
  }

  snake.rects.unshift(newHead);

  drawSnake();
}

function drawSnake() {
  clearCanvas(); // clear the canvas completely, not efficient at all
  snake.rects.forEach(rect => {
    context.fillRect(rect.x, rect.y, size, size);
  });
}


/**
 * Register key presses
 */
$(document).keydown(function (e) {
  switch (e.which) {
    case 37: // left
      if (snake.direction === Direction.right) break;
      snake.direction = Direction.left;
      break;

    case 38: // up
      if (snake.direction === Direction.down) break;
      snake.direction = Direction.up;
      break;

    case 39: // right
      if (snake.direction === Direction.left) break;
      snake.direction = Direction.right;
      break;

    case 40: // down
      if (snake.direction === Direction.up) break;
      snake.direction = Direction.down;
      break;

    default: return; // exit this handler for other keys
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
});


/**
 * Start 
 */
function start() {
  var interval = window.setInterval(moveSnake, 80);
}