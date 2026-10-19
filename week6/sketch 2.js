// Original code - not optimized with JPG background, but still works fine.
let dotPath = []; 
let tileSize = 50;
let cols, rows;

// Inner cushion screen offset & dimensions 
let screenMargin = 100; // Size of the outer glowing border 
let screenX, screenY, screenW, screenH; 

let lastSec = -1; 
let stepStartTime = 0; 
let visited = {};

function setup() {
    createCanvas(windowWidth, windowHeight);
    calculateScreenDimensions();

    // Initialize starting dot near grid center 
    let col = floor(cols / 2); 
    let row = floor(rows / 2); 
    
    dotPath.push({ 
        x: screenX + col * tileSize + tileSize / 2, 
        y: screenY + row * tileSize + tileSize / 2,
        col: col, 
        row: row 
    }); 
    visited[col + "," + row] = true; 
    
    // Limit attempts to 500 to prevent infinite loading 
    let attempts = 0; 
    while (dotPath.length < 40 && attempts < 500) { 
        addNextDot(); 
        attempts++; 
    } 
}

function calculateScreenDimensions() { 
    // Define inner screen size with generous outer margins 
    screenX = screenMargin; 
    screenY = screenMargin; 
    screenW = width - screenMargin * 2; 
    screenH = height - screenMargin * 2; 
    
    cols = floor(screenW / tileSize); 
    rows = floor(screenH / tileSize); 
}

// Automatically recalculates canvas size if browser window is resized 
function windowResized() { 
    resizeCanvas(windowWidth, windowHeight); 
    calculateScreenDimensions(); 
}

function drawArcadeCabinet() { 
    let ctx = drawingContext; 
    
    // Outer radial gradient (Dark Blue to Black) 
    let gradient = ctx.createRadialGradient( 
        width / 2, height / 2, 50, 
        width / 2, height / 2, max(width, height) * 0.7 
    ); 
    gradient.addColorStop(0, '#1b2a4a'); // Center: Arcade Navy Glow 
    gradient.addColorStop(1, '#030509'); // Outer Edge: Almost Black 
    ctx.fillStyle = gradient; 
    ctx.fillRect(0, 0, width, height); 
        
    // Inner Black Cushion CRT Screen 
    fill(8);
    stroke('#2d3f6e'); // Subtle glowing screen bezel border 
    strokeWeight(3); 
        
    rect(screenX, screenY, screenW, screenH, 40); 
}

function draw() {
    drawArcadeCabinet();
    drawDots();

    let currentSec = second(); // Current time (0 to 59)
    
    // When second changes, advance the queue 
    if (currentSec !== lastSec) { 
        lastSec = currentSec; 
        stepStartTime = millis(); 
        
        // Remove the eaten dot from the front of array 
        if (dotPath.length > 1) { 
            let eatenDot = dotPath.shift(); 
            delete visited[eatenDot.col + "," + eatenDot.row]; 
        }

        addNextDot(); 
    } 
    
    // Pac-Man always glides between index 0 and 1 
    if (dotPath.length >= 2) { 
        let startDot = dotPath[0]; 
        let endDot = dotPath[1];

        let elapsed = millis() - stepStartTime; 
        let progress = constrain(elapsed / 1000.0, 0, 1);

        // lerp() calculates smooth position between startDot and endDot 
        let pacX = lerp(startDot.x, endDot.x, progress); 
        let pacY = lerp(startDot.y, endDot.y, progress);
        let angle = atan2(endDot.y - startDot.y, endDot.x - startDot.x); // Calculate angle for Pac-Man's direction

        drawPacMan(pacX, pacY, 30, angle); // Draw Pac-Man at the interpolated position with the calculated angle
    } 
}

// Appends 1 valid adjacent grid step to the tail 
function addNextDot() { 
    let current = dotPath[dotPath.length - 1]; 
    let dirs = [ 
        { c: 0, r: -1 }, { c: 1, r: 0 }, 
        { c: 0, r: 1 }, { c: -1, r: 0 } 
    ]; 
    dirs = shuffle(dirs); 

    let occupied = {}; 
    for (let dot of dotPath) { 
        occupied[dot.col + "," + dot.row] = true; 
    }

    for (let d of dirs) { 
        let nc = current.col + d.c; 
        let nr = current.row + d.r; 
        
        if (nc >= 0 && nc < cols && nr >= 0 && nr < rows && !occupied[nc + "," + nr]) {
            visited[nc + "," + nr] = true; 
            dotPath.push({ 
                x: screenX + nc * tileSize + tileSize / 2, 
                y: screenY + nr * tileSize + tileSize / 2, 
                col: nc, 
                row: nr 
            }); 
            return; 
        } 
    } 

    // FALLBACK: If trapped, pick ANY valid neighbor on the screen 
    for (let d of dirs) { 
        let nc = current.col + d.c; 
        let nr = current.row + d.r; 
        if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) { 
            dotPath.push({ 
                x: screenX + nc * tileSize + tileSize / 2, 
                y: screenY + nr * tileSize + tileSize / 2, 
                col: nc, 
                row: nr 
            }); 
            return; 
        } 
    } 
}

// Draws Pac-Man with an animated mouth 
function drawPacMan(x, y, d, angle) { 
    push(); 
    translate(x, y); 
    rotate(angle); // Rotate Pac-Man to face the direction of movement

    // sin() oscillates between -1 and 1, creating a opening/closing bite 
    let biteSize = map(sin(frameCount * 0.2), -1, 1, 0.05, 0.4); 
    fill(255, 255, 0); // Pac-Man Yellow 
    noStroke(); 
    
    // Draw pie shape with animated opening angles 
    arc(0, 0, d, d, biteSize, TWO_PI - biteSize, PIE); 
    pop(); 
}

function drawDots() {
  fill(255, 184, 151); // Classic dot color
  noStroke();
  
  for (let i = 1; i < dotPath.length; i++) {
    circle(dotPath[i].x, dotPath[i].y, 12);
  }
}