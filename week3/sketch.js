let baseWidth = 50;
let baseHeight = 50;
let ripples = [];

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

    for (let i = ripples.length - 1; i >= 0; i--) { 
        if (frameCount - ripples[i].time > 150) { 
            ripples.splice(i, 1); 
        } 
    }

    for (let row = 0; row < rows; row++) { 
        for (let col = 0; col < cols; col++) { 
            let cx = col * (baseWidth / 2);
            let cy = row * baseHeight + baseHeight / 2;
            
            let waveAngle = frameCount * 0.015 + row * 0.08; 
            
            // 0\. Calculate combined strength of ALL active ripples 
            let totalRippleWave = 0; 
            for (let r of ripples) { 
                let d = dist(cx, cy, r.x, r.y); 
                let timeElapsed = frameCount - r.time;

            // 1\. ADDED: Smooth Fade-In Multiplier (starts at 0 on click, ramps to 1 over 20 frames) 
            let fadeIn = min(1, timeElapsed / 20); 
            let distDecay = max(0, 1 - d / 400); 
            let timeDecay = max(0, 1 - timeElapsed / 140); 
            let rippleAngle = timeElapsed * 0.1 - d * 0.04; 
            
            // 2\. ADDED: Add up wave height from each ripple using '+=' 
            totalRippleWave += sin(rippleAngle) * fadeIn * distDecay * timeDecay * 1.8; } 
            // 3\. ADDED: Close the ripple loop HERE so triangles draw even when ripples = []

            let totalValue = sin(waveAngle) + totalRippleWave; 
            let sizeScale = map(totalValue, -2.8, 2.8, 0.15, 1.8); // [1] 
            let hueVal = map(sin(waveAngle) + totalRippleWave * 0.4, -2, 2, 140, 280);

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

// 4\. CHANGED: Push a new ripple object onto the array with every click! 
function mousePressed() { 
    ripples.push({ 
        x: mouseX, 
        y: mouseY, 
        time: frameCount 
    }); 
}

// 1\. ADDED: Triggers continuously as you hold and drag the mouse! 
function mouseDragged() { 
    // 2\. Measure distance moved since last frame 
    let dragDistance = dist(mouseX, mouseY, pmouseX, pmouseY); 
    
    // 3\. Only spawn a new ripple if the mouse moved more than 15 pixels 
    if (dragDistance > 15) { 
        ripples.push({ 
            x: mouseX, 
            y: mouseY, 
            time: frameCount 
        }); 
    } 
}