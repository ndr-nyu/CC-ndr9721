let video; 
let handPose; 
let hands = [];
let isPaused = false; 
let pincedLastFrame = false;
let shapeWidth = 60; 
let shapeHeight = 60;
let fallingShapes = [];

async function setup() {
    createCanvas(640, 480);

    // Capture webcam stream 
    video = createCapture(VIDEO); 
    video.size(640, 480); 
    video.hide();

    handPose = await ml5.handPose();
    handPose.detectStart(video, gotHands);
}

// Callback updates results array automatically 
function gotHands(results) { 
    hands = results; 
}

function draw() {
    background(30); 
    image(video, 0, 0); 
    
    // --- GESTURE 1: Pinch to Toggle Pause/Play --- 
    if (hands.length > 0) { 
        let hand1 = hands[0];
        let pinchDist = dist( 
            hand1.index_finger_tip.x, 
            hand1.index_finger_tip.y, 
            hand1.thumb_tip.x, 
            hand1.thumb_tip.y 
        ); 
        
        // --- GESTURE 2:If pinched and wasn't pinched last frame, toggle state 
        if (pinchDist < 30 && !pincedLastFrame) { 
            isPaused = !isPaused; 
            pincedLastFrame = true; 
        } else if (pinchDist >= 30) { 
            pincedLastFrame = false; 
        } 
    }

    // --- GESTURE 3: Two-Handed Distance for Stretching --- 
    if (hands.length >= 2) { 
        let h1 = hands[0].index_finger_tip; 
        let h2 = hands[1].index_finger_tip; 
        
        // Map horizontal and vertical distance between fingertips to shape dimensions 
        shapeWidth = map(abs(h1.x - h2.x), 20, 400, 20, 200, true); 
        shapeHeight = map(abs(h1.y - h2.y), 20, 400, 20, 200, true); 
        
        // Visual feedback line between fingertips 
        stroke(0, 255, 200); 
        strokeWeight(2); 
        line(h1.x, h1.y, h2.x, h2.y); 
    }

    // --- SHAPE GENERATION & ANIMATION --- 
    if (!isPaused) { 
        // Spawn a new shape occasionally 
        if (frameCount % 30 === 0) { 
            fallingShapes.push({ 
                x: random(width), 
                y: 0, 
                speed: random(2, 5) 
            }); 
        } 
    }

    // Render and update shapes 
    rectMode(CENTER); 
    noStroke(); 
    fill(255, 100, 150, 200); 
    
    for (let i = fallingShapes.length - 1; i >= 0; i--) { 
        let s = fallingShapes[i]; 
        
        // Draw shape with currently active stretch dimensions 
        rect(s.x, s.y, shapeWidth, shapeHeight, 8); 
        
        if (!isPaused) { 
            s.y += s.speed; 
        } 
        
        // Remove shapes that fall off the bottom of the canvas 
        if (s.y > height + 100) { 
            fallingShapes.splice(i, 1); 
        } 
    }

    // On-screen state indicator 
    fill(255); 
    noStroke(); 
    textSize(16); 
    text(isPaused ? "Status: PAUSED (Pinch to resume)" : "Status: FALLING (Pinch to pause)", 20, 30); 
}