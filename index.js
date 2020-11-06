document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const doodle = document.createElement("div");
  const platformSpeedEl = document.querySelector("#platform-speed");
  const doodleSpeedEl = document.querySelector("#doodler-speed");
  const scoreEl = document.querySelector(".score");

  let isGameOver = false;
  let platforms = []; //store all platform objects
  let doodleLeft = 0;
  let doodleBottom = 0;
  let platformSpeed = 50;
  let doodleSpeed = 20;
  let jumpTimer;
  let fallTimer;
  let platformTimer;
  let moveLeftTimer;
  let moveRightTimer;
  let startPoint = 250;
  let isMovingLeft = false;
  let isMovingRight = false;
  let score = 0;

  // platformSpeedEl.value = platformSpeed + "ms";
  // doodleSpeedEl.value = doodleSpeed + "ms";
  class Platform {
    constructor(platformBottom) {
      this.bottom = platformBottom;
      this.left = Math.random() * (400 - 80);

      this.visual = document.createElement("div");
      this.visual.style.left = this.left + "px";
      this.visual.style.bottom = this.bottom + "px";
      this.visual.classList.add("platform");

      grid.appendChild(this.visual);
    }
  }

  function createPlatforms() {
    for (let i = 0; i < 5; ++i) {
      const platformGap = 600 / 5;
      const platformBottom = 100 + i * platformGap;
      const platform = new Platform(platformBottom);
      platforms.push(platform);
    }
  }

  function createDoodle() {
    doodleBottom = platforms[0].bottom;
    doodleLeft = platforms[0].left;

    doodle.style.left = doodleLeft + "px";
    doodle.style.bottom = doodleBottom + "px";
    doodle.classList.add("doodle");

    grid.appendChild(doodle);
  }

  function movePlatForms() {
    platforms.forEach((platform) => {
      platform.bottom -= 10;
      const visual = platform.visual;

      if (platform.bottom <= 0) {
        platform.bottom = 600;
        visual.style.transition = "none";
      } else {
        visual.style.transition = "all 0.1s ease";
      }
      visual.style.bottom = platform.bottom + "px";
    });
  }

  function jump() {
    clearInterval(fallTimer);
    if (isMovingRight) {
      clearInterval(moveRightTimer);
      isMovingRight = false;
    }
    if (isMovingLeft) {
      clearInterval(moveLeftTimer);
      isMovingLeft = false;
    }
    jumpTimer = setInterval(() => {
      doodleBottom += 5;
      doodle.style.bottom = doodleBottom + "px";

      if (doodleBottom > startPoint + 150) {
        fall();
      }
    }, doodleSpeed);
  }

  function fall() {
    clearInterval(jumpTimer);
    if (isMovingRight) {
      clearInterval(moveRightTimer);
      isMovingRight = false;
    }
    if (isMovingLeft) {
      clearInterval(moveLeftTimer);
      isMovingLeft = false;
    }

    fallTimer = setInterval(() => {
      doodleBottom -= 5;
      doodle.style.bottom = doodleBottom + "px";
      if (doodleBottom <= 0) {
        gameOver();
      }
      //check for collision
      platforms.forEach((platform) => {
        if (
          doodleBottom >= platform.bottom &&
          doodleBottom <= platform.bottom + 15 &&
          doodleLeft + 60 >= platform.left &&
          doodleLeft <= platform.left + 80
        ) {
          score++;
          scoreEl.innerHTML = "Scores: " + score;
          startPoint = platform.bottom;
          jump();
        }
      });
    }, doodleSpeed);
  }

  function gameOver() {
    isGameOver = true;
    isMovingLeft = false;
    isMovingRight = false;
    clearInterval(fallTimer);
    clearInterval(jumpTimer);
    clearInterval(platformTimer);
    clearInterval(moveRightTimer);
    clearInterval(moveLeftTimer);
  }

  function move(e) {
    if (isGameOver) {
      return;
    }
    if (e.key === "ArrowLeft") {
      moveLeft();
    } else if (e.key === "ArrowRight") {
      moveRight();
    } else if (e.key === "ArrowUp") {
      moveUp();
    }
  }
  function moveUp() {
    isMovingLeft = false;
    isMovingRight = false;
    clearInterval(moveLeftTimer);
    clearInterval(moveRightTimer);
  }

  function moveLeft() {
    if (isMovingRight) {
      clearInterval(moveRightTimer);
      isMovingRight = false;
    }
    if (isMovingLeft) {
      clearInterval(moveLeftTimer);
      isMovingLeft = false;
    }
    isMovingLeft = true;
    moveLeftTimer = setInterval(function () {
      if (doodleLeft <= 0) {
        moveRight();
      } else {
        doodleLeft -= 5;
        doodle.style.left = doodleLeft + "px";
      }
    }, doodleSpeed);
  }

  function moveRight() {
    if (isMovingLeft) {
      clearInterval(moveLeftTimer);
      isMovingLeft = false;
    }
    if (isMovingRight) {
      clearInterval(moveRightTimer);
      isMovingRight = false;
    }
    isMovingRight = true;
    moveRightTimer = setInterval(() => {
      if (doodleLeft >= 340) {
        moveLeft();
      } else {
        doodleLeft += 5;
        doodle.style.left = doodleLeft + "px";
      }
    }, doodleSpeed);
  }

  function start() {
    if (!isGameOver) {
      createPlatforms();
      createDoodle();
      platformTimer = setInterval(movePlatForms, platformSpeed);
      jump();
      document.addEventListener("keyup", move);
    }
  }

  start();
});
