let squareSize = 100;
let grid = []; // Holds state memory for every square 
let cols, rows;

function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    cols = ceil(width / squareSize); 
    rows = ceil(height / squareSize); 
    
    // Initialize state objects for every row and column 
    for (let r = 0; r < rows; r++) { 
        grid[r] = []; 
        for (let c = 0; c < cols; c++) { 
            grid[r][c] = { 
                angle: 0, 
                speed: 0, 
                colorFade: 0 // 0 = default white, 1 = bright color 
                
            }; 
            
        } 
        
    } 
    
}


function draw() {
    background(240);
     
    let mouseOnScreen = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height; 
    let effectRadius = 250;

    // 1\. ADDED: Calculate how far the mouse traveled since the last frame l
    let mouseSpeed = dist(mouseX, mouseY, pmouseX, pmouseY); 
    let isMouseMoving = mouseSpeed > 0.5; // True only if mouse is actively moving

    for (let r = 0; r < rows; r++) { 
        for (let c = 0; c < cols; c++) { 
            let x = c * squareSize; 
            let y = r * squareSize; 
            let centerX = x + squareSize / 2; 
            let centerY = y + squareSize / 2; 
            let sqState = grid[r][c]; 

            let d = dist(mouseX, mouseY, centerX, centerY);

            // 1\. ADDED: Define isHovered before using it in the if statement! 
            let isHovered = mouseOnScreen && mouseX >= x && mouseX < x + squareSize && mouseY >= y && mouseY < y + squareSize;

            // 3\. Ombré influence fraction (1.0 at center, 0.0 at edge of radius) 
            let influence = 0; 
            if (mouseOnScreen && d < effectRadius) { 
                influence = map(d, 0, effectRadius, 1.0, 0); 
            } 

            // 2\. CHANGED: Only spin if mouse is over the square AND moving! 
            if (isHovered && isMouseMoving) { 
                // Speed scales with physical mouse speed (faster gesture = faster spin) 
                sqState.speed = map(mouseSpeed, 0, 30, 0.05, 0.25, true); 
            } else { 
                sqState.speed *= 0.95; // Friction slows rotation when mouse stops 
                
            }
            
            // 5\. CHANGED: Radial influence ONLY affects color glow 
            if (influence > 0) { 
                sqState.colorFade = max(sqState.colorFade, influence); 
            } else { 
                sqState.colorFade *= 0.95; // Decay returns color to white 
            }

            // Continuously update angle based on current speed 
            sqState.angle += sqState.speed; 

            push(); 
            translate(centerX, centerY); 
            rotate(sqState.angle); 

            // Increased max offset to 55 for a slightly deeper gradient 
            let yColorOffset = map(r, 0, rows, 0, 55); 
            
            let rVal = map(sqState.colorFade, 0, 1, 255 - (yColorOffset * 1.3), 255); 
            let gVal = map(sqState.colorFade, 0, 1, 255 - (yColorOffset * 0.3), 60); 
            let bVal = map(sqState.colorFade, 0, 1, 255 - (yColorOffset * 0.8), 140); 
            fill(rVal, gVal, bVal);

            square(0, 0, squareSize); 
            pop(); 
        } 
    } 
}

// Click anywhere to reset all grid squares back to 0! 
function mousePressed() { 
    for (let r = 0; r < rows; r++) { 
        for (let c = 0; c < cols; c++) { 
            grid[r][c].angle = 0; 
            grid[r][c].speed = 0; 
            grid[r][c].colorFade = 0; 
        } 
    } 
}