let particles = [];
let particleSpeed = 1;
const particleNum = 1200;
const noiseFactor = 0.008; // changes noise granularity
const drawTime_s = 0.7;

function setup() {
  createCanvas(600, 800);
  background(38, 70, 83);
  
  // Add 1000 particles at random locations to the array
  for (let i = 0; i < particleNum; i++) {
    particles.push(createVector(random(width/4, width/4*3), random(height/6,height/6*5)));
  }
  
}

function draw() {
  for (let i = 0; i < particleNum; i++) {
    // Choose color, weight, speed, and draw particle
    chooseLineFeatures(i);
    let particle = particles[i];
    point(particle.x, particle.y);

    // Move the particles using Perlin Noise
    let particleNoise = noise(particle.x * noiseFactor, particle.y * noiseFactor);
    let flowAngle = particleNoise * TAU; // TAU == 2 * PI
    particle.x += cos(flowAngle) * particleSpeed;
    particle.y += sin(flowAngle) * particleSpeed;
  }
  
  // Stop drawing after drawTime_s seconds
  endDraw(.3);
}

function endDraw (drawTime_s) {
  if (drawTime_s < 0) {
    return;
  } else {
    if (millis() >= drawTime_s * 1000) {
      noLoop();
    }
  }
}

function chooseLineFeatures(i) {
  if (i % 50 == 0) {
    particleSpeed = 0.7;
    strokeWeight(8);
    stroke(233, 196, 106);
  } else if (i % 25 == 0) {
    particleSpeed = 0.8;
    strokeWeight(5);
    stroke(244, 162, 97);
  } else if (i % 4 == 0) {
    particleSpeed = 0.9;
    strokeWeight(4);
    stroke(42, 157, 143);
  } else if (i % 2 == 0) {
    particleSpeed = 1.5;
    strokeWeight(3);
    stroke(188, 108, 37);
  } else {
    particleSpeed = 1.6;
    strokeWeight(1);
    stroke(231, 111, 81);
  }
}