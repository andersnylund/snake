$(document).ready(function () {
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  snake = new Snake(10, 10);
  snake.draw();
});

/**
 * Global variables
 */
var canvas;
var context;
var snake;

/**
 * Clear everything from the canvas 
 */
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Snake class
 */
class Snake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
  }

  draw() {
    clearCanvas(); // clear the canvas
    context.fillRect(this.x, this.y, this.size, this.size);
  }

  move(x, y) {
    this.x = this.x + x;
    this.y = this.y + y;
  }
}


/**
 * Register key presses
 */
$(document).keydown(function(e) {
  switch(e.which) {
      case 37: // left
        snake.move(-snake.size, 0);
        snake.draw();
      break;

      case 38: // up
        snake.move(0, -snake.size);
        snake.draw();
      break;

      case 39: // right
        snake.move(snake.size, 0);
        snake.draw();
      break;

      case 40: // down
        snake.move(0, snake.size);
        snake.draw();
      break;

      default: return; // exit this handler for other keys
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
});


