// Code optimized to use a pre-rendered JPG background for better performance. No portals implemented yet.
let dotPath = []; 
let tileSize = 50;
let cols, rows;

// Inner cushion screen offset & dimensions 
let screenMargin = 100; // Size of the outer glowing border 
let screenX, screenY, screenW, screenH; 
let bgGlow; // Offscreen graphics buffer

let lastSec = -1; 
let lastMin = -1;
let stepStartTime = 0; 
let visited = {};

// Classic Pac-Man Ghost Colors: Red, Pink, Cyan, Orange 
let ghostColors = [ 
    [255, 0, 0], // Blinky (Red) 
    [255, 184, 222], // Pinky (Pink) 
    [0, 255, 255], // Inky (Cyan) 
    [255, 184, 82] // Clyde (Orange) 
]; 
let ghostColorIndex = 0; // Tracks which ghost color is up next

let isPowerMode = false; 
let powerModeStartTime = 0;
let TEST_HOURLY = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    calculateScreenDimensions();

    bgGlow = createGraphics(width, height); 
    renderGlowBackground(); // Draw background ONCE!

    // Initialize starting dot near grid center 
    let col = floor(cols / 2); 
    let row = floor(rows / 2); 
    
    dotPath.push({ 
        x: screenX + col * tileSize + tileSize / 2, 
        y: screenY + row * tileSize + tileSize / 2,
        col: col, 
        row: row,
        isCherry: false // Regular dot by default
    }); 
    visited[col + "," + row] = true; 
    
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

    bgGlow.resizeCanvas(width, height); 
    renderGlowBackground();
}

// Draws full background into the offscreen buffer once 
function renderGlowBackground() { 
    let ctx = bgGlow.drawingContext; 
    
    let gradient = ctx.createRadialGradient( 
        width / 2, height / 2, 100, 
        width / 2, height / 2, max(width, height) * 0.7 
    ); 
    gradient.addColorStop(0, '#1b2a4a'); 
    gradient.addColorStop(1, '#030509'); 

    ctx.fillStyle = gradient; 
    ctx.fillRect(0, 0, width, height); 
    
    // Draw cushion screen on the offscreen buffer 
    bgGlow.fill(8); 
    bgGlow.stroke('#2d3f6e'); 
    bgGlow.strokeWeight(3); 
    bgGlow.rect(screenX, screenY, screenW, screenH, 40); 
}

