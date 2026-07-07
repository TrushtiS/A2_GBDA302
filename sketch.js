// =====================
// VARIABLES
// =====================
let astronautX = 150;
let astronautY = 400;
let speed = 2; // EDIT 6: gives astronaut lower gravity feel

// Obstacles array — each has x, y, w, h
let obstacles = [];
let obstacleTimer = 0;
let obstacleInterval = 120; // frames between spawns
let obstaclesPerWave = 1;
let nextObstacleIncreaseAt = 400;

let airSupply = 100;
let statusText = "STABLE";
let distance = 1500;
const startingDistance = distance;
let distanceBarDisplay = 0;
const DISTANCE_DRAIN_PER_SECOND = 30;
let lowAirWarningPlayed = false;
let lowAirWarningTextStartMs = 0;
let lowAirWarningTextUntilMs = 0;

let gameSpeed = 5;

let stars = [];
let airPulses = [];
let lastAirDrain = 0;

let blinkFramesLeft = 0;
const BLINK_TOGGLE_EVERY = 4; // frames per on/off switch (higher = slower blink)
const BLINK_TOGGLES = 4; // 4 toggles = 2 full blinks
let hitCooldownFrames = 0;

// Game states: "start", "playing", "paused", "win", "lose"
let gameState = "start";
let showTutorialMessage = false;
const TUTORIAL_MESSAGE_1 = "Astronaut, this is Mission Control.";
const TUTORIAL_MESSAGE_2 =
  "Your trajectory to Mars looks good, but we have some bad news.";
const TUTORIAL_MESSAGE_3 =
  "We've detected a leak in your suit. This means you'll be running out of air much faster.";
const TUTORIAL_MESSAGE_4 =
  "Don't worry, we'll further guide you after touch-down.";
const TUTORIAL_MESSAGE_5 = "Astronaut, you are clear for landing!";
const TUTORIAL_TYPE_MS_PER_CHAR = 45;
const COPY_BUTTON_W = 122;
const COPY_BUTTON_H = 42;
const COPY_BUTTON_Y = 520;
const FINAL_BUTTON_LABEL = "Roger that!";
const FINAL_BUTTON_PADDING_X = 20;
const POST_LANDING_MESSAGE =
  "Great touchdown, Astronaut! Clear to commence post-landing checklist?";
const POST_LANDING_BUTTON_LABEL = "Clear!";
const POST_LANDING_BUTTON_H = 42;
const POST_LANDING_BUTTON_PADDING_X = 20;
const AIR_SUPPLY_PROMPT_MESSAGE = "Air supply Display?";
const NAVIGATION_PROMPT_MESSAGE = "Navigation Display?";
const STATUS_PROMPT_MESSAGE = "Status Display?";
const CHECKLIST_COMPLETE_MESSAGE =
  "Checklist complete. Clear to check thruster control?";
const THRUSTER_CONTROL_MESSAGE =
  "Press the UP arrow key to thrust up, and the DOWN arrow key to thrust down.";
const THRUSTER_COMPLETE_MESSAGE =
  "Thruster check complete. A few final reminders, listen carefully, Astronaut.";
const COLLISION_REMINDER_MESSAGE =
  "Avoid collisions with obstacles, they will deplete your air even faster.";
const STARDUST_WARNING_MESSAGE =
  "Watch out for the floating stardust, its effects are incredibly unpredictable.";
const OXYGEN_WARNING_MESSAGE =
  "Above all, reach the base before your oxygen runs out!";
const FINAL_SIGNOFF_MESSAGE =
  "Good luck out there, Astronaut. Mission Control over and out.";
let tutorialMessageStartMs = 0;
let tutorialMessageStep = 1;
let rocketBaseYDisplay = 300;
let launchTransitionActive = false;
let fadeInFromBlack = false;
let screenFadeAlpha = 0;
let launchRocketX = 0;
let launchRocketY = 300;
let gameplayFrozen = false;
let postLandingBriefingActive = false;
let postLandingBriefingStartMs = 0;
let airSupplyPromptActive = false;
let airSupplyPromptStartMs = 0;
let navigationPromptActive = false;
let navigationPromptStartMs = 0;
let statusPromptActive = false;
let statusPromptStartMs = 0;
let checklistCompletePromptActive = false;
let checklistCompletePromptStartMs = 0;
let thrusterControlPromptActive = false;
let thrusterUpPressed = false;
let thrusterDownPressed = false;
let thrusterCompletePromptActive = false;
let thrusterCompletePromptStartMs = 0;
let collisionReminderPromptActive = false;
let collisionReminderPromptStartMs = 0;
let stardustWarningPromptActive = false;
let stardustWarningPromptStartMs = 0;
let oxygenWarningPromptActive = false;
let oxygenWarningPromptStartMs = 0;
let finalSignoffPromptActive = false;
let finalSignoffPromptStartMs = 0;
let wasGameplayFrozenLastFrame = false;
let frozenAstronautBaseY = 400;

//Sound
let bgMusic;
let hitSound;
let boostUpSound;
let mc1Sound;
let mc2Sound;
let mc3Sound;
let mc4Sound;
let mc5Sound;
let mc6Sound;
let mc7Sound;
let mc8Sound;
let mc9Sound;
let mc10Sound;
let mc11Sound;
let mc12Sound;
let mc13Sound;
let mc14Sound;
let mc15Sound;
let mc16Sound;
let mcWarningSound;

//Images
// Image assets
let imgDefaultPose;
let imgCelebratoryPose;
let imgDeathPose;
let imgMarsRock1 
let imgMarsRock2
let imgMarsRock3;
let imgMarsOrb
let imgSaturnOrb;
let imgJupiterBigCloud
let imgJupiterMediumCloud
let imgJupiterSmallClouds
let imgJupiterLineCloud;
let imgOrangeStardust
let imgPinkStardust;
let imgBigClearCrystal
let imgBlackCrystal
let imgBlackSmallCrystal;
let imgClearCrystal
let imgGreenBigCrystal
let imgGreenCrystal
let imgGreenRockCrystal;
let imgGreenSmallCrystal
let imgPurpleBigCrystal
let imgPurpleCrystal
let imgPurpleSmallCrystal;
let imgVolcano1
let imgVolcano2;

// Rock images array 
let rockImages = [];
// Cloud images array
let cloudImages = [];
let bgPlanets = [];
let bgClouds = [];

//stardust
let stardustParticles = [];
let stardustTimer = 0;
let stardustInterval = 300;
// Values: null | "slow" | "spin"
let activeEffect = null;
// Spin angle accumulates while the "spin" effect is active
let spinAngle = 0;
// How much the spin effect rotates the astronaut per frame (radians)
const SPIN_RATE = 0.08;
// Slow effect multiplier applied to astronautY movement
const SLOW_MULT = 0.4;
// Obstacle Y positions (3 heights): ground, mid, high
const OBS_HEIGHTS = [380, 235, 70];

// =====================
// AUDIO ASSETS
// =====================
function preload() {
  //sound
  bgMusic = loadSound("assets/sounds/background_music.mp3");
  hitSound = loadSound("assets/sounds/hit_obstacle_sound_effect.mp3");
  boostUpSound = loadSound("assets/sounds/boost_up_sound_effect.mp3");
  mc1Sound = loadSound("assets/sounds/MC1.mp3");
  mc2Sound = loadSound("assets/sounds/MC2.mp3");
  mc3Sound = loadSound("assets/sounds/MC3.mp3");
  mc4Sound = loadSound("assets/sounds/MC4.mp3");
  mc5Sound = loadSound("assets/sounds/MC5.mp3");
  mc6Sound = loadSound("assets/sounds/MC6.mp3");
  mc7Sound = loadSound("assets/sounds/MC7.mp3");
  mc8Sound = loadSound("assets/sounds/MC8.mp3");
  mc9Sound = loadSound("assets/sounds/MC9.mp3");
  mc10Sound = loadSound("assets/sounds/MC10.mp3");
  mc11Sound = loadSound("assets/sounds/MC11.mp3");
  mc12Sound = loadSound("assets/sounds/MC12.mp3");
  mc13Sound = loadSound("assets/sounds/MC13.mp3");
  mc14Sound = loadSound("assets/sounds/MC14.mp3");
  mc15Sound = loadSound("assets/sounds/MC15.mp3");
  mc16Sound = loadSound("assets/sounds/MC16.mp3");
  mcWarningSound = loadSound("assets/sounds/MCwarning.mp3");

  //images
  imgDefaultPose     = loadImage("assets/image/defaultpose.png");
  imgCelebratoryPose = loadImage("assets/image/celebratorypose.png");
  imgDeathPose       = loadImage("assets/image/deathpose.png"); 
  imgMarsRock1 = loadImage("assets/image/marsrock1.png");
  imgMarsRock2 = loadImage("assets/image/marsrock2.png");
  imgMarsRock3 = loadImage("assets/image/marsrock3.png"); 
  imgMarsOrb   = loadImage("assets/image/marsorb.png");
  imgSaturnOrb = loadImage("assets/image/saturnorb.png");
  imgJupiterBigCloud    = loadImage("assets/image/jupiterbigcloud.png");
  imgJupiterMediumCloud = loadImage("assets/image/jupitermediumcloud.png");
  imgJupiterSmallClouds = loadImage("assets/image/jupitersmallclouds.png");
  imgJupiterLineCloud   = loadImage("assets/image/jupiterlineclouds.png");
  imgOrangeStardust = loadImage("assets/image/orangestardust.png");
  imgPinkStardust   = loadImage("assets/image/pinkstardust.avif");
  imgBigClearCrystal   = loadImage("assets/image/bigclearcrystal.png");
  imgBlackCrystal      = loadImage("assets/image/blackcrystal.png");
  imgBlackSmallCrystal = loadImage("assets/image/blacksmallcrystal.png");
  imgClearCrystal      = loadImage("assets/image/clearcrystal.png");
  imgGreenBigCrystal   = loadImage("assets/image/greenbigcrystal.png");
  imgGreenCrystal      = loadImage("assets/image/greencrystal.png");
  imgGreenRockCrystal  = loadImage("assets/image/greenrockcrystal.png");
  imgGreenSmallCrystal = loadImage("assets/image/greensmallcrystal.png");
  imgPurpleBigCrystal  = loadImage("assets/image/purplebigcrystal.png");
  imgPurpleCrystal     = loadImage("assets/image/purplecrystal.png");
  imgPurpleSmallCrystal= loadImage("assets/image/purplesmallcrystal.png");
  imgVolcano1 = loadImage("assets/image/volcanoe1.png");
  imgVolcano2 = loadImage("assets/image/volcanoe2.png");
}

