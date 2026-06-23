// =====================
// VARIABLES
// =====================
let astronautX = 150;
let astronautY = 400;
let speed = 5;

let obstacleX = 1200;
let obstacleSize = 50;

let airSupply = 150;
let distance = 1000;

let gameSpeed = 5;
let groundOffset = 0;

let stars = [];

// =====================
// SETUP
// =====================
function setup() {
  createCanvas(1200, 600);

  // Pre-generate stars (prevents flickering)
  for (let i = 0; i < 50; i++) {
    stars.push({
      x: random(width),
      y: random(height)
    });
  }
}

// =====================
// MAIN LOOP
// =====================
function draw() {
  background(10, 20, 50);

  drawMars();
  updateAstronaut();
  drawObstacles();

  drawUI();

  // Game progression
  distance -= 0.5;

  if (millis() % 1000 < 16) {
    airSupply--;
  }

  // Win / lose conditions
  if (airSupply <= 0) {
    drawLoseScreen();
    noLoop();
    return;
  }

  if (distance <= 0) {
    drawWinScreen();
    noLoop();
    return;
  }
}

// =====================
// PLAYER
// =====================
function updateAstronaut() {
  if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
    astronautY -= speed;
  }

  if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
    astronautY += speed;
  }

  astronautY = constrain(astronautY, 0, 420);

  fill(255);
  rect(astronautX, astronautY, 50, 80);
}

// =====================
// ENVIRONMENT
// =====================
function drawMars() {
  // Stars
  fill(255);
  noStroke();
  for (let s of stars) {
    circle((s.x + groundOffset * 0.2) % width, s.y, 2);
  }

  // Ground
  fill(180, 80, 50);

  for (let x = -100; x < width + 100; x += 100) {
    triangle(
      x + groundOffset % 100,
      500,
      x + 50 + groundOffset % 100,
      430,
      x + 100 + groundOffset % 100,
      500
    );
  }

  rect(0, 500, width, 100);

  groundOffset -= gameSpeed;
}

// =====================
// OBSTACLES
// =====================
function drawObstacles() {
  fill(120);
  rect(obstacleX, 450, obstacleSize, obstacleSize);

  obstacleX -= gameSpeed;

  if (obstacleX < -50) {
    obstacleX = width;
  }

  // Collision detection
  let hit =
    astronautX + 50 > obstacleX &&
    astronautX < obstacleX + obstacleSize &&
    astronautY + 80 > 450;

  if (hit) {
    airSupply -= 1;
  }
}

// =====================
// UI
// =====================
function drawUI() {
  fill(255);
  textSize(24);

  text("Air Supply: " + airSupply, 20, 40);

  text("Distance: " + floor(distance) + "m", 900, 40);
}

// =====================
// WIN / LOSE SCREENS
// =====================
function drawLoseScreen() {
  background(0);
  fill(255, 0, 0);
  textSize(50);
  textAlign(CENTER);

  text("YOU RAN OUT OF AIR!", width / 2, height / 2);
}

function drawWinScreen() {
  background(0);
  fill(0, 255, 0);
  textSize(50);
  textAlign(CENTER);

  text("MISSION ACCOMPLISHED!", width / 2, height / 2);
}