function draw() {
    image(bgGlow, 0, 0);
    drawDots();

    let currentSec = second(); // Current time (0 to 59)
    let currentMin = minute();

    // When second changes, advance the queue 
    if (currentSec !== lastSec) { 
        lastSec = currentSec; 
        stepStartTime = millis(); 
        
        // Remove the eaten dot from the front of array 
        if (dotPath.length > 1) { 
            let eatenDot = dotPath.shift(); 
            delete visited[eatenDot.col + "," + eatenDot.row]; 
        }

        // Swap to next ghost color at second 1 after the ghost exits! 
        if (currentSec === 1) { 
            ghostColorIndex = (ghostColorIndex + 1) % ghostColors.length; 
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

        // Check if Power Mode duration (5 seconds / 5000ms) is over 
        if (isPowerMode && millis() - powerModeStartTime > 5000) { 
            isPowerMode = false; 
        }

        // Check if it's the top of the hour (or if test mode is enabled) 
        let isHourlyEvent = (currentMin === 0) || TEST_HOURLY;

        // A. HOURLY EVENT (minute === 0) -&gt; 4 Ghosts Scatter!
        if (isHourlyEvent) { 
            // Trigger Power Mode on second 00 
            if (currentSec === 0 && !isPowerMode) { 
                isPowerMode = true; 
                powerModeStartTime = millis(); 
            }
            
            if (isPowerMode) { 
                let fleeProgress = (millis() - powerModeStartTime) / 5000.0; 
            
            // Flashing Screen Border  
            if (frameCount % 10 < 5) { 
                stroke(255, 255, 255); 
                strokeWeight(6); 
                noFill(); 
                rect(screenX, screenY, screenW, screenH, 40); 
            } 
            
            // 4 Target Corners: Top-Left, Top-Right, Bottom-Left, Bottom-Right 
            let targets = [ 
                { x: -100, y: -100 }, // Blinky (Top-Left) 
                { x: width + 100, y: -100 }, // Pinky (Top-Right) 
                { x: -100, y: height + 100 }, // Inky (Bottom-Left) 
                { x: width + 100, y: height + 100 } // Clyde (Bottom-Right) 
            ]; 
            
            // 4 Ghosts scatter radially from Pac-Man to their off-screen corners! 
            for (let i = 0; i < ghostColors.length; i++) { 
                let ghostX = lerp(pacX, targets[i].x, fleeProgress); 
                let ghostY = lerp(pacY, targets[i].y, fleeProgress); 
                let scaredColor = (fleeProgress > 0.7 && frameCount % 10 < 5) ? color(255) : color(33, 33, 222); 
                drawGhost(ghostX, ghostY, 30, scaredColor); 
            } 
        } 
        else if (currentSec === 59) { 
            // 4 Ghosts line up back-to-back approaching Pac-Man during sec 59 of min 59 
            for (let i = 0; i < ghostColors.length; i++) { 
                let ghostX = lerp(width + 50 + (i * 35), pacX + (i * 35), progress); 
                drawGhost(ghostX, pacY, 30, ghostColors[i]); 
            } 
        } 
        drawPacMan(pacX, pacY, 30, angle); 
    } 

    // B. REGULAR MINUTE EVENT (currentMin !== 0) -> 1 Ghost Hit & Spin 
    else { 
        // Pac-Man spins 360 degrees on second 00 right after impact 
        if (currentSec === 0) { 
            angle += progress * TWO_PI; 
        } 
        drawPacMan(pacX, pacY, 30, angle); 

        // Single Ghost enters from right on second 59 
        if (currentSec === 59) { 
            let ghostX = lerp(width + 50, pacX, progress); 
            drawGhost(ghostX, pacY, 30, ghostColors[ghostColorIndex]); 
        } 

        // Single Ghost exits to left on second 00 
        else if (currentSec === 0) { 
            let ghostX = lerp(pacX, -50, progress); 
            drawGhost(ghostX, pacY, 30, ghostColors[ghostColorIndex]); 
        } 
    } 
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

    // Calculate if this future dot will be eaten at second 00! 
    let futureSecond = (second() + dotPath.length) % 60; 
    let spawnCherry = (futureSecond === 0);

    // Try to find an unvisited neighbor first
    for (let d of dirs) { 
        let nc = current.col + d.c; 
        let nr = current.row + d.r; 
        
        // Calculate the potential pixel position first 
        let nextX = screenX + nc * tileSize + tileSize / 2; 
        let nextY = screenY + nr * tileSize + tileSize / 2; 
        
        // Put the overlap check directly inside this IF statement! 
        if ( 
            nc >= 0 && nc < cols && 
            nr >= 0 && nr < rows && 
            !isOverlapping(nextX, nextY) // Checks distance before pushing 
        ) { 
            visited[nc + "," + nr] = true; 
            dotPath.push({ 
                x: nextX, 
                y: nextY, 
                col: nc, 
                row: nr, 
                isCherry: spawnCherry // Regular dot by default
            }); 
            return; 
        } 
    } 

    // FALLBACK if blocked 
    for (let d of dirs) { 
        let nc = current.col + d.c; 
        let nr = current.row + d.r; 
        if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) { 
            dotPath.push({ 
                x: screenX + nc * tileSize + tileSize / 2, 
                y: screenY + nr * tileSize + tileSize / 2, 
                col: nc, 
                row: nr, 
                isCherry: spawnCherry // Regular dot by default
            }); 
            return; 
        } 
    } 

    visited = {}; 
    for (let dot of dotPath) { 
        visited[dot.col + "," + dot.row] = true; 
    } 
    
}

// Helper function to check spatial distance before placing a dot! 
function isOverlapping(nextX, nextY) { 
    for (let i = dotPath.length - 1; i >= 0; i--) { 
        let x = dotPath[i].x; 
        let y = dotPath[i].y; 
        
        // Returns true if candidate point is closer than tileSize 
        if (dist(nextX, nextY, x, y) < tileSize) { 
            return true; 
        } 
    } 
    return false; // Space is clear 
    
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
  for (let i = 1; i < dotPath.length; i++) { 
    if (dotPath[i].isCherry) { 
        drawCherries(dotPath[i].x, dotPath[i].y); 
    } else { 
        fill(255, 184, 151); 
        noStroke(); 
        circle(dotPath[i].x, dotPath[i].y, 12); 
    } 
}
}

// Draws a pair of cherries centered at (x, y)
function drawCherries(x, y) {
  push();
  translate(x, y);
  
  // Stems (Green lines)
  stroke(40, 180, 40);
  strokeWeight(2);
  noFill();
  line(-4, 2, 0, -8); 
  line(4, 4, 0, -8);  
  
  // Cherries (Red circles)
  fill(220, 20, 60);
  noStroke();
  circle(-5, 4, 10);
  circle(5, 6, 10);
  
  pop();
}

// Draws a classic arcade ghost centered at (x, y) 
function drawGhost(x, y, d, colorRGB) { 
    push(); 
    translate(x, y); 
    
    // Ghost Body 
    fill(colorRGB[0], colorRGB[1], colorRGB[2]); 
    noStroke(); 
    
    // Dome head & rectangular bottom 
    arc(0, -d * 0.1, d, d, PI, 0); 
    rect(-d / 2, -d * 0.1, d, d * 0.4); 
    
    // Outer White Eyes 
    fill(255); 
    ellipse(-d * 0.2, -d * 0.1, d * 0.3, d * 0.4); 
    ellipse(d * 0.2, -d * 0.1, d * 0.3, d * 0.4); 
    
    // Blue Pupils 
    fill(0, 0, 255); 
    ellipse(-d * 0.2, -d * 0.1, d * 0.15, d * 0.2); 
    ellipse(d * 0.2, -d * 0.1, d * 0.15, d * 0.2); 
    pop(); 
}

function drawTitle() { 
    push(); 
    textAlign(CENTER, CENTER); 
    textSize(24); 
    
    textFont('MyPacFont'); // Use the custom Pac-Man font
    
    fill(255, 255, 0); // Pac-Man Yellow 
    noStroke(); 
    
    text("PAC-MAN CLOCK", width / 2, screenMargin / 2); 
    pop(); 
}