// Plays the hit SFX — cloneNode lets it overlap itself on rapid hits
function sfxHit() {
  if (hitSound) {
    hitSound.setVolume(0.2);
    hitSound.play();
  }
}

function sfxBoostUp() {
  if (!boostUpSound) return;

  if (boostUpSound.isPlaying()) {
    boostUpSound.stop();
  }
  boostUpSound.setVolume(0.05);
  boostUpSound.play();
}

function sfxMC1() {
  if (!mc1Sound) return;

  // Restart the clip each time tutorial relay begins.
  if (mc1Sound.isPlaying()) {
    mc1Sound.stop();
  }
  mc1Sound.play();
}

function sfxMC2() {
  if (!mc2Sound) return;

  if (mc2Sound.isPlaying()) {
    mc2Sound.stop();
  }
  mc2Sound.play();
}

function sfxMC3() {
  if (!mc3Sound) return;

  if (mc3Sound.isPlaying()) {
    mc3Sound.stop();
  }
  mc3Sound.play();
}

function sfxMC4() {
  if (!mc4Sound) return;

  if (mc4Sound.isPlaying()) {
    mc4Sound.stop();
  }
  mc4Sound.play();
}

function sfxMC5() {
  if (!mc5Sound) return;

  if (mc5Sound.isPlaying()) {
    mc5Sound.stop();
  }
  mc5Sound.play();
}

function sfxMC6() {
  if (!mc6Sound) return;

  if (mc6Sound.isPlaying()) {
    mc6Sound.stop();
  }
  mc6Sound.play();
}

function sfxMC7() {
  if (!mc7Sound) return;

  if (mc7Sound.isPlaying()) {
    mc7Sound.stop();
  }
  mc7Sound.play();
}

function sfxMC8() {
  if (!mc8Sound) return;

  if (mc8Sound.isPlaying()) {
    mc8Sound.stop();
  }
  mc8Sound.play();
}

function sfxMC9() {
  if (!mc9Sound) return;

  if (mc9Sound.isPlaying()) {
    mc9Sound.stop();
  }
  mc9Sound.play();
}

function sfxMC10() {
  if (!mc10Sound) return;

  if (mc10Sound.isPlaying()) {
    mc10Sound.stop();
  }
  mc10Sound.play();
}

function sfxMC11() {
  if (!mc11Sound) return;

  if (mc11Sound.isPlaying()) {
    mc11Sound.stop();
  }
  mc11Sound.play();
}

function sfxMC12() {
  if (!mc12Sound) return;

  if (mc12Sound.isPlaying()) {
    mc12Sound.stop();
  }
  mc12Sound.play();
}

function sfxMC13() {
  if (!mc13Sound) return;

  if (mc13Sound.isPlaying()) {
    mc13Sound.stop();
  }
  mc13Sound.play();
}

function sfxMC14() {
  if (!mc14Sound) return;

  if (mc14Sound.isPlaying()) {
    mc14Sound.stop();
  }
  mc14Sound.play();
}

function sfxMC15() {
  if (!mc15Sound) return;

  if (mc15Sound.isPlaying()) {
    mc15Sound.stop();
  }
  mc15Sound.play();
}

function sfxMC16() {
  if (!mc16Sound) return;

  if (mc16Sound.isPlaying()) {
    mc16Sound.stop();
  }
  mc16Sound.play();
}

function sfxMCWarning() {
  if (!mcWarningSound) return;

  if (mcWarningSound.isPlaying()) {
    mcWarningSound.stop();
  }
  mcWarningSound.play();
}

// Stops background music and resets it to the beginning
function stopMusic() {
  if (bgMusic && bgMusic.isPlaying()) {
    bgMusic.stop();
  }
}

function pauseMusic() {
  if (bgMusic && bgMusic.isPlaying()) {
    bgMusic.pause();
  }
}

function resumeMusic() {
  if (!bgMusic) return;

  if (bgMusic.isPaused()) {
    bgMusic.play();
    return;
  }

  if (!bgMusic.isPlaying()) {
    bgMusic.setVolume(0.4);
    bgMusic.loop();
  }
}

function restartMusic() {
  if (!bgMusic) return;
  bgMusic.stop();
  bgMusic.setVolume(0.4);
  bgMusic.loop();
}

function spawnBgCloud(startX) {
  let img = random(cloudImages);
  bgClouds.push({
    img,
    x: startX !== undefined ? startX : width + 200,
    y: random(60, 300),
    size: random(160, 320),
    speed: random(0.4, 1.0),
    alpha: random(30, 70),
  });
}

// =====================
// SETUP
// =====================
function setup() {
  createCanvas(1200, 600);
  imageMode(CENTER);
 
  // Fill lookup arrays after preload
  rockImages  = [imgMarsRock1, imgMarsRock2, imgMarsRock3];
  cloudImages = [imgJupiterBigCloud, imgJupiterMediumCloud, imgJupiterSmallClouds, imgJupiterLineCloud];
 
  for (let i = 0; i < 50; i++) {
    stars.push({ x: random(width), y: random(height) });
  }
 
  // Seed background planets (decorative, very slow parallax)
  bgPlanets = [
    { img: imgMarsOrb,   x: width * 0.78, y: 120, size: 140, speed: 0.05 },
    { img: imgSaturnOrb, x: width * 0.35, y:  80, size: 100, speed: 0.03 },
  ];
 
  // Seed a handful of background clouds
  for (let i = 0; i < 4; i++) {
    spawnBgCloud(random(width)); // pre-scatter across screen on start
  }
 
  if (!bgMusic.isPlaying()) { bgMusic.setVolume(0.4); bgMusic.loop(); }
 
  spawnObstacle();
}

// =====================
// OBSTACLE SPAWNING
// =====================
function spawnObstacle(xOffset = 0) {
  let yPos = random(OBS_HEIGHTS);
  let sizes = [
    { w: 40, h: 50 },
    { w: 55, h: 70 },
    { w: 30, h: 100 },
  ];
  let s = random(sizes);
  let img = random(rockImages);
  obstacles.push({
    x: width + 20 + xOffset,
    y: yPos,
    w: s.w,
    h: s.h,
    img: img
  });
}

