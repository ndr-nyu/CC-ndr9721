let tileSize, cols, rows;
let tiles = [];
let doExport = false;
let seed = 0;

function setup() {
  createCanvas(816, 1056); // letter size
  tileSize = 40;
  cols = ceil(width / tileSize);
  rows = ceil(height / tileSize);
  for (let i = 0; i < cols * rows; i++) {
    tiles.push(random() > 0.5);
  }
  noFill();
  stroke(0);
}

function draw() {

  if (doExport) {
    let fileName = 'myIDMPlot_' + frameCount;
    beginRecordSvg(fileName + ".svg");
  }
  background(255);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * tileSize + tileSize / 2;
      let y = j * tileSize + tileSize / 2;
      let r = tileSize / 2;
      let flip = tiles[i * cols + j];

      if (!flip) {
        arc(x - r, y - r, tileSize, tileSize, 0, HALF_PI);
        arc(x + r, y + r, tileSize, tileSize, PI, PI + HALF_PI);
      } else {
        arc(x + r, y - r, tileSize, tileSize, HALF_PI, PI);
        arc(x - r, y + r, tileSize, tileSize, PI + HALF_PI, TWO_PI);
      }
    }
  }

  if (doExport) {
    // End exporting, if doing so
    endRecordSvg();
    doExport = false;
  }
}

// rotate only the tile that was clicked
function mousePressed() {
  let i = floor(mouseX / tileSize);
  let j = floor(mouseY / tileSize);
  if (i < 0 || i >= cols || j < 0 || j >= rows) return;
  tiles[i * cols + j] = !tiles[i * cols + j];
}

function keyPressed() {
  if (key == "s") {
    doExport = true;
  }
  if (key == "r") {

    randomSeed(frameCount);
    for (let i = 0; i < tiles.length; i++) {
      tiles[i]=(random() > 0.5);
    }
  }
}
