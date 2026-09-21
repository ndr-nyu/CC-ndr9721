let baseWidth = 50;
let baseHeight = 50;

// Global variables to store mouse click position and frame time 
let rippleX = -1000; 
let rippleY = -1000; 
let rippleTime = -1000;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
    background(45, 15, 98);
    
    let cols = ceil(width / (baseWidth / 2)) + 1; 
    let rows = ceil(height / baseHeight) + 1; 
    
    for (let row = 0; row < rows; row++) { 
        for (let col = 0; col < cols; col++) { 
            let cx = col * (baseWidth / 2);
            let cy = row * baseHeight + baseHeight / 2;
            
            let waveAngle = frameCount * 0.015 + row * 0.08; 
            
            let d = dist(cx, cy, rippleX, rippleY); 
            let timeElapsed = frameCount - rippleTime; 

            // 1\. ADDED: Smooth Fade-In Multiplier (starts at 0 on click, ramps to 1 over 20 frames) 
            let fadeIn = min(1, timeElapsed / 20); 
            let distDecay = max(0, 1 - d / 400); 
            let timeDecay = max(0, 1 - timeElapsed / 140); 
            let rippleAngle = timeElapsed * 0.1 - d * 0.04; 
            
            // 2\. CHANGED: Multiplied by fadeIn so it swells out smoothly instead of jumping instantly! 
            let rippleWave = sin(rippleAngle) * fadeIn * distDecay * timeDecay * 1.8; 
            let totalValue = sin(waveAngle) + rippleWave; 
            
            // 3\. CHANGED: Lowered minimum scale to 0.15 so triangles shrink small enough to reveal background! 
            let sizeScale = map(totalValue, -2.8, 2.8, 0.15, 1.8); // [1] 
            let hueVal = map(sin(waveAngle) + rippleWave * 0.4, -2, 2, 140, 280);

            push(); 
            translate(cx, cy); 
            scale(sizeScale); 
            fill(hueVal, 50, 85, 75); 
            stroke(hueVal, 70, 40); 
            strokeWeight(1); 

            if ((row + col) % 2 === 0) { 
                triangle(-baseWidth / 2, baseHeight / 2, baseWidth / 2, baseHeight / 2, 0, -baseHeight / 2); 
            } else { 
                triangle(-baseWidth / 2, -baseHeight / 2, baseWidth / 2, -baseHeight / 2, 0, baseHeight / 2); 
            } 
            pop(); 
        } 
    } 
} 

// Triggered automatically whenever a mouse button is clicked 
function mousePressed() { 
    rippleX = mouseX; 
    rippleY = mouseY; 
    rippleTime = frameCount; 
}