// =====================
// MAIN LOOP
// =====================
function draw() {
  if (gameState === "start") {
    drawStartScreen();
    return;
  }

  if (gameState === "paused") {
    drawPausedScreen();
    return;
  }

  background(10, 20, 50);

  drawMars();
  drawStardust();
  updateAstronaut();
  drawAirPulses();
  drawObstacles();

  // Keep the suit leak visual active even while gameplay is frozen.
  if (millis() - lastAirDrain > 1000) {
    if (!gameplayFrozen) {
      airSupply--;
    }
    spawnAirPulse();
    lastAirDrain = millis();
  }

  if (!gameplayFrozen) {
    // Drain distance using real elapsed time for smooth, frame-rate independent motion.
    distance -= DISTANCE_DRAIN_PER_SECOND * (deltaTime / 1000);
    distance = max(0, distance);

    // Add one extra obstacle to each spawn wave every 400m traveled.
    let distanceTravelled = startingDistance - distance;
    if (distanceTravelled >= nextObstacleIncreaseAt) {
      obstaclesPerWave++;
      nextObstacleIncreaseAt += 400;
    }

    // Spawn obstacles on a timer
    obstacleTimer++;
    if (obstacleTimer >= obstacleInterval) {
      for (let i = 0; i < obstaclesPerWave; i++) {
        spawnObstacle(i * 120);
      }
      obstacleTimer = 0;
      // Slightly randomise next interval so it doesn't feel robotic
      obstacleInterval = floor(random(90, 160));
    }

    stardustTimer++;
    if (stardustTimer >= stardustInterval) {
      spawnStardust();
      stardustTimer = 0;
      // Vary the interval a little so it feels organic (4–6 seconds at 60fps)
      stardustInterval = floor(random(200, 300));
    }
  }

  let targetProgressPct = constrain(1 - distance / startingDistance, 0, 1);
  distanceBarDisplay = lerp(distanceBarDisplay, targetProgressPct, 0.08);

  drawUI();

  if (millis() < lowAirWarningTextUntilMs) {
    const warningMessage = "Warning! Air level low!";
    const elapsedMs = millis() - lowAirWarningTextStartMs;
    let charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
    charsVisible = constrain(charsVisible, 0, warningMessage.length);

    fill(230);
    textAlign(CENTER, CENTER);
    textSize(24);
    text(warningMessage.substring(0, charsVisible), width / 2, height / 2);
  }

  if (gameplayFrozen && airSupplyPromptActive) {
    const elapsedMs = millis() - airSupplyPromptStartMs;
    let charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
    charsVisible = constrain(charsVisible, 0, AIR_SUPPLY_PROMPT_MESSAGE.length);

    fill(230);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(
      AIR_SUPPLY_PROMPT_MESSAGE.substring(0, charsVisible),
      width / 2,
      height / 2,
    );

    if (charsVisible >= AIR_SUPPLY_PROMPT_MESSAGE.length) {
      textSize(20);
      const airPromptButtonLabel = "Check!";
      const airPromptButtonW = textWidth(airPromptButtonLabel) + 40;
      const airPromptButtonH = 42;
      const airPromptButtonX = 15;
      const airPromptButtonY = 15 + 24 + 14;

      fill(80, 140, 230);
      noStroke();
      rect(
        airPromptButtonX,
        airPromptButtonY,
        airPromptButtonW,
        airPromptButtonH,
        10,
      );

      if (
        mouseX > airPromptButtonX &&
        mouseX < airPromptButtonX + airPromptButtonW &&
        mouseY > airPromptButtonY &&
        mouseY < airPromptButtonY + airPromptButtonH
      ) {
        fill(255, 255, 255, 35);
        rect(
          airPromptButtonX,
          airPromptButtonY,
          airPromptButtonW,
          airPromptButtonH,
          10,
        );
      }

      fill(255);
      textAlign(CENTER, CENTER);
      text(
        airPromptButtonLabel,
        airPromptButtonX + airPromptButtonW / 2,
        airPromptButtonY + airPromptButtonH / 2,
      );
    }
  }

  if (gameplayFrozen && navigationPromptActive) {
    const elapsedMs = millis() - navigationPromptStartMs;
    let charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
    charsVisible = constrain(charsVisible, 0, NAVIGATION_PROMPT_MESSAGE.length);

    fill(230);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(
      NAVIGATION_PROMPT_MESSAGE.substring(0, charsVisible),
      width / 2,
      height / 2,
    );

    if (charsVisible >= NAVIGATION_PROMPT_MESSAGE.length) {
      textSize(20);
      const navPromptButtonLabel = "Check!";
      const navPromptButtonW = textWidth(navPromptButtonLabel) + 40;
      const navPromptButtonH = 42;
      const navPromptButtonX = width / 2 - navPromptButtonW / 2;
      const navPromptButtonY = height - 40 - navPromptButtonH - 10;

      fill(80, 140, 230);
      noStroke();
      rect(
        navPromptButtonX,
        navPromptButtonY,
        navPromptButtonW,
        navPromptButtonH,
        10,
      );

      if (
        mouseX > navPromptButtonX &&
        mouseX < navPromptButtonX + navPromptButtonW &&
        mouseY > navPromptButtonY &&
        mouseY < navPromptButtonY + navPromptButtonH
      ) {
        fill(255, 255, 255, 35);
        rect(
          navPromptButtonX,
          navPromptButtonY,
          navPromptButtonW,
          navPromptButtonH,
          10,
        );
      }

      fill(255);
      textAlign(CENTER, CENTER);
      text(
        navPromptButtonLabel,
        navPromptButtonX + navPromptButtonW / 2,
        navPromptButtonY + navPromptButtonH / 2,
      );
    }
  }

  if (gameplayFrozen && statusPromptActive) {
    const elapsedMs = millis() - statusPromptStartMs;
    let charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
    charsVisible = constrain(charsVisible, 0, STATUS_PROMPT_MESSAGE.length);

    fill(230);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(
      STATUS_PROMPT_MESSAGE.substring(0, charsVisible),
      width / 2,
      height / 2,
    );

    if (charsVisible >= STATUS_PROMPT_MESSAGE.length) {
      textSize(20);
      const statusPromptButtonLabel = "Check!";
      const statusPromptButtonW = textWidth(statusPromptButtonLabel) + 40;
      const statusPromptButtonH = 42;
      const statusPromptButtonX =
        width - 15 - 280 + (280 - statusPromptButtonW) / 2;
      const statusPromptButtonY = 15 + 24 + 14;

      fill(80, 140, 230);
      noStroke();
      rect(
        statusPromptButtonX,
        statusPromptButtonY,
        statusPromptButtonW,
        statusPromptButtonH,
        10,
      );

      if (
        mouseX > statusPromptButtonX &&
        mouseX < statusPromptButtonX + statusPromptButtonW &&
        mouseY > statusPromptButtonY &&
        mouseY < statusPromptButtonY + statusPromptButtonH
      ) {
        fill(255, 255, 255, 35);
        rect(
          statusPromptButtonX,
          statusPromptButtonY,
          statusPromptButtonW,
          statusPromptButtonH,
          10,
        );
      }

      fill(255);
      textAlign(CENTER, CENTER);
      text(
        statusPromptButtonLabel,
        statusPromptButtonX + statusPromptButtonW / 2,
        statusPromptButtonY + statusPromptButtonH / 2,
      );
    }
  }

  if (gameplayFrozen && checklistCompletePromptActive) {
    const elapsedMs = millis() - checklistCompletePromptStartMs;
    let charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
    charsVisible = constrain(
      charsVisible,
      0,
      CHECKLIST_COMPLETE_MESSAGE.length,
    );

    fill(230);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(
      CHECKLIST_COMPLETE_MESSAGE.substring(0, charsVisible),
      width / 2,
      height / 2,
    );

    if (charsVisible >= CHECKLIST_COMPLETE_MESSAGE.length) {
      textSize(20);
      const checklistButtonLabel = "Clear!";
      const checklistButtonW = textWidth(checklistButtonLabel) + 40;
      const checklistButtonH = 42;
      const checklistButtonX = width / 2 - checklistButtonW / 2;
      const checklistButtonY = height / 2 + 28;

      fill(80, 140, 230);
      noStroke();
      rect(
        checklistButtonX,
        checklistButtonY,
        checklistButtonW,
        checklistButtonH,
        10,
      );

      if (
        mouseX > checklistButtonX &&
        mouseX < checklistButtonX + checklistButtonW &&
        mouseY > checklistButtonY &&
        mouseY < checklistButtonY + checklistButtonH
      ) {
        fill(255, 255, 255, 35);
        rect(
          checklistButtonX,
          checklistButtonY,
          checklistButtonW,
          checklistButtonH,
          10,
        );
      }

      fill(255);
      textAlign(CENTER, CENTER);
      text(
        checklistButtonLabel,
        checklistButtonX + checklistButtonW / 2,
        checklistButtonY + checklistButtonH / 2,
      );
    }
  }

  if (gameplayFrozen && thrusterControlPromptActive) {
    fill(230);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(THRUSTER_CONTROL_MESSAGE, width / 2, height / 2);

    if (thrusterUpPressed && thrusterDownPressed) {
      textSize(20);
      const thrusterCheckButtonLabel = "Check!";
      const thrusterCheckButtonW = textWidth(thrusterCheckButtonLabel) + 40;
      const thrusterCheckButtonH = 42;
      const thrusterCheckButtonX = width / 2 - thrusterCheckButtonW / 2;
      const thrusterCheckButtonY = height / 2 + 28;

      fill(80, 140, 230);
      noStroke();
      rect(
        thrusterCheckButtonX,
        thrusterCheckButtonY,
        thrusterCheckButtonW,
        thrusterCheckButtonH,
        10,
      );

      if (
        mouseX > thrusterCheckButtonX &&
        mouseX < thrusterCheckButtonX + thrusterCheckButtonW &&
        mouseY > thrusterCheckButtonY &&
        mouseY < thrusterCheckButtonY + thrusterCheckButtonH
      ) {
        fill(255, 255, 255, 35);
        rect(
          thrusterCheckButtonX,
          thrusterCheckButtonY,
          thrusterCheckButtonW,
          thrusterCheckButtonH,
          10,
        );
      }

      fill(255);
      textAlign(CENTER, CENTER);
      text(
        thrusterCheckButtonLabel,
        thrusterCheckButtonX + thrusterCheckButtonW / 2,
        thrusterCheckButtonY + thrusterCheckButtonH / 2,
      );
    }
  }

  if (gameplayFrozen && thrusterCompletePromptActive) {
    const elapsedMs = millis() - thrusterCompletePromptStartMs;
    let charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
    charsVisible = constrain(charsVisible, 0, THRUSTER_COMPLETE_MESSAGE.length);

    fill(230);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(
      THRUSTER_COMPLETE_MESSAGE.substring(0, charsVisible),
      width / 2,
      height / 2,
    );

    if (charsVisible >= THRUSTER_COMPLETE_MESSAGE.length) {
      textSize(20);
      const finalCopyButtonLabel = "Copy";
      const finalCopyButtonW = textWidth(finalCopyButtonLabel) + 40;
      const finalCopyButtonH = 42;
      const finalCopyButtonX = width / 2 - finalCopyButtonW / 2;
      const finalCopyButtonY = height / 2 + 28;

      fill(80, 140, 230);
      noStroke();
      rect(
        finalCopyButtonX,
        finalCopyButtonY,
        finalCopyButtonW,
        finalCopyButtonH,
        10,
      );

      if (
        mouseX > finalCopyButtonX &&
        mouseX < finalCopyButtonX + finalCopyButtonW &&
        mouseY > finalCopyButtonY &&
        mouseY < finalCopyButtonY + finalCopyButtonH
      ) {
        fill(255, 255, 255, 35);
        rect(
          finalCopyButtonX,
          finalCopyButtonY,
          finalCopyButtonW,
          finalCopyButtonH,
          10,
        );
      }

      fill(255);
      textAlign(CENTER, CENTER);
      text(
        finalCopyButtonLabel,
        finalCopyButtonX + finalCopyButtonW / 2,
        finalCopyButtonY + finalCopyButtonH / 2,
      );
    }
  }

  if (gameplayFrozen && collisionReminderPromptActive) {
    const elapsedMs = millis() - collisionReminderPromptStartMs;
    let charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
    charsVisible = constrain(
      charsVisible,
      0,
      COLLISION_REMINDER_MESSAGE.length,
    );

    fill(230);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(
      COLLISION_REMINDER_MESSAGE.substring(0, charsVisible),
      width / 2,
      height / 2,
    );

    if (charsVisible >= COLLISION_REMINDER_MESSAGE.length) {
      textSize(20);
      const collisionCopyButtonLabel = "Copy";
      const collisionCopyButtonW = textWidth(collisionCopyButtonLabel) + 40;
      const collisionCopyButtonH = 42;
      const collisionCopyButtonX = width / 2 - collisionCopyButtonW / 2;
      const collisionCopyButtonY = height / 2 + 28;

      fill(80, 140, 230);
      noStroke();
      rect(
        collisionCopyButtonX,
        collisionCopyButtonY,
        collisionCopyButtonW,
        collisionCopyButtonH,
        10,
      );

      if (
        mouseX > collisionCopyButtonX &&
        mouseX < collisionCopyButtonX + collisionCopyButtonW &&
        mouseY > collisionCopyButtonY &&
        mouseY < collisionCopyButtonY + collisionCopyButtonH
      ) {
        fill(255, 255, 255, 35);
        rect(
          collisionCopyButtonX,
          collisionCopyButtonY,
          collisionCopyButtonW,
          collisionCopyButtonH,
          10,
        );
      }

      fill(255);
      textAlign(CENTER, CENTER);
      text(
        collisionCopyButtonLabel,
        collisionCopyButtonX + collisionCopyButtonW / 2,
        collisionCopyButtonY + collisionCopyButtonH / 2,
      );
    }
  }

  if (gameplayFrozen && stardustWarningPromptActive) {
    const elapsedMs = millis() - stardustWarningPromptStartMs;
    let charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
    charsVisible = constrain(charsVisible, 0, STARDUST_WARNING_MESSAGE.length);

    fill(230);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(
      STARDUST_WARNING_MESSAGE.substring(0, charsVisible),
      width / 2,
      height / 2,
    );

    if (charsVisible >= STARDUST_WARNING_MESSAGE.length) {
      textSize(20);
      const stardustCopyButtonLabel = "Copy";
      const stardustCopyButtonW = textWidth(stardustCopyButtonLabel) + 40;
      const stardustCopyButtonH = 42;
      const stardustCopyButtonX = width / 2 - stardustCopyButtonW / 2;
      const stardustCopyButtonY = height / 2 + 28;

      fill(80, 140, 230);
      noStroke();
      rect(
        stardustCopyButtonX,
        stardustCopyButtonY,
        stardustCopyButtonW,
        stardustCopyButtonH,
        10,
      );

      if (
        mouseX > stardustCopyButtonX &&
        mouseX < stardustCopyButtonX + stardustCopyButtonW &&
        mouseY > stardustCopyButtonY &&
        mouseY < stardustCopyButtonY + stardustCopyButtonH
      ) {
        fill(255, 255, 255, 35);
        rect(
          stardustCopyButtonX,
          stardustCopyButtonY,
          stardustCopyButtonW,
          stardustCopyButtonH,
          10,
        );
      }

      fill(255);
      textAlign(CENTER, CENTER);
      text(
        stardustCopyButtonLabel,
        stardustCopyButtonX + stardustCopyButtonW / 2,
        stardustCopyButtonY + stardustCopyButtonH / 2,
      );
    }
  }

  if (gameplayFrozen && oxygenWarningPromptActive) {
    const elapsedMs = millis() - oxygenWarningPromptStartMs;
    let charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
    charsVisible = constrain(charsVisible, 0, OXYGEN_WARNING_MESSAGE.length);

    fill(230);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(
      OXYGEN_WARNING_MESSAGE.substring(0, charsVisible),
      width / 2,
      height / 2,
    );

    if (charsVisible >= OXYGEN_WARNING_MESSAGE.length) {
      textSize(20);
      const oxygenCopyButtonLabel = "Copy";
      const oxygenCopyButtonW = textWidth(oxygenCopyButtonLabel) + 40;
      const oxygenCopyButtonH = 42;
      const oxygenCopyButtonX = width / 2 - oxygenCopyButtonW / 2;
      const oxygenCopyButtonY = height / 2 + 28;

      fill(80, 140, 230);
      noStroke();
      rect(
        oxygenCopyButtonX,
        oxygenCopyButtonY,
        oxygenCopyButtonW,
        oxygenCopyButtonH,
        10,
      );

      if (
        mouseX > oxygenCopyButtonX &&
        mouseX < oxygenCopyButtonX + oxygenCopyButtonW &&
        mouseY > oxygenCopyButtonY &&
        mouseY < oxygenCopyButtonY + oxygenCopyButtonH
      ) {
        fill(255, 255, 255, 35);
        rect(
          oxygenCopyButtonX,
          oxygenCopyButtonY,
          oxygenCopyButtonW,
          oxygenCopyButtonH,
          10,
        );
      }

      fill(255);
      textAlign(CENTER, CENTER);
      text(
        oxygenCopyButtonLabel,
        oxygenCopyButtonX + oxygenCopyButtonW / 2,
        oxygenCopyButtonY + oxygenCopyButtonH / 2,
      );
    }
  }

  if (gameplayFrozen && finalSignoffPromptActive) {
    const elapsedMs = millis() - finalSignoffPromptStartMs;
    let charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
    charsVisible = constrain(charsVisible, 0, FINAL_SIGNOFF_MESSAGE.length);

    fill(230);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(
      FINAL_SIGNOFF_MESSAGE.substring(0, charsVisible),
      width / 2,
      height / 2,
    );

    if (charsVisible >= FINAL_SIGNOFF_MESSAGE.length) {
      textSize(20);
      const startMissionButtonLabel = "Start Mission";
      const startMissionButtonW = textWidth(startMissionButtonLabel) + 40;
      const startMissionButtonH = 42;
      const startMissionButtonX = width / 2 - startMissionButtonW / 2;
      const startMissionButtonY = height / 2 + 28;

      fill(60, 180, 100);
      noStroke();
      rect(
        startMissionButtonX,
        startMissionButtonY,
        startMissionButtonW,
        startMissionButtonH,
        10,
      );

      if (
        mouseX > startMissionButtonX &&
        mouseX < startMissionButtonX + startMissionButtonW &&
        mouseY > startMissionButtonY &&
        mouseY < startMissionButtonY + startMissionButtonH
      ) {
        fill(255, 255, 255, 35);
        rect(
          startMissionButtonX,
          startMissionButtonY,
          startMissionButtonW,
          startMissionButtonH,
          10,
        );
      }

      fill(255);
      textAlign(CENTER, CENTER);
      text(
        startMissionButtonLabel,
        startMissionButtonX + startMissionButtonW / 2,
        startMissionButtonY + startMissionButtonH / 2,
      );
    }
  }

  // Transition from the start sequence into active gameplay.
  if (fadeInFromBlack) {
    screenFadeAlpha = max(0, screenFadeAlpha - 8);
    noStroke();
    fill(0, 0, 0, screenFadeAlpha);
    rect(0, 0, width, height);
    if (screenFadeAlpha === 0) {
      fadeInFromBlack = false;
      if (gameplayFrozen && !postLandingBriefingActive) {
        postLandingBriefingActive = true;
        postLandingBriefingStartMs = millis();
        sfxMC6();
      }
    }
  }

  if (gameplayFrozen && postLandingBriefingActive) {
    drawPostLandingBriefingOverlay();
  }

  if (!gameplayFrozen && airSupply <= 0) {
    gameState = "lose";
    stopMusic();
    drawLoseScreen();
    noLoop();
    return;
  }

  if (!gameplayFrozen && distance <= 0) {
    gameState = "win";
    stopMusic();
    drawWinScreen();
    noLoop();
    return;
  }
}

