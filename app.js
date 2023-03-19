const canvas = document.getElementById("my-canvas");
// console.log(canvas);
const ctx = canvas.getContext("2d");
// getContext() method會回傳一個canvas的drawing context，
// drawing context可以用來在canvas內畫圖
const unit = 20;
const row = canvas.height / unit; // 16 = 320 / 20
const column = canvas.width / unit; // 16 = 320 / 20

let snake = []; // array中的每個元素，都是一個物件
function createSnake() {
  // 物件的工作是，儲存身體的x, y座標
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

// 果實
class Fruit {
  constructor() {
    // 介於 (0*unit) ~ (15*unit)
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    let overlapping = false;
    let newX;
    let newY;

    // 確定 新位置的果實不會 跟 目前snake的整體 重疊
    function checkOverlap(newX, newY) {
      for (let i = 0; i < snake.length; i++) {
        if (newX == snake[i].x && newY == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    // overlapping is true, 重新設定 新果實的位置
    do {
      newX = Math.floor(Math.random() * column) * unit;
      newY = Math.floor(Math.random() * row) * unit;
      checkOverlap(newX, newY);
    } while (overlapping);

    this.x = newX;
    this.y = newY;
  }
}

// 初始設定
createSnake();
let myFruit = new Fruit();
window.addEventListener("keydown", changeDirection);
let direction = "right";
function changeDirection(event) {
  if (event.key == "ArrowRight" && direction != "left") direction = "right";
  else if (event.key == "ArrowLeft" && direction != "right") direction = "left";
  else if (event.key == "ArrowUp" && direction != "down") direction = "up";
  else if (event.key == "ArrowDown" && direction != "up") direction = "down";

  /**
   * 每次按下上下左右鍵之後，在下一幀被畫出來之前，
   * 不接受任何keydown事件
   * 這樣可以防止連續按鍵導致蛇在邏輯上自殺
   */
  window.removeEventListener("keydown", changeDirection);
}
let highestScore;
loadHighestScore();
let score = 0;
document.getElementById("my-score").innerHTML = "Score: " + score;
document.getElementById("highest-score").innerHTML =
  "Highest Score: " + highestScore;

function draw() {
  // 每次畫圖之前，確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("GAME OVER!!!");
      return; // 下面的 code 不會被執行
    }
  }

  // 背景全設定為黑色，因為下一幀要整個重新畫，不然蛇會無限延長
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 畫果實
  myFruit.drawFruit();

  // console.log("Drawing...");
  // 畫出蛇
  for (let i = 0; i < snake.length; i++) {
    // color
    if (i == 0) {
      ctx.fillStyle = "lightcoral";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";

    // 穿牆
    if (snake[i].x >= canvas.width) snake[i].x = 0;
    if (snake[i].x < 0) snake[i].x = canvas.width - unit;
    if (snake[i].y >= canvas.height) snake[i].y = 0;
    if (snake[i].y < 0) snake[i].y = canvas.height - unit;

    // size (x, y, width, height)
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // depending on direction, to decide the next position for snake
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (direction == "right") snakeX += unit;
  else if (direction == "left") snakeX -= unit;
  else if (direction == "up") snakeY -= unit;
  else if (direction == "down") snakeY += unit;

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // 確認蛇是否有吃到果實，if yes => unshift(newHead); else => pop(), unshift(newHead)
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    // 重新選定一個新的隨機位置
    myFruit.pickALocation();
    // 更新分數
    score++;
    setHighestScore(score);
    document.getElementById("my-score").innerHTML = "Score: " + score;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 250);

function loadHighestScore() {
  if (!localStorage.getItem("highestScore")) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
    document.getElementById("highest-score").innerHTML =
      "Highest Score: " + highestScore;
  }
}
