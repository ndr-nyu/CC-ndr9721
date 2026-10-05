let seed = 1234;
let doExport = false;

let params = {
  numberOfCurves: 100,
  noiseFactor: 2,
  resolution: 360,
  gap: 2,
  noiseDetail: 0.015,
};

let offcenterx, offcentery;
let xNoiseInc = .0022;
let yNoiseInc = .0018;

function setup() {
  createCanvas(816, 1056); // letter size
  noiseSeed(seed);
  randomSeed(seed);
  noLoop();
  offcenterx = random();
  offcentery = random();
}

function draw() {
  if (doExport) {
    beginRecordSvg("myPlot" + seed + ".svg");
  }

  background(255);
  noFill();
  stroke(0);

  createNoisyCircles(noise(offcenterx) * width, noise(offcentery) * height);

  if (doExport) {
    endRecordSvg();
    doExport = false;
  }
}

function createNoisyCircles(centerX, centerY) {
  for (let j = 0; j < params.numberOfCurves; j++) {
    beginShape();
    let curveNoiseFactor = params.noiseFactor + j;

    for (let i = 0; i <= params.resolution; i++) {
      let circlePoint = map(i, 0, params.resolution, 0, TWO_PI);
      let curveRadius = j * params.gap;

      let x = centerX + cos(circlePoint) * curveRadius;
      let y = centerY + sin(circlePoint) * curveRadius;

      let n = noise(x * params.noiseDetail, y * params.noiseDetail);

      let offsetX = n * cos(circlePoint) * curveNoiseFactor;
      let offsetY = n * sin(circlePoint) * curveNoiseFactor;

      vertex(x + offsetX, y + offsetY);

    }
    offcenterx += xNoiseInc;
    offcentery += yNoiseInc;
    centerX = noise(offcenterx) * width;
    centerY = noise(offcentery) * height;
    endShape();
  }
}

function keyPressed() {
  if (key == "r") {
    seed = floor(random(130001));
    noiseSeed(seed);
    randomSeed(seed);
    redraw();
  }
  if (key == "s") {
    doExport = true;
    redraw();
  }
}
