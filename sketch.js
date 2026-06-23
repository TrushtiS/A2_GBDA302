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
let lastAirDrain = 0; // FIX 1: timer for air drain

// =====================
// SETUP
// =====================
function setup() {
  createCanvas(1200, 600);

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

  distance -= 0.5;

  // FIX 1: drain air every 1 second using a reliable timer
  if (millis() - lastAirDrain > 1000) {
    airSupply--;
    lastAirDrain = millis();
  }

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

  noStroke(); // FIX 5
  fill(255);
  rect(astronautX, astronautY, 50, 80);
}

// =====================
// ENVIRONMENT
// =====================
function drawMars() {
  fill(255);
  noStroke();
  for (let s of stars) {
    circle((s.x + groundOffset * 0.2) % width, s.y, 2);
  }

  fill(180, 80, 50);
  for (let x = -100; x < width + 100; x += 100) {
    triangle(
      x + ((groundOffset % 100) + 100) % 100,       // FIX 3: keep offset in range
      500,
      x + 50 + ((groundOffset % 100) + 100) % 100,
      430,
      x + 100 + ((groundOffset % 100) + 100) % 100,
      500
    );
  }

  rect(0, 500, width, 100);

  groundOffset -= gameSpeed;

  // FIX 3: reset groundOffset to prevent float drift
  if (groundOffset < -10000) groundOffset += 10000;
}

// =====================
// OBSTACLES
// =====================
function drawObstacles() {
  noStroke(); // FIX 5
  fill(120);
  rect(obstacleX, 450, obstacleSize, obstacleSize);

  obstacleX -= gameSpeed;

  if (obstacleX < -50) {
    obstacleX = width;
  }

  // FIX 2: proper AABB collision (all four sides)
  let hit =
    astronautX + 50 > obstacleX &&
    astronautX < obstacleX + obstacleSize &&
    astronautY + 80 > 450 &&
    astronautY < 450 + obstacleSize;

  if (hit) {
    airSupply -= 1;
  }
}

// =====================
// UI
// =====================
function drawUI() {
  noStroke();
  fill(255);
  textSize(24);
  textAlign(LEFT); // FIX 4: explicitly set alignment for UI
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