// =====================
// PLAYER
// =====================
function updateAstronaut() {
  if (gameplayFrozen && !wasGameplayFrozenLastFrame) {
    frozenAstronautBaseY = astronautY;
  }

  // Determine effective movement speed this frame
  let effectiveSpeed = speed;
  if (activeEffect === "slow") {
    effectiveSpeed *= SLOW_MULT; // movement is sluggish
  }

  if (!gameplayFrozen) {
    if (keyIsDown(UP_ARROW)) astronautY -= effectiveSpeed;
    if (keyIsDown(DOWN_ARROW)) astronautY += effectiveSpeed;

    astronautY = constrain(astronautY, 0, 420);

    // Advance spin angle each frame while spinning
    if (activeEffect === "spin") {
      spinAngle += SPIN_RATE;
    }
  } else if (thrusterControlPromptActive) {
    if (keyIsDown(UP_ARROW)) {
      astronautY -= effectiveSpeed;
      thrusterUpPressed = true;
    }
    if (keyIsDown(DOWN_ARROW)) {
      astronautY += effectiveSpeed;
      thrusterDownPressed = true;
    }

    astronautY = constrain(astronautY, 0, 420);
  } else {
    // While frozen, keep a gentle idle bob so the astronaut feels alive.
    astronautY = constrain(
      frozenAstronautBaseY + sin(frameCount * 0.02) * 8,
      0,
      420,
    );
  }

  wasGameplayFrozenLastFrame = gameplayFrozen;

  // Decide whether to draw (blink logic unchanged)
  let shouldDrawAstronaut = true;
  if (blinkFramesLeft > 0) {
    let toggleIndex = floor(blinkFramesLeft / BLINK_TOGGLE_EVERY);
    shouldDrawAstronaut = toggleIndex % 2 === 0;
    blinkFramesLeft--;
  }

  if (shouldDrawAstronaut) {
    let aw = 60, ah = 90;
    let cx = astronautX + 25;
    let cy = astronautY + 40;

    if (activeEffect === "spin") {
      push();
      translate(cx, cy);
      rotate(spinAngle);
      image(imgDefaultPose, 0, 0, aw, ah);
      pop();
    } else {
      image(imgDefaultPose, cx, cy, aw, ah);
    }
  }
}

