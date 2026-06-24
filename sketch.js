// =====================
// VARIABLES
// =====================
let astronautX = 75;
let astronautY = 400;
let speed = 2; // EDIT 6: gives astronaut lower gravity feel

let obstacles = []; // EDIT 1: allows for more obstacles at once
let obstacleSize = 50;
let obstacleCount = 6; // EDIT 1

let airSupply = 90; // EDIT 4: can only hit obstcales 3 times MAX

// EDIT 6: every 400m, one new obstacle is added
let startingDistance = 2000;
let distance = startingDistance;
let nextObstacleIncreaseAt = 400;

let gameSpeed = 5;
let groundOffset = 0;

let stars = [];
let lastAirDrain = 0; // FIX 1: timer for air drain
let lastObstacleHitTime = -2000; // EDIT 2: turns air supply red when hit
let lastDamageTime = 0; // EDIT 1
let damageCooldown = 200; // EDIT 1

// =====================
// SETUP
// =====================
function setup() {
  createCanvas(1200, 600);

  // EDIT 1
  for (let i = 0; i < obstacleCount; i++) {
    obstacles.push({
      x: width + i * 500,
      y: random(0, 450),
    });
  }

  for (let i = 0; i < 50; i++) {
    stars.push({
      x: random(width),
      y: random(height),
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

  // EDIT 6: every 400m, one new obstacle is added
  let depletedDistance = startingDistance - distance;
  while (depletedDistance >= nextObstacleIncreaseAt) {
    obstacleCount++;
    obstacles.push({
      x: width + random(150, 400),
      y: random(50, 450),
    });
    nextObstacleIncreaseAt += 400;
  }

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
    // EDIT 5: stars last the whole game
    circle((((s.x + groundOffset * 0.2) % width) + width) % width, s.y, 2);
  }

  fill(180, 80, 50);
  for (let x = -100; x < width + 100; x += 100) {
    triangle(
      x + (((groundOffset % 100) + 100) % 100), // FIX 3: keep offset in range
      500,
      x + 50 + (((groundOffset % 100) + 100) % 100),
      430,
      x + 100 + (((groundOffset % 100) + 100) % 100),
      500,
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
  //
  for (let ob of obstacles) {
    rect(ob.x, ob.y, obstacleSize, obstacleSize);

    ob.x -= gameSpeed; // EDIT 1

    // EDIT 1
    if (ob.x < -obstacleSize) {
      ob.x = width + random(150, 500);
      ob.y = random(50, 450);
    }

    // FIX 2: proper AABB collision (all four sides)
    let hit =
      astronautX + 50 > ob.x &&
      astronautX < ob.x + obstacleSize &&
      astronautY + 80 > ob.y &&
      astronautY < ob.y + obstacleSize;

    // EDIT 1
    if (hit) {
      airSupply -= 0.5;
      lastObstacleHitTime = millis();
    }
  }
}

// =====================
// UI
// =====================
function drawUI() {
  noStroke();
  textSize(24);
  textAlign(LEFT); // FIX 4: explicitly set alignment for UI

  // Air stays red permanently at 10 or below; otherwise flash red briefly on hit.
  if (airSupply <= 10 || millis() - lastObstacleHitTime < 0.6) {
    fill(255, 0, 0);
  } else {
    fill(255);
  }
  text("Air Supply: " + floor(airSupply), 20, 40); // EDIT 5: stars last for entirety

  fill(255);
  text("Distance to Target: " + floor(distance) + "m", 900, 40);
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
