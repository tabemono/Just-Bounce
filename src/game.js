const GRAVITY = -0.6;

let player;
let points;
let gameOver;
let platforms = [];

function setup() {
  gameOver = false;
  loop();
  createCanvas(400, 600);
  player = new Player(width / 2, height / 2, false, 30, color("#c23838"));

  platforms = generatePlatforms();

  points = 0;
  frameRate(60);
}

function draw() {
  background(51);

  handlePlayer();

  handlePlatforms();

  drawScore();

  handleKeys();
}

/**
 * updates, draws, and applies GRAVITY to player
 * checks if the player falls
 */
function handlePlayer() {
  player.update();
  player.draw();

  if (player.maxY + player.loc.y < -height / 2) {
    /* end game */
    endGame();
  }
}

/**
 * checks collision, draws, and manages all platforms
 */
function handlePlatforms() {
  for (let i = platforms.length - 1; i >= 0; i--) {
    // loop through platforms backward

    if (platforms[i].onScreen) {
      platforms[i].draw(player.loc.y);

      if (platforms[i] instanceof Player) platforms[i].update(); // update Players

      if (platforms[i].collidesWith(player)) {
        player.jump();
        if (platforms[i] instanceof Player) {
          points += 100;
          platforms.splice(i, 1); // remove from array
        }
      }
    } else {
      /* no longer on-screen, delete previous platforms */
      platforms.splice(i, 1);

      /* push new platform */
      let x = noise(player.maxY, frameCount) * width;
      let y = player.maxY + height;

      if (random() < 0.92) {
        // 95% chance of being a regular platform

        platforms.push(new Platform(x, y, 55, color("white")));
      } else {
        if (random() > 0.55) {
          // 5% chance of being a player

          platforms.push(new Player(x, y, true, 50, color("#FF0400")));
        }

        // 5% chance of not regenerating
      }
    }
  }
}

/**
 * initializes platforms
 */
function generatePlatforms() {
  let field = []; // returning array

  for (let y = 0; y < height * 2; y += 40) {
    // loop through Y

    for (let i = 0; i < 3; i++) {
      // attempt 3 new platforms

      let x = noise(i, y) * width;

      if (noise(y, i) > 0.5)
        // 50% chance of a new platform
        field.push(new Platform(x, y, 55, color("beige")));
    }
  }

  return field;
}

/**
 * moves player based upon user input
 */
function handleKeys() {
  if (keyIsDown(LEFT_ARROW)) {
    player.applyForce(-1, 0);
  } else if (keyIsDown(RIGHT_ARROW)) {
    player.applyForce(1, 0);
  }
}

// function restart() {
//   if (gameOver) {
//     // loop();
//     if (keyIsDown(32)) {
//       // loop();
//       setup();
//     }
//   }
// }

document.body.onkeyup = function (e) {
  if (gameOver && e.keyCode == 32) {
    loop();
    setup();
  }
};
/**
 * scoreboard
 */
function drawScore() {
  textSize(25);
  textAlign(LEFT);
  fill("red");
  noStroke();
  text("Score: " + (player.maxY + points).toFixed(0), 30, 50);
}

/**
 * ends loop, draws game over message
 */
function endGame() {
  textAlign(CENTER, CENTER);

  gameOver = true;
  textSize(35);
  noStroke();
  fill("white");
  background(51);
  text("Game Over!", width / 2, height / 6);

  fill("red");
  // text("Play Again?", width / 2, height / 2);
  text("Press Space to Retry", width / 2, height / 3);

  noLoop();
  // restart();
}