function drawAirPulses() {
  noStroke();

  for (let i = airPulses.length - 1; i >= 0; i--) {
    let p = airPulses[i];

    if (activeEffect === "spin") {
      fill(255, 210, 30, p.alpha);
    } else if (activeEffect === "slow") {
      fill(255, 55, 55, p.alpha);
    } else {
      fill(180, 220, 255, p.alpha);
    }
    circle(p.x, p.y, p.size);

    p.x -= p.speedX;
    p.alpha -= 3;
    p.size += 0.2;

    if (p.alpha <= 0 || p.x < -20) {
      airPulses.splice(i, 1);
    }
  }
}

// =====================
// ENVIRONMENT
// =====================
function drawMars() {
  // Stars
  fill(255); noStroke();
  for (let s of stars) {
    if (!gameplayFrozen) { s.x -= gameSpeed * 0.2; if (s.x < 0) s.x += width; }
    circle(s.x, s.y, 2);
  }
 
  // Background planets (very slow parallax)
  for (let p of bgPlanets) {
    tint(255, 180); // slight transparency
    image(p.img, p.x, p.y, p.size, p.size);
    noTint();
    if (!gameplayFrozen) {
      p.x -= p.speed;
      if (p.x < -p.size) p.x = width + p.size;
    }
  }
 
  // Mid-layer clouds
  for (let i = bgClouds.length - 1; i >= 0; i--) {
    let c = bgClouds[i];
    tint(255, c.alpha);
    image(c.img, c.x, c.y, c.size, c.size * 0.55);
    noTint();
    if (!gameplayFrozen) {
      c.x -= c.speed;
      if (c.x < -c.size) bgClouds.splice(i, 1);
    }
  }
  // Keep cloud count topped up
  if (!gameplayFrozen && bgClouds.length < 5 && random() < 0.005) spawnBgCloud();
 
  // Mars ground
  fill(180, 80, 50);
  noStroke();
  rect(0, 500, width, 100);
 
  // Volcano decorations on the ground
  push();
  imageMode(CORNER);
  image(imgVolcano1, 0,   460, 90, 90);
  image(imgVolcano2, width - 100, 455, 100, 95);
  pop();
}

// =====================
// OBSTACLES
// =====================
function drawObstacles() {
  if (hitCooldownFrames > 0 && !gameplayFrozen) hitCooldownFrames--;
 
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let o = obstacles[i];
 
    // Draw rock image centred on its bounding box
    image(o.img, o.x + o.w / 2, o.y + o.h / 2, o.w, o.h);
 
    if (!gameplayFrozen) {
      o.x -= gameSpeed;
      if (o.x < -100) { obstacles.splice(i, 1); continue; }
 
      // Collision
      let hit =
        astronautX + 50 > o.x && astronautX < o.x + o.w &&
        astronautY + 80 > o.y && astronautY < o.y + o.h;
      if (hit) {
        airSupply -= 1;
        if (hitCooldownFrames === 0) {
          sfxHit();
          blinkFramesLeft = BLINK_TOGGLES * BLINK_TOGGLE_EVERY;
          hitCooldownFrames = 20;
        }
      }
    }
  }
}

// =====================
// UI
// =====================
function drawUI() {
  // Air bar background
  noStroke();
  fill(0, 0, 0, 100);
  rect(15, 15, 200, 24, 4);

  // Air bar fill — colour changes with supply
  let pct = constrain(airSupply / 100, 0, 1);
  if (pct > 0.5) fill(60, 200, 120);
  else if (pct > 0.25) fill(230, 160, 30);
  else fill(220, 60, 50);

  if (pct <= 0.25) {
    if (!lowAirWarningPlayed) {
      sfxMCWarning();
      lowAirWarningPlayed = true;
      lowAirWarningTextStartMs = millis();
      lowAirWarningTextUntilMs = lowAirWarningTextStartMs + 2000;
    }
  } else {
    lowAirWarningPlayed = false;
  }

  rect(16, 16, 200 * pct, 24, 4);

  // Air label
  fill(255);
  textSize(18);
  textAlign(LEFT, CENTER);
  text("AIR", 24, 30);

  // Status bar on the right, matching AIR bar dimensions.
  const statusBarX = width - 15 - 280;
  const statusBarY = 15;
  const statusBarW = 280;
  const statusBarH = 24;

  noStroke();
  fill(0, 0, 0, 100);
  rect(statusBarX, statusBarY, statusBarW, statusBarH, 4);

  let statusR = 60;
  let statusG = 200;
  let statusB = 120;
  if (activeEffect === "slow") {
    statusR = 255;
    statusG = 55;
    statusB = 55;
  } else if (activeEffect === "spin") {
    statusR = 255;
    statusG = 210;
    statusB = 30;
  }

  fill(statusR, statusG, statusB, 150);
  rect(statusBarX + 1, statusBarY + 1, statusBarW - 2, statusBarH - 2, 4);

  fill(255);
  textSize(18);
  textAlign(LEFT, CENTER);
  text("STATUS:", statusBarX + 8, statusBarY + statusBarH / 2 + 1);

  textAlign(RIGHT, CENTER);
  text(
    statusText,
    statusBarX + statusBarW - 8,
    statusBarY + statusBarH / 2 + 1,
  );

  // Distance bar along the bottom
  let barX = 15;
  let barY = height - 40;
  let barW = width - 30;
  let barH = 28;

  fill(0, 0, 0, 120);
  rect(barX, barY, barW, barH, 6);
  fill(20, 39, 97);
  rect(barX, barY, barW * distanceBarDisplay, barH, 5);

  fill(235);
  textSize(18);
  textAlign(LEFT, CENTER);
  text("PROGRESS TO BASE", barX + 8, barY + barH / 2 + 1);

  textAlign(RIGHT, CENTER);
  text(floor(distance) + "m", barX + barW - 10, barY + barH / 2 + 1);
}

// =====================
// WIN / LOSE SCREENS
// =====================
function drawLoseScreen() {
  background(8, 14, 34);
  image(imgDeathPose, width / 2, height / 2 - 100, 80, 110);
  fill(255, 0, 0, 175);
  textAlign(CENTER);
  textSize(45);
  text("YOU RAN OUT OF AIR!", width / 2, height / 2 - 20);

  textSize(22);
  fill(255, 255, 255, 175);
  text("Press R to restart", width / 2, height / 2 + 50);
  fill(255, 255, 255, 100);
  text("TIP: press P to pause and unpause the game", width / 2, height - 50);
}

function drawWinScreen() {
  background(8, 14, 34);
  image(imgCelebratoryPose, width / 2, height / 2 - 100, 80, 110);
  fill(60, 180, 100);
  textSize(45);
  textAlign(CENTER);
  text("MISSION ACCOMPLISHED!", width / 2, height / 2 - 20);
  textSize(24);
  fill(255, 255, 255, 175);
  text("Press R to play again", width / 2, height / 2 + 40);
}

