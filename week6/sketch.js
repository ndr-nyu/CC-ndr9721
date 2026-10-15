let dotPath = []; 
let cols = 16; 
let rows = 12; 
let tileSize = 50;
let lastSec = -1; 
let stepStartTime = 0;

function setup() {
    createCanvas(800, 600);
    // Generate the maze path for Pac-Man to follow
    generateMazePath();
}

function draw() {
    background(20);

    // Draw the maze grid
    drawDots();
    let currentSec = second(); // Current time (0 to 59)
    let nextSec = (currentSec + 1) % 60; // Next second for Pac-Man's movement

    // Sync timer whenever the clock second changes 
    if (currentSec !== lastSec) { 
        lastSec = currentSec; 
        stepStartTime = millis(); 
    }

    if (dotPath.length >= 60) { 
        let startDot = dotPath[currentSec]; 
        let endDot = dotPath[nextSec];
        let elapsed = millis() - stepStartTime; 
        let progress = constrain(elapsed / 1000.0, 0, 1);

        // lerp() calculates smooth position between startDot and endDot 
        let pacX = lerp(startDot.x, endDot.x, progress); 
        let pacY = lerp(startDot.y, endDot.y, progress);

        let angle = atan2(endDot.y - startDot.y, endDot.x - startDot.x); // Calculate angle for Pac-Man's direction
        drawPacMan(pacX, pacY, 30, angle); // Draw Pac-Man at the interpolated position with the calculated angle
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

function generateMazePath() { 
    dotPath = []; 
    let visited = {}; 

    let col = floor(random(3, cols - 3)); 
    let row = floor(random(3, rows - 3));
    
    dotPath.push({ 
        x: col * tileSize + tileSize / 2, 
        y: row * tileSize + tileSize / 2, 
        col: col,
        row: row 
    }); 
    visited[col + "," + row] = true; 

    let attempts = 0;
    
    while (dotPath.length < 60 && attempts < 1000) { 
        attempts++; 
        let current = dotPath[dotPath.length - 1];
        
        // Check adjacent orthogonal directions (up, right, down, left) 
        let dirs = [ 
            { c: 0, r: -1 }, 
            { c: 1, r: 0 }, 
            { c: 0, r: 1 }, 
            { c: -1, r: 0 } 
        ];
        dirs = shuffle(dirs); 
        let addedCorridor = false; 
        
        for (let d of dirs) { 
            let corridorLength = floor(random(2, 6)); 
            let tempSteps = []; 
            let checkCol = current.col; 
            let checkRow = current.row; 
            
            for (let step = 1; step <= corridorLength; step++) { 
                let nc = checkCol + d.c; 
                let nr = checkRow + d.r; 
                
                // Ensure step stays inside canvas bounds and on unvisited tiles 
                if (nc >= 0 && nc < cols && nr >= 0 && nr < rows && !visited[nc + "," + nr]) { 
                    tempSteps.push({ col: nc, row: nr }); 
                    checkCol = nc; 
                    checkRow = nr; 
                } else { 
                    break; // Hit a boundary or visited tile 
                } 
            } 
            
            // If valid straight steps were found, add them to dotPath 
            if (tempSteps.length > 0) { 
                for (let s of tempSteps) { 
                    visited[s.col + "," + s.row] = true; 
                    dotPath.push({ 
                        x: s.col * tileSize + tileSize / 2, 
                        y: s.row * tileSize + tileSize / 2, 
                        col: s.col, 
                        row: s.row 
                    }); 
                    if (dotPath.length === 60) break; 
                } 
                addedCorridor = true; 
                break; // Stop checking directions for this step 
            } 
        } 
        
        // Backtrack if trapped 
        if (!addedCorridor) { 
            if (dotPath.length > 5) { 
                let removed = dotPath.pop(); 
                delete visited[removed.col + "," + removed.row]; 
            } else { 
                visited = {}; 
                dotPath = []; 
                col = floor(random(3, cols - 3)); 
                row = floor(random(3, rows - 3)); 
                dotPath.push({ 
                    x: col * tileSize + tileSize / 2, 
                    y: row * tileSize + tileSize / 2, 
                    col: col, 
                    row: row 
                }); 
                visited[col + "," + row] = true; 
            } 
        } 
    } 
}


function drawDots() {
  let currentSec = second(); // Current time (0 to 59)
  
  fill(255, 184, 151); // Classic dot color
  noStroke();
  
  for (let i = 0; i < dotPath.length; i++) {
    // Only draw dots that Pac-Man hasn't eaten yet
    if (i > currentSec) {
      circle(dotPath[i].x, dotPath[i].y, 12);
    }
  }
}