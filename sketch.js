// Based on this: https://www.javascript.christmas/2020/16
const SNOW_COLOR = "snow";
const SNOWFLAKE_COUNT = 400;
const SNOWFLAKE_SMALL_SPD = 0.8;
const SNOWFLAKE_MED_SPD = 1;
const SNOWFLAKE_LARGE_SPD = 1.4;
const SNOWFLAKE_SIZE_SMALL = 1.5;
const SNOWFLAKE_SIZE_MED = 3.2;
const SNOWFLAKE_SIZE_LARGE = 5;
let snowflakeObjects = [];

const WIND_SPEED = 0.0015;
const WIND_CHANGE = 0.0025;

const SUN_COLOR = "#fb9062";
const SUN_GLOW = "100";
const SUN_RADIUS = 70;

const SKY_TOP_COLOR = "	#eeaf61";
const SKY_BOT_COLOR = "#6a0d83";
const SKY_SHADE_COUNT = 7;
const SKY_STEP = 4;
const SKY_AMP = 30;
const SKY_ZOOM = 0.008;
const SKY_COLOR = "#B1E8FF";

const RIDGE_TOP_COLOR = "#546bab";
const RIDGE_BOT_COLOR = "#131862";
const RIDGE_COUNT = 6;
const RIDGE_STEP = 4;
const RIDGE_AMP = 100;
const RIDGE_ZOOM = 0.01;

// Draw a simple sun
function drawSun(x, y) {
  fill(SUN_COLOR);
  drawingContext.shadowBlur = SUN_GLOW;
  drawingContext.shadowColor = SUN_COLOR;
  circle(x, y, SUN_RADIUS * 2);
  drawingContext.shadowBlur = 0;
}

// Draw the mountains / ridges
function drawRidge(l, y) {
  // Choose a color for the ridge based on its height
  // Lerpcolor adds gradient between the two colors chosen
  const FILL = lerpColor(color(RIDGE_TOP_COLOR), color(RIDGE_BOT_COLOR), l / (RIDGE_COUNT + 1));
  fill(FILL);

  // Make the ridges based on perlin noise
  beginShape(); // Makes a custom shape
  for (let x = 0; x <= width; x += RIDGE_STEP) {
    const noisedY = noise(x * RIDGE_ZOOM, y);
    vertex(x, y - noisedY * RIDGE_AMP);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  fill(SNOW_COLOR);
}

function drawSky (l, y) {
    // Choose a color for the ridge based on its height
  // Lerpcolor adds gradient between the two colors chosen
  const FILL = lerpColor(color(SKY_TOP_COLOR), color(SKY_BOT_COLOR), l / (SKY_SHADE_COUNT + 1));
  fill(FILL);

  // Make the ridges based on perlin noise
  beginShape(); // Makes a custom shape
  for (let x = 0; x <= width; x += SKY_STEP) {
    const noisedY = noise(x * SKY_ZOOM, y);
    vertex(x, y - noisedY * SKY_AMP);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  fill(SNOW_COLOR);
}

// Snow flake class for objects
class Snowflake {
  constructor(x, y, d, spd) {
    this.x = x;
    this.y = y;
    this.d = d;
    this.spd = spd;
  }
}

// Makes snowflakes of different sizes and speed
function makeSnowflakes (i) {
  let flake = 0;

  if (i % 25 == 0) {
    flake = new Snowflake(random(width), random(height), SNOWFLAKE_SIZE_LARGE, SNOWFLAKE_LARGE_SPD);
  } else if (i % 2 == 0) {
    flake = new Snowflake(random(width), random(height), SNOWFLAKE_SIZE_SMALL, SNOWFLAKE_SMALL_SPD);
  } else {
    flake = new Snowflake(random(width), random(height), SNOWFLAKE_SIZE_MED, SNOWFLAKE_MED_SPD);
  }

  // Add flake to the vector
  snowflakeObjects.push(flake);
}

// Update the snowflake depending on their
// size and position
function updateSnowflake (flake) {
  // Calculate wind using perlin noise
  const wind = noise(flake.d, flake.y * WIND_CHANGE, frameCount * WIND_CHANGE) - 0.5;
  // Update y position
  if (flake.y > (height + flake.d)) {
    flake.y = -flake.d;
    flake.x = random(width);
  } else {
    flake.y += flake.spd;
  }

  // Update x position
  if (flake.x > (width + flake.d)) {
    flake.x = -flake.d;
  } else {
    flake.x += wind * WIND_SPEED * flake.x;
  }
}

function setup() {
  createCanvas(800, 600);

  // Add all the snow flakes to the vector
  for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
    makeSnowflakes(i);
  }
  noStroke();
}

function draw() {
  const skyHeight = round(height * 0.4);
  
  for (let k = 0; k < SKY_SHADE_COUNT; k++) {
    let skyTopHeight = k * (height / 10);
    drawSky(k+1, skyTopHeight);
  }
  drawSun(width/2, skyHeight - RIDGE_AMP / 2);
  
  for (let j = 0; j < RIDGE_COUNT; j++) {
    let ridgeHeight = (skyHeight+15) + (j * (height / 5));
    drawRidge(j+1, ridgeHeight);
  }
  
  // Let's draw the snowflakes
  for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
    let snowflake = snowflakeObjects[i];
    circle(snowflake.x, snowflake.y, snowflake.d);
    updateSnowflake(snowflake);
  }
}