// =====================
// START SCREEN
// =====================
function drawStartScreen() {
  background(10, 20, 50);

  // Draw the Mars scenery in the background for atmosphere.
  fill(255);
  noStroke();
  for (let s of stars) {
    s.x -= gameSpeed * 0.9;
    if (s.x < 0) s.x += width;
    circle(s.x, s.y, 2);
  }

  if (launchTransitionActive) {
    launchRocketX += 8;
    drawRocketPlaceholder(launchRocketX, launchRocketY, 110);

    screenFadeAlpha = min(255, screenFadeAlpha + 6);
    noStroke();
    fill(0, 0, 0, screenFadeAlpha);
    rect(0, 0, width, height);

    if (launchRocketX > width + 120 && screenFadeAlpha >= 255) {
      launchTransitionActive = false;
      fadeInFromBlack = true;
      gameState = "playing";
      lastAirDrain = millis();
      gameplayFrozen = true;
    }
    return;
  }

  // Sideways rocket placeholder with smooth, slow bobbing motion.
  const rocketBobY = sin(frameCount * 0.03) * 8;
  const rocketTargetBaseY = showTutorialMessage ? 230 : 300;
  rocketBaseYDisplay = lerp(rocketBaseYDisplay, rocketTargetBaseY, 0.05);
  drawRocketPlaceholder(width / 2, rocketBaseYDisplay + rocketBobY, 110);

  if (showTutorialMessage) {
    const copyButtonX = width / 2 - COPY_BUTTON_W / 2;
    fill(220);
    textAlign(CENTER);
    textSize(22);

    if (tutorialMessageStep === 1) {
      let elapsedMs = millis() - tutorialMessageStartMs;
      let charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
      charsVisible = constrain(charsVisible, 0, TUTORIAL_MESSAGE_1.length);
      text(TUTORIAL_MESSAGE_1.substring(0, charsVisible), width / 2, 490);

      if (charsVisible >= TUTORIAL_MESSAGE_1.length) {
        fill(80, 140, 230);
        noStroke();
        rect(copyButtonX, COPY_BUTTON_Y, COPY_BUTTON_W, COPY_BUTTON_H, 10);

        if (
          mouseX > copyButtonX &&
          mouseX < copyButtonX + COPY_BUTTON_W &&
          mouseY > COPY_BUTTON_Y &&
          mouseY < COPY_BUTTON_Y + COPY_BUTTON_H
        ) {
          fill(255, 255, 255, 35);
          rect(copyButtonX, COPY_BUTTON_Y, COPY_BUTTON_W, COPY_BUTTON_H, 10);
        }

        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("Copy!", width / 2, COPY_BUTTON_Y + COPY_BUTTON_H / 2);
      }
    } else if (tutorialMessageStep === 2) {
      let elapsedMs = millis() - tutorialMessageStartMs;
      let charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
      charsVisible = constrain(charsVisible, 0, TUTORIAL_MESSAGE_2.length);
      text(TUTORIAL_MESSAGE_2.substring(0, charsVisible), width / 2, 490);

      if (charsVisible >= TUTORIAL_MESSAGE_2.length) {
        fill(80, 140, 230);
        noStroke();
        rect(copyButtonX, COPY_BUTTON_Y, COPY_BUTTON_W, COPY_BUTTON_H, 10);

        if (
          mouseX > copyButtonX &&
          mouseX < copyButtonX + COPY_BUTTON_W &&
          mouseY > COPY_BUTTON_Y &&
          mouseY < COPY_BUTTON_Y + COPY_BUTTON_H
        ) {
          fill(255, 255, 255, 35);
          rect(copyButtonX, COPY_BUTTON_Y, COPY_BUTTON_W, COPY_BUTTON_H, 10);
        }

        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("Copy...", width / 2, COPY_BUTTON_Y + COPY_BUTTON_H / 2);
      }
    } else if (tutorialMessageStep === 3) {
      let elapsedMs = millis() - tutorialMessageStartMs;
      let charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
      charsVisible = constrain(charsVisible, 0, TUTORIAL_MESSAGE_3.length);
      text(TUTORIAL_MESSAGE_3.substring(0, charsVisible), width / 2, 490);

      if (charsVisible >= TUTORIAL_MESSAGE_3.length) {
        fill(80, 140, 230);
        noStroke();
        rect(copyButtonX, COPY_BUTTON_Y, COPY_BUTTON_W, COPY_BUTTON_H, 10);

        if (
          mouseX > copyButtonX &&
          mouseX < copyButtonX + COPY_BUTTON_W &&
          mouseY > COPY_BUTTON_Y &&
          mouseY < COPY_BUTTON_Y + COPY_BUTTON_H
        ) {
          fill(255, 255, 255, 35);
          rect(copyButtonX, COPY_BUTTON_Y, COPY_BUTTON_W, COPY_BUTTON_H, 10);
        }

        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("Copy...", width / 2, COPY_BUTTON_Y + COPY_BUTTON_H / 2);
      }
    } else if (tutorialMessageStep === 4) {
      let elapsedMs = millis() - tutorialMessageStartMs;
      let charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
      charsVisible = constrain(charsVisible, 0, TUTORIAL_MESSAGE_4.length);
      text(TUTORIAL_MESSAGE_4.substring(0, charsVisible), width / 2, 490);

      if (charsVisible >= TUTORIAL_MESSAGE_4.length) {
        fill(80, 140, 230);
        noStroke();
        rect(copyButtonX, COPY_BUTTON_Y, COPY_BUTTON_W, COPY_BUTTON_H, 10);

        if (
          mouseX > copyButtonX &&
          mouseX < copyButtonX + COPY_BUTTON_W &&
          mouseY > COPY_BUTTON_Y &&
          mouseY < COPY_BUTTON_Y + COPY_BUTTON_H
        ) {
          fill(255, 255, 255, 35);
          rect(copyButtonX, COPY_BUTTON_Y, COPY_BUTTON_W, COPY_BUTTON_H, 10);
        }

        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("Copy!", width / 2, COPY_BUTTON_Y + COPY_BUTTON_H / 2);
      }
    } else {
      let elapsedMs = millis() - tutorialMessageStartMs;
      let charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
      charsVisible = constrain(charsVisible, 0, TUTORIAL_MESSAGE_5.length);
      text(TUTORIAL_MESSAGE_5.substring(0, charsVisible), width / 2, 490);

      if (charsVisible >= TUTORIAL_MESSAGE_5.length) {
        textSize(20);
        const finalButtonW =
          textWidth(FINAL_BUTTON_LABEL) + FINAL_BUTTON_PADDING_X * 2;
        const finalButtonX = width / 2 - finalButtonW / 2;

        fill(80, 140, 230);
        noStroke();
        rect(finalButtonX, COPY_BUTTON_Y, finalButtonW, COPY_BUTTON_H, 10);

        if (
          mouseX > finalButtonX &&
          mouseX < finalButtonX + finalButtonW &&
          mouseY > COPY_BUTTON_Y &&
          mouseY < COPY_BUTTON_Y + COPY_BUTTON_H
        ) {
          fill(255, 255, 255, 35);
          rect(finalButtonX, COPY_BUTTON_Y, finalButtonW, COPY_BUTTON_H, 10);
        }

        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(FINAL_BUTTON_LABEL, width / 2, COPY_BUTTON_Y + COPY_BUTTON_H / 2);
      }
    }
    return;
  }

  // Title at the top
  fill(255);
  textAlign(CENTER);
  textSize(45);
  text("THE UNLUCKY ASTRONAUT", width / 2, 100);

  // Menu buttons
  const buttonY = 490;
  const buttonW = 132;
  const buttonH = 46;
  const gap = 18;
  const tutorialX = width / 2 - buttonW - gap / 2;
  const startX = width / 2 + gap / 2;

  fill(60, 180, 100);
  noStroke();
  rect(startX, buttonY, buttonW, buttonH, 12);
  fill(70, 120, 210);
  rect(tutorialX, buttonY, buttonW, buttonH, 12);

  // Subtle hover effect
  if (
    mouseX > startX &&
    mouseX < startX + buttonW &&
    mouseY > buttonY &&
    mouseY < buttonY + buttonH
  ) {
    fill(255, 255, 255, 35);
    rect(startX, buttonY, buttonW, buttonH, 12);
  }
  if (
    mouseX > tutorialX &&
    mouseX < tutorialX + buttonW &&
    mouseY > buttonY &&
    mouseY < buttonY + buttonH
  ) {
    fill(255, 255, 255, 35);
    rect(tutorialX, buttonY, buttonW, buttonH, 12);
  }

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("START", startX + buttonW / 2, buttonY + buttonH / 2 + 1);
  textSize(20);
  text("TUTORIAL", tutorialX + buttonW / 2, buttonY + buttonH / 2 + 1);
}

function drawRocketPlaceholder(cx, cy, size) {
  noStroke();

  // Main rocket body: triangle laying on its side (pointing right).
  fill(220, 230, 255, 230);
  triangle(
    cx + size * 0.55,
    cy,
    cx - size * 0.45,
    cy - size * 0.35,
    cx - size * 0.45,
    cy + size * 0.35,
  );

  // Small exhaust glow at the back for readability.
  fill(255, 180, 90, 180);
  triangle(
    cx - size * 0.45,
    cy,
    cx - size * 0.68,
    cy - size * 0.14,
    cx - size * 0.68,
    cy + size * 0.14,
  );
}

function drawPausedScreen() {
  background(8, 14, 34);

  fill(255);
  textAlign(CENTER);
  textSize(64);
  text("PAUSED", width / 2, height / 2 - 20);

  textSize(22);
  fill(210);
  text("Press P to resume", width / 2, height / 2 + 50);
  text("Press R to return to start", width / 2, height / 2 + 84);
}

function drawPostLandingBriefingOverlay() {
  const panelW = min(width - 160, 900);
  const panelH = 210;
  const panelX = width / 2 - panelW / 2;
  const panelY = height / 2 - panelH / 2;

  const elapsedMs = millis() - postLandingBriefingStartMs;
  let charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
  charsVisible = constrain(charsVisible, 0, POST_LANDING_MESSAGE.length);

  fill(230);
  textAlign(CENTER);
  textSize(20);
  text(
    POST_LANDING_MESSAGE.substring(0, charsVisible),
    width / 2,
    height / 2 - 25,
  );

  if (charsVisible >= POST_LANDING_MESSAGE.length) {
    textSize(20);
    const btnW =
      textWidth(POST_LANDING_BUTTON_LABEL) + POST_LANDING_BUTTON_PADDING_X * 2;
    const btnX = width / 2 - btnW / 2;
    const btnY = height / 2 + 28;

    fill(80, 140, 230);
    noStroke();
    rect(btnX, btnY, btnW, POST_LANDING_BUTTON_H, 10);

    if (
      mouseX > btnX &&
      mouseX < btnX + btnW &&
      mouseY > btnY &&
      mouseY < btnY + POST_LANDING_BUTTON_H
    ) {
      fill(255, 255, 255, 35);
      rect(btnX, btnY, btnW, POST_LANDING_BUTTON_H, 10);
    }

    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(
      POST_LANDING_BUTTON_LABEL,
      width / 2,
      btnY + POST_LANDING_BUTTON_H / 2,
    );
  }
}

function resetGameToStart() {
  astronautX = 150;
  astronautY = 400;

  obstacles = [];
  obstacleTimer = 0;
  obstacleInterval = 120;
  obstaclesPerWave = 1;
  nextObstacleIncreaseAt = 400;
  spawnObstacle();

  airSupply = 100;
  distance = startingDistance;
  distanceBarDisplay = 0;
  lowAirWarningPlayed = false;
  lowAirWarningTextStartMs = 0;
  lowAirWarningTextUntilMs = 0;
  lastAirDrain = millis();

  airPulses = [];
  blinkFramesLeft = 0;
  hitCooldownFrames = 0;

  stardustParticles = [];
  stardustTimer = 0;
  stardustInterval = 300;

  activeEffect = null;
  statusText = "STABLE";
  spinAngle = 0;

  gameState = "start";
  showTutorialMessage = false;
  tutorialMessageStep = 1;
  rocketBaseYDisplay = 300;
  launchTransitionActive = false;
  fadeInFromBlack = false;
  gameplayFrozen = false;
  postLandingBriefingActive = false;
  postLandingBriefingStartMs = 0;
  airSupplyPromptActive = false;
  airSupplyPromptStartMs = 0;
  navigationPromptActive = false;
  navigationPromptStartMs = 0;
  statusPromptActive = false;
  statusPromptStartMs = 0;
  checklistCompletePromptActive = false;
  checklistCompletePromptStartMs = 0;
  thrusterControlPromptActive = false;
  thrusterUpPressed = false;
  thrusterDownPressed = false;
  thrusterCompletePromptActive = false;
  thrusterCompletePromptStartMs = 0;
  collisionReminderPromptActive = false;
  collisionReminderPromptStartMs = 0;
  stardustWarningPromptActive = false;
  stardustWarningPromptStartMs = 0;
  oxygenWarningPromptActive = false;
  oxygenWarningPromptStartMs = 0;
  finalSignoffPromptActive = false;
  finalSignoffPromptStartMs = 0;
  screenFadeAlpha = 0;
  launchRocketX = 0;
  launchRocketY = 300;

  restartMusic();

  loop();
}

