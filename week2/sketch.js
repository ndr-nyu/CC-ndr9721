let gap = 50; // Fixed space between shape edges 
let margin = 50; // Margin from the edges of the canvas
let clickStep = 0; // Tracks clicks from 0 to 6

//let palettes = [ { bg: '#F4F1DE', top: '#E63946', bottom: '#1D3557' }, // Cream bg, Red top, Navy bottom 
//{ bg: '#EDF2F4', top: '#FFB703', bottom: '#2A9D8F' }, // Light gray bg, Yellow top, Teal bottom 
//{ bg: '#F8F9FA', top: '#8338EC', bottom: '#3A86FF' }, // White bg, Purple top, Blue bottom 
//{ bg: '#FAEDCD', top: '#D4A373', bottom: '#E76F51' } // Warm sand bg, Tan top, Terracotta bottom 
//];

function setup() {
    createCanvas(windowWidth, windowHeight);
    ellipseMode(CORNER);
    rectMode(CORNER);
    angleMode(DEGREES);
    colorMode(HSB, 360, 100, 100);
}

function draw() {
    let topHue = (clickStep * 15) % 360; // Moves 15° around the wheel per click 
    let bottomHue = (topHue + 30) % 360; // Shifted 30° for harmonious contrast!
    background(topHue, 10, 95);

let phase = floor(clickStep / 6) % 3; 
let progress = clickStep % 6; // Step inside current phase (0 to 5) 

let stepHeight = (height - 150) / 6; 
let bottomH = progress * stepHeight; 
let topH = max(0, height - 150 - bottomH);

// Measure shape layout width
let count = 0; 
let totalWidth = 0; 
while (true) { 
    let nextWidth = 30 + count * 20; // Width of the next growing ellipse 
    let spaceNeeded = totalWidth + nextWidth + (count > 0 ? gap : 0); 
    // Stop adding shapes if the next one pushes into the side margin 
    if (spaceNeeded > width - (margin * 2)) break; 
    totalWidth = spaceNeeded; 
    count++; 
}

// TRANSLATE TO CENTER & ROTATE FULL IMAGE -
push(); 
translate(width / 2, height / 2); 
rotate(clickStep * 20); 
scale(0.9);
let startX = -totalWidth / 2; 
let startY = -height / 2 + 50;

let xPos = startX;
for (let i = 0; i < count; i++) { 
    let w = 30 + i * 20; 
   
    // Draw top shrinking shape
    if (topH > 0) {
        fill(topHue, 80, 90);
        drawPhaseShape(phase, true, xPos, startY, w, topH);
    }

    // Draw bottom growing shape
    if (bottomH > 0) {
        fill(bottomHue, 80, 90);
        drawPhaseShape(phase, false, xPos, height / 2 - 50 - bottomH, w, bottomH);
    }

xPos += w + gap;
}

pop();

// Text instructions at the top of the canvas
push();
fill(bottomHue, 80, 80); 
stroke(0);
strokeWeight(1.5);
textAlign(CENTER, CENTER); 
textSize(16);
textFont('Courier');

if (clickStep === 0) { 
    text("Click to start", width / 2, 40); 
} else { 
    text("... & keep clicking to transform", width / 2, 40); 
}

pop();
}

function drawPhaseShape(phase, isTop, x, y, w, h) { 
    let shapeType; 
    if (phase === 0) shapeType = isTop ? "ellipse" : "rect"; 
    else if (phase === 1) shapeType = isTop ? "rect" : "triangle"; 
    else shapeType = isTop ? "triangle" : "ellipse"; 
    
    if (shapeType === "ellipse") { 
        ellipse(x, y, w, h); 
    } else if (shapeType === "rect") { 
        rect(x, y, w, h); 
    } else if (shapeType === "triangle") { 
        triangle(x, y + h, x + w, y + h, x + w / 2, y); // Pointing up 
    }
}

// Advance the counter on every click 
function mouseClicked() { 
    clickStep++; 
}

// Automatically resizes your canvas when you resize the browser window
function windowResized() { 
    resizeCanvas(windowWidth, windowHeight);
}

