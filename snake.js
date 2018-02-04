$(document).ready(function () {

  $('#submitScore').click(function () {
    let scoreToSend = highScore > score ? highScore : score;
    let message = {
      'messageType': 'SCORE',
      'score': parseFloat(scoreToSend)
    };
    window.parent.postMessage(message, '*');
  });

  $('#saveState').click(function () {
    let message = {
      'messageType': 'SAVE',
      'gameState': {
        'score': score,
        'snake': snake.rects,
        'direction': snake.direction
      }
    };
    window.parent.postMessage(message, '*');
  });

  $('#loadState').click(function () {
    let message = {
      'messageType': 'LOAD_REQUEST'
    }
    window.parent.postMessage(message, '*');
  });

  // Resize the iframe
  var message = {
    'messageType': "SETTING",
    'options': {
      "width": 540,
      "height": 590
    }
  };
  window.parent.postMessage(message, "*");

  window.addEventListener("message", function (evt) {
    if (evt.data.messageType === "LOAD") {
      state = evt.data.gameState;
      score = state.score;
      $("#score").html(score.toString());
      snake.direction = state.direction;
      snake.rects = state.snake
    } else if (evt.data.messageType === "ERROR") {
      alert(evt.data.info);
    }
  });

  iframe = document.getElementById('iframe');
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  snake = new Snake();
  createNewFood();
  start();
});


/**
 * Global variables
 */
let iframe;
let canvas;
let context;
let snake;
let size = 10; // the size of one rectangle
let score = 0;
let highScore = 0;
let food;
let turnPerformed = false; // flag to not allow turning twice on one loop

/**
 * Hacky code. Needs some serious refactoring
 */

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
    for (let i = 5; i > 0; --i) {
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

  let newHead = snake.rects.pop();

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

  // check if snake collided with something
  if (snakeCollided()) {
    if (score >= highScore) {
      highScore = score;
      $("#highScore").html(highScore.toString());
    }
    score = 0;
    $("#score").html("0");
    snake = new Snake(); // reset the snake

  }

  if (snakeAteFood()) {
    score = score + 10;
    createNewFood();
    $("#score").html(score.toString());
    let tail = snake.rects[snake.rects.length - 1];
    snake.rects.push(new Position(tail.x, tail.y));
  }

  drawSnakeAndFood();

  turnPerformed = false;
}

/**
 * Draw the snake as it is currently
 */
function drawSnakeAndFood() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  snake.rects.forEach(rect => {
    context.fillRect(rect.x, rect.y, size, size);
  });
  context.fillRect(food.x, food.y, size, size);
}

/**
 * Check if snake collided with borders or itself
 */
function snakeCollided() {
  let snakeHead = snake.rects[0];

  // if collision with borders
  if (snakeHead.x < 0 || snakeHead.x >= canvas.width || snakeHead.y < 0 || snakeHead.y >= canvas.height) {
    return true;
  }

  let tail = snake.rects.slice(1);
  // collision with itself
  return tail.some(rect => rect.x === snakeHead.x && rect.y === snakeHead.y)
}


function snakeAteFood() {
  return snake.rects[0].x === food.x && snake.rects[0].y === food.y;
}


/**
 * Creates a new food at a random place not colliding with the snake
 */
function createNewFood() {
  let randX, randY;
  do {
    randX = Math.round(Math.floor(Math.random() * (canvas.width - size)) / 10) * 10;
    randY = Math.round(Math.floor(Math.random() * (canvas.height - size)) / 10) * 10;
  } while (snake.rects.some(rect => rect.x === randX && rect.y === randY));
  food = new Position(randX, randY);
  context.fillRect(randX, randY, size, size);
}


/**
 * Register key presses
 */
$(document).keydown(function (e) {
  if (!turnPerformed) { // avoid turning twice between updates
    switch (e.which) {
      case 37: // left
        if (snake.direction === Direction.right) break;
        snake.direction = Direction.left;
        turnPerformed = true;
        break;

      case 38: // up
        if (snake.direction === Direction.down) break;
        snake.direction = Direction.up;
        turnPerformed = true;
        break;

      case 39: // right
        if (snake.direction === Direction.left) break;
        snake.direction = Direction.right;
        turnPerformed = true;
        break;

      case 40: // down
        if (snake.direction === Direction.up) break;
        snake.direction = Direction.down;
        turnPerformed = true;
        break;

      default:
        return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  }
});

/**
 * Start loop
 */
function start() {
  let interval = window.setInterval(moveSnake, 80);
}