function keyPressed() {
  userStartAudio();

  let k = key.toLowerCase();

  if (k === "p") {
    if (
      gameState === "playing" &&
      gameplayFrozen &&
      !postLandingBriefingActive
    ) {
      gameplayFrozen = false;
      lastAirDrain = millis();
    } else if (gameState === "playing") {
      gameState = "paused";
      pauseMusic();
    } else if (gameState === "paused") {
      gameState = "playing";
      resumeMusic();
      // Prevent immediate air drain on resume due to elapsed paused time.
      lastAirDrain = millis();
    }
    return;
  }

  if (k === "r") {
    resetGameToStart();
  }
}

// =====================
// MOUSE CLICK — Menu buttons
// =====================
function mousePressed() {
  // Unlock audio on first interaction
  userStartAudio();

  if (gameState === "playing" && gameplayFrozen && postLandingBriefingActive) {
    const elapsedMs = millis() - postLandingBriefingStartMs;
    const charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);

    if (charsVisible >= POST_LANDING_MESSAGE.length) {
      textSize(18);
      const btnW =
        textWidth(POST_LANDING_BUTTON_LABEL) +
        POST_LANDING_BUTTON_PADDING_X * 2;
      const btnX = width / 2 - btnW / 2;
      const btnY = height / 2 + 28;

      if (
        mouseX > btnX &&
        mouseX < btnX + btnW &&
        mouseY > btnY &&
        mouseY < btnY + POST_LANDING_BUTTON_H
      ) {
        postLandingBriefingActive = false;
        airSupplyPromptActive = true;
        airSupplyPromptStartMs = millis();
        sfxMC7();
        return;
      }
    }
    return;
  }

  if (gameState === "playing" && gameplayFrozen && airSupplyPromptActive) {
    const elapsedMs = millis() - airSupplyPromptStartMs;
    const charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);

    if (charsVisible >= AIR_SUPPLY_PROMPT_MESSAGE.length) {
      textSize(20);
      const airPromptButtonW = textWidth("Check!") + 40;
      const airPromptButtonH = 42;
      const airPromptButtonX = 15;
      const airPromptButtonY = 15 + 24 + 14;

      if (
        mouseX > airPromptButtonX &&
        mouseX < airPromptButtonX + airPromptButtonW &&
        mouseY > airPromptButtonY &&
        mouseY < airPromptButtonY + airPromptButtonH
      ) {
        airSupplyPromptActive = false;
        navigationPromptActive = true;
        navigationPromptStartMs = millis();
        sfxMC8();
        return;
      }
    }

    return;
  }

  if (gameState === "playing" && gameplayFrozen && navigationPromptActive) {
    const elapsedMs = millis() - navigationPromptStartMs;
    const charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);

    if (charsVisible >= NAVIGATION_PROMPT_MESSAGE.length) {
      textSize(20);
      const navPromptButtonW = textWidth("Check!") + 40;
      const navPromptButtonH = 42;
      const navPromptButtonX = width / 2 - navPromptButtonW / 2;
      const navPromptButtonY = height - 40 - navPromptButtonH - 10;

      if (
        mouseX > navPromptButtonX &&
        mouseX < navPromptButtonX + navPromptButtonW &&
        mouseY > navPromptButtonY &&
        mouseY < navPromptButtonY + navPromptButtonH
      ) {
        navigationPromptActive = false;
        statusPromptActive = true;
        statusPromptStartMs = millis();
        sfxMC9();
        return;
      }
    }

    return;
  }

  if (gameState === "playing" && gameplayFrozen && statusPromptActive) {
    const elapsedMs = millis() - statusPromptStartMs;
    const charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);

    if (charsVisible >= STATUS_PROMPT_MESSAGE.length) {
      textSize(20);
      const statusPromptButtonW = textWidth("Check!") + 40;
      const statusPromptButtonH = 42;
      const statusPromptButtonX =
        width - 15 - 280 + (280 - statusPromptButtonW) / 2;
      const statusPromptButtonY = 15 + 24 + 14;

      if (
        mouseX > statusPromptButtonX &&
        mouseX < statusPromptButtonX + statusPromptButtonW &&
        mouseY > statusPromptButtonY &&
        mouseY < statusPromptButtonY + statusPromptButtonH
      ) {
        statusPromptActive = false;
        checklistCompletePromptActive = true;
        checklistCompletePromptStartMs = millis();
        sfxMC10();
        return;
      }
    }

    return;
  }

  if (
    gameState === "playing" &&
    gameplayFrozen &&
    checklistCompletePromptActive
  ) {
    const elapsedMs = millis() - checklistCompletePromptStartMs;
    const charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);

    if (charsVisible >= CHECKLIST_COMPLETE_MESSAGE.length) {
      textSize(20);
      const finalButtonW = textWidth("Clear!") + 40;
      const finalButtonH = 42;
      const finalButtonX = width / 2 - finalButtonW / 2;
      const finalButtonY = height / 2 + 28;

      if (
        mouseX > finalButtonX &&
        mouseX < finalButtonX + finalButtonW &&
        mouseY > finalButtonY &&
        mouseY < finalButtonY + finalButtonH
      ) {
        checklistCompletePromptActive = false;
        thrusterControlPromptActive = true;
        thrusterUpPressed = false;
        thrusterDownPressed = false;
        sfxMC11();
        return;
      }
    }

    return;
  }

  if (
    gameState === "playing" &&
    gameplayFrozen &&
    thrusterControlPromptActive
  ) {
    if (thrusterUpPressed && thrusterDownPressed) {
      textSize(20);
      const thrusterCheckButtonW = textWidth("Check!") + 40;
      const thrusterCheckButtonH = 42;
      const thrusterCheckButtonX = width / 2 - thrusterCheckButtonW / 2;
      const thrusterCheckButtonY = height / 2 + 28;

      if (
        mouseX > thrusterCheckButtonX &&
        mouseX < thrusterCheckButtonX + thrusterCheckButtonW &&
        mouseY > thrusterCheckButtonY &&
        mouseY < thrusterCheckButtonY + thrusterCheckButtonH
      ) {
        thrusterControlPromptActive = false;
        thrusterCompletePromptActive = true;
        thrusterCompletePromptStartMs = millis();
        sfxMC12();
        return;
      }
    }

    return;
  }

  if (
    gameState === "playing" &&
    gameplayFrozen &&
    thrusterCompletePromptActive
  ) {
    const elapsedMs = millis() - thrusterCompletePromptStartMs;
    const charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);

    if (charsVisible >= THRUSTER_COMPLETE_MESSAGE.length) {
      textSize(20);
      const finalCopyButtonW = textWidth("Copy") + 40;
      const finalCopyButtonH = 42;
      const finalCopyButtonX = width / 2 - finalCopyButtonW / 2;
      const finalCopyButtonY = height / 2 + 28;

      if (
        mouseX > finalCopyButtonX &&
        mouseX < finalCopyButtonX + finalCopyButtonW &&
        mouseY > finalCopyButtonY &&
        mouseY < finalCopyButtonY + finalCopyButtonH
      ) {
        thrusterCompletePromptActive = false;
        collisionReminderPromptActive = true;
        collisionReminderPromptStartMs = millis();
        sfxMC13();
        return;
      }
    }

    return;
  }

  if (
    gameState === "playing" &&
    gameplayFrozen &&
    collisionReminderPromptActive
  ) {
    const elapsedMs = millis() - collisionReminderPromptStartMs;
    const charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);

    if (charsVisible >= COLLISION_REMINDER_MESSAGE.length) {
      textSize(20);
      const collisionCopyButtonW = textWidth("Copy") + 40;
      const collisionCopyButtonH = 42;
      const collisionCopyButtonX = width / 2 - collisionCopyButtonW / 2;
      const collisionCopyButtonY = height / 2 + 28;

      if (
        mouseX > collisionCopyButtonX &&
        mouseX < collisionCopyButtonX + collisionCopyButtonW &&
        mouseY > collisionCopyButtonY &&
        mouseY < collisionCopyButtonY + collisionCopyButtonH
      ) {
        collisionReminderPromptActive = false;
        stardustWarningPromptActive = true;
        stardustWarningPromptStartMs = millis();
        sfxMC14();
        return;
      }
    }

    return;
  }

  if (
    gameState === "playing" &&
    gameplayFrozen &&
    stardustWarningPromptActive
  ) {
    const elapsedMs = millis() - stardustWarningPromptStartMs;
    const charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);

    if (charsVisible >= STARDUST_WARNING_MESSAGE.length) {
      textSize(20);
      const stardustCopyButtonW = textWidth("Copy") + 40;
      const stardustCopyButtonH = 42;
      const stardustCopyButtonX = width / 2 - stardustCopyButtonW / 2;
      const stardustCopyButtonY = height / 2 + 28;

      if (
        mouseX > stardustCopyButtonX &&
        mouseX < stardustCopyButtonX + stardustCopyButtonW &&
        mouseY > stardustCopyButtonY &&
        mouseY < stardustCopyButtonY + stardustCopyButtonH
      ) {
        stardustWarningPromptActive = false;
        oxygenWarningPromptActive = true;
        oxygenWarningPromptStartMs = millis();
        sfxMC15();
        return;
      }
    }

    return;
  }

  if (gameState === "playing" && gameplayFrozen && oxygenWarningPromptActive) {
    const elapsedMs = millis() - oxygenWarningPromptStartMs;
    const charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);

    if (charsVisible >= OXYGEN_WARNING_MESSAGE.length) {
      textSize(20);
      const oxygenCopyButtonW = textWidth("Copy") + 40;
      const oxygenCopyButtonH = 42;
      const oxygenCopyButtonX = width / 2 - oxygenCopyButtonW / 2;
      const oxygenCopyButtonY = height / 2 + 28;

      if (
        mouseX > oxygenCopyButtonX &&
        mouseX < oxygenCopyButtonX + oxygenCopyButtonW &&
        mouseY > oxygenCopyButtonY &&
        mouseY < oxygenCopyButtonY + oxygenCopyButtonH
      ) {
        oxygenWarningPromptActive = false;
        finalSignoffPromptActive = true;
        finalSignoffPromptStartMs = millis();
        sfxMC16();
        return;
      }
    }

    return;
  }

  if (gameState === "playing" && gameplayFrozen && finalSignoffPromptActive) {
    const elapsedMs = millis() - finalSignoffPromptStartMs;
    const charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);

    if (charsVisible >= FINAL_SIGNOFF_MESSAGE.length) {
      textSize(20);
      const startMissionButtonW = textWidth("Start Mission") + 40;
      const startMissionButtonH = 42;
      const startMissionButtonX = width / 2 - startMissionButtonW / 2;
      const startMissionButtonY = height / 2 + 28;

      if (
        mouseX > startMissionButtonX &&
        mouseX < startMissionButtonX + startMissionButtonW &&
        mouseY > startMissionButtonY &&
        mouseY < startMissionButtonY + startMissionButtonH
      ) {
        finalSignoffPromptActive = false;
        gameplayFrozen = false;
        lastAirDrain = millis();
        return;
      }
    }

    return;
  }

  if (gameState === "start") {
    if (showTutorialMessage) {
      const elapsedMs = millis() - tutorialMessageStartMs;
      const charsVisible = floor(elapsedMs / TUTORIAL_TYPE_MS_PER_CHAR);
      const currentMessageLen =
        tutorialMessageStep === 1
          ? TUTORIAL_MESSAGE_1.length
          : tutorialMessageStep === 2
            ? TUTORIAL_MESSAGE_2.length
            : tutorialMessageStep === 3
              ? TUTORIAL_MESSAGE_3.length
              : tutorialMessageStep === 4
                ? TUTORIAL_MESSAGE_4.length
                : TUTORIAL_MESSAGE_5.length;
      const copyButtonX = width / 2 - COPY_BUTTON_W / 2;
      textSize(20);
      const finalButtonW =
        textWidth(FINAL_BUTTON_LABEL) + FINAL_BUTTON_PADDING_X * 2;
      const finalButtonX = width / 2 - finalButtonW / 2;

      if (charsVisible >= currentMessageLen) {
        const overGenericCopyButton =
          mouseX > copyButtonX &&
          mouseX < copyButtonX + COPY_BUTTON_W &&
          mouseY > COPY_BUTTON_Y &&
          mouseY < COPY_BUTTON_Y + COPY_BUTTON_H;

        const overFinalButton =
          mouseX > finalButtonX &&
          mouseX < finalButtonX + finalButtonW &&
          mouseY > COPY_BUTTON_Y &&
          mouseY < COPY_BUTTON_Y + COPY_BUTTON_H;

        if (
          (tutorialMessageStep < 5 && overGenericCopyButton) ||
          (tutorialMessageStep === 5 && overFinalButton)
        ) {
          if (tutorialMessageStep === 1) {
            tutorialMessageStep = 2;
            tutorialMessageStartMs = millis();
            sfxMC2();
          } else if (tutorialMessageStep === 2) {
            tutorialMessageStep = 3;
            tutorialMessageStartMs = millis();
            sfxMC3();
          } else if (tutorialMessageStep === 3) {
            tutorialMessageStep = 4;
            tutorialMessageStartMs = millis();
            sfxMC4();
          } else if (tutorialMessageStep === 4) {
            tutorialMessageStep = 5;
            tutorialMessageStartMs = millis();
            sfxMC5();
          } else if (tutorialMessageStep === 5) {
            // Start cinematic launch: rocket exits right, fade out, then fade into gameplay.
            launchTransitionActive = true;
            showTutorialMessage = false;
            launchRocketX = width / 2;
            launchRocketY = rocketBaseYDisplay;
            screenFadeAlpha = 0;
          }
          return;
        }
      }

      return;
    }

    const buttonY = 490;
    const buttonW = 132;
    const buttonH = 46;
    const gap = 18;
    const tutorialX = width / 2 - buttonW - gap / 2;
    const startX = width / 2 + gap / 2;

    if (
      mouseX > startX &&
      mouseX < startX + buttonW &&
      mouseY > buttonY &&
      mouseY < buttonY + buttonH
    ) {
      showTutorialMessage = false;
      tutorialMessageStep = 1;
      gameState = "playing";
      lastAirDrain = millis();
      return;
    }

    if (
      mouseX > tutorialX &&
      mouseX < tutorialX + buttonW &&
      mouseY > buttonY &&
      mouseY < buttonY + buttonH
    ) {
      showTutorialMessage = true;
      tutorialMessageStep = 1;
      tutorialMessageStartMs = millis();
      sfxMC1();
      return;
    }
  }
}

