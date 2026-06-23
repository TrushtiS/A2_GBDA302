// Variables
let astronaut;
let obstacles = [];
let stardust = [];
let airSupply = 150;
let level = 1;
let astronautX = 150;
let astronautY = 400;
let speed = 5;
let obstacleX = 1200;
let groundOffset = 0;
let gameSpeed = 5;
let lastSecond = 0;
let distance = 1000;

function setup() {
  createCanvas(1200, 600);
}

function draw() {
  background(10, 20, 50);

  drawObstacles();

  distance -= 0.5;

  // Draw current level
  if (level === 1) {
    drawMars();
  }

  // Draw astronaut
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

  // UI
  drawAirSupply();
  drawDistance();

  if (millis() - lastSecond > 1000) {
  airSupply--;
  lastSecond = millis();
}
    if (airSupply <= 0) {
    drawLoseScreen();
    return;
}
if (distance <= 0) {
  drawWinScreen();
  return;
}

}

// Environment Functions
function drawMars() {

  // Sky
  background(10, 20, 50);

  // Stars
  fill(255);
  noStroke();

  for (let i = 0; i < 50; i++) {
    circle((i * 25 + groundOffset * 0.2) % width, random(height), 2);
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

//Obstacles
function drawObstacles() {

  fill(120);

  rect(obstacleX, 450, 50, 50);

  obstacleX -= 5;

  if (obstacleX < -50) {
    obstacleX = width;
  }

  if (
  astronautX + 50 > obstacleX &&
  astronautX < obstacleX + 50 &&
  astronautY + 80 > 450
) {
  airSupply--;
}
}

// Player Functions
function updateAstronaut() {
  fill(255);
  rect(150, 400, 50, 80);
}

// UI Functions
function drawAirSupply() {
  fill(255);
  textSize(24);
  text("Air Supply: " + airSupply, 20, 40);
}

function drawDistance() {

  fill(255);

  textSize(24);

  text(
    "Distance: " + floor(distance) + "m",
    900,
    40
  );
}

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

  textAlign(CENTER);
  textSize(50);

  text(
    "MISSION ACCOMPLISHED!",
    width / 2,
    height / 2
  );
}