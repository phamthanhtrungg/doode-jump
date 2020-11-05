document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const doodle = document.createElement("div");
  var isGameOver = false;
  var platforms = []; //store all platform objects
  var doodleLeft = 0;
  var doodleBottom = 0;
  var platformSpeed = 100;

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

  function start() {
    if (!isGameOver) {
      createPlatforms();
      createDoodle();
      setInterval(movePlatForms, platformSpeed);
    }
  }

  start();
});