// =====================
// Stardust
// =====================
function spawnStardust() {
  let t = random(["slow", "spin"]);
  let yPos = random(60, 420); // can appear at any flight height
  stardustParticles.push({
    x: width + 24,
    y: yPos,
    baseY: yPos, // used for floating sine animation
    floatPhase: random(TWO_PI),
    type: t,
    radius: 9, // collision uses this too
  });
}

function drawStardust() {
  if (gameplayFrozen) {
    for (let d of stardustParticles) {
      let r, g, b;
      if (d.type === "slow") {
        r = 255;
        g = 55;
        b = 55;
      } else {
        r = 255;
        g = 210;
        b = 30;
      }

      noFill();
      stroke(r, g, b, 28);
      strokeWeight(d.radius * 1.4);
      circle(d.x, d.y, d.radius * 3.6);

      stroke(r, g, b, 55);
      strokeWeight(d.radius * 0.7);
      circle(d.x, d.y, d.radius * 2.4);

      stroke(r, g, b, 90);
      strokeWeight(d.radius * 0.35);
      circle(d.x, d.y, d.radius * 1.5);

      noStroke();
      fill(r, g, b, 210);
      circle(d.x, d.y, d.radius);
    }
    return;
  }

  for (let i = stardustParticles.length - 1; i >= 0; i--) {
    let d = stardustParticles[i];

    // Float up and down with a slow sine wave
    d.y = d.baseY + sin(frameCount * 0.035 + d.floatPhase) * 10;
    d.x -= gameSpeed * 0.75; // slightly slower than obstacles for readability

    // Remove once it scrolls off screen
    if (d.x < -40) {
      stardustParticles.splice(i, 1);
      continue;
    }

    // --- Glow layers (3 concentric transparent rings) ---
    // Red = slow effect   Yellow = spin effect
    let r, g, b;
    if (d.type === "slow") {
      r = 255;
      g = 55;
      b = 55; // warm red
    } else {
      r = 255;
      g = 210;
      b = 30; // golden yellow
    }

    noFill();
    // Outermost ring — very faint
    stroke(r, g, b, 28);
    strokeWeight(d.radius * 1.4);
    circle(d.x, d.y, d.radius * 3.6);

    // Mid ring
    stroke(r, g, b, 55);
    strokeWeight(d.radius * 0.7);
    circle(d.x, d.y, d.radius * 2.4);

    // Inner ring
    stroke(r, g, b, 90);
    strokeWeight(d.radius * 0.35);
    circle(d.x, d.y, d.radius * 1.5);

    // Solid core
    noStroke();
    fill(r, g, b, 210);
    circle(d.x, d.y, d.radius);

    // --- Collision: circle vs astronaut rect ---
    // Find the closest point on the astronaut's bounding box to the stardust centre
    let closestX = constrain(d.x, astronautX, astronautX + 50);
    let closestY = constrain(d.y, astronautY, astronautY + 80);
    let dx = d.x - closestX;
    let dy = d.y - closestY;
    let distSq = dx * dx + dy * dy;

    if (distSq < d.radius * d.radius) {
      // Hit! New effect replaces any existing one immediately.
      activeEffect = d.type;

      if (activeEffect === "spin") {
        statusText = "ORIENTATION LOST";
      } else if (activeEffect === "slow") {
        statusText = "REDUCED MOBILITY";
      }

      // Reset spin angle so the rotation starts fresh
      if (activeEffect === "spin") spinAngle = 0;

      sfxBoostUp();

      stardustParticles.splice(i, 1);
      // Optional: play a soft audio cue here if you add one later
    }
  }
}

function drawEffectHUD() {
  if (!activeEffect) return;

  let label, r, g, b;
  if (activeEffect === "slow") {
    label = "SUIT COMPROMISED: SLOWED";
    r = 255;
    g = 55;
    b = 55;
  } else {
    label = "SUIT COMPROMISED: DISORIENTED";
    r = 255;
    g = 210;
    b = 30;
  }

  // Pill background
  noStroke();
  fill(r, g, b, 40);
  rect(width - 290, 14, 274, 24, 6);

  // Glowing border
  noFill();
  stroke(r, g, b, 100);
  strokeWeight(1);
  rect(width - 290, 14, 274, 24, 6);

  // Label text
  noStroke();
  fill(r, g, b, 230);
  textSize(12);
  textAlign(RIGHT);
  text(label, width - 20, 31);
}

function spawnAirPulse() {
  airPulses.push({
    x: astronautX, // start at astronaut position
    y: astronautY + 40, // vertically centered on the astronaut
    speedX: random(1.5, 3), // drifts leftward
    alpha: 180,
    size: random(8, 16),
  });
}
