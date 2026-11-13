let song;
let amplitudeMeter; 
let video; 
let handPose; 
let hands = [];

let bowTrail = [];  
let notes = []; 
let lanes = ['a', 's', 'd', 'f']; 
let score = 0;
let gameState = 'start'; // 'start', 'playing', 'paused'

let songStartTime = 0; // Tracks start time in milliseconds 
let pauseOffset = 0; // Tracks paused time duration

async function setup() {
    createCanvas(800, 600);

    // Mirrored video capture 
    video = createCapture(VIDEO, { flipped: true }); 
    video.size(800, 600); 
    video.hide();

    song = await loadSound('assets/gimme.mp3');
    song.amp(0.8); // Set volume to 80%

    // Connect loudness meter to sound track 
    amplitudeMeter = new p5.Amplitude(); 
    song.connect(amplitudeMeter);

    handPose = await ml5.handPose({ flipped: true }); 
    handPose.detectStart(video, (results) => { hands = results; });

    console.log("✅ Setup loaded successfully!");
}

function draw() {
    // Render camera feed if available 
    if (video) { 
        image(video, 0, 0, width, height); 
    } else { 
        background(30); 
    }
 
    // Safely read amplitude & timestamp without crashing frame 1! 
    let level = amplitudeMeter ? amplitudeMeter.getLevel() : 0; 
    
    // Calculate elapsed time in seconds using millis() 
    let t = 0; 
    if (gameState === 'playing' && song && song.isPlaying()) { 
        t = (millis() - songStartTime) / 1000; 
    }

    console.log("Current State:", gameState, "Time:", t);

    // Explicit State Switcher 
    if (gameState === 'start') { 
        drawStartScreen(); 
    } else if (gameState === 'paused') { 
        drawPauseOverlay(); 
    } else if (gameState === 'playing') { 
        if (t < 17) { 
            drawKeyboardGame(level, t); 
        } else if (t >= 17 && t <= 34) { 
            drawGestureTracing(level, t); 
        } else { 
            drawScoreScreen(); 
        } 
    } 
}

function drawStartScreen() { 
    fill(0, 180); 
    rect(0, 0, width, height); 
    fill(255); 
    textAlign(CENTER, CENTER); 
    textSize(24); 
    if (song) {
        text("🕺 Press SPACE to start ABBA Disco! 🕺", width / 2, height / 2); 
    } else {
        text("⏳ Loading Audio &amp; AI Model... ⏳", width / 2, height / 2);
    }
}
  
// 0 to 17 Seconds: Keyboard Rhythm Mode 
function drawKeyboardGame(level, t) { 
    let targetY = height - 80; 
    
    // Top banner indicator 
    fill(0, 180); 
    rect(0, 0, width, 50); 
    fill(255); 
    textAlign(CENTER, CENTER); 
    textSize(18); text(`PHASE 1: KEYBOARD NOTES (${nf(17 - t, 1, 1)}s remaining)`, width / 2, 25);

    // Render lanes
    for (let i = 0; i < lanes.length; i++) { 
        let laneX = (width / 5) * (i + 1); 
        stroke(255); 
        line(laneX, 0, laneX, height); 

        // Target zone pulses with music loudness 
        fill(100, 200, 255, 150); 
        ellipse(laneX, targetY, 40 + level * 30); 

        fill(255); 
        textAlign(CENTER, CENTER); 
        textSize(16);
        text(lanes[i].toUpperCase(), laneX, targetY); 
    } 

    // Spawn hold & tap notes 
    if (frameCount % 40 === 0) { 
        notes.push({ 
            lane: floor(random(4)), y: 50, speed: 5 }); 
        }

    // Update and draw falling notes 
    for (let i = notes.length - 1; i >= 0; i--) { 
        let n = notes[i]; 
        let laneX = (width / 5) * (n.lane + 1); 

        fill(0, 255, 200); 
        circle(laneX, n.y, 30); 
        n.y += n.speed; 
        
        if (n.y > height) { 
            notes.splice(i, 1); 
        }
    }

    // Display live score 
    fill(255); 
    textSize(20); 
    textAlign(LEFT, TOP); 
    text("Score: " + score, 20, 60);
}

// 17 to 34 Seconds: Hand Gesture Amplitude Tracing Mode 
function drawGestureTracing(level, t) { 
    fill(0, 120); 
    rect(0, 0, width, 50); 

    fill(255, 220, 0); 
    textAlign(CENTER, CENTER); 
    textSize(18); 
    text(`PHASE 2: HAND TRACING (${nf(34 - t, 1, 1)}s remaining)`, width / 2, 25); 
    
    if (hands.length > 0 && hands[0].index_finger_tip) { 
        let finger = hands[0].index_finger_tip; 
        bowTrail.push({ x: finger.x, y: finger.y }); 
        if (bowTrail.length > 30) { 
            bowTrail.shift(); 
        } 
        // Draw amplitude-reactive arcing trail 
        noFill(); 
        stroke(255, 0, 180, 220); 
        strokeWeight(4 + level * 35); 
        // Trail swells with loudness! 
        beginShape(); 
        for (let p of bowTrail) { 
            vertex(p.x, p.y); 
        } 
        endShape(); 
        // Award score while hand moves actively during peak amplitude 
        if (level > 0.15) { 
            score += 1; 
        } 
        fill(255, 255, 0); 
        noStroke(); 
        circle(finger.x, finger.y, 18); 
    } 
    fill(255); 
    textSize(20); 
    textAlign(LEFT, TOP); 
    text("Score: " + score, 20, 60); 
}

function drawPauseOverlay() { 
    fill(0, 150); 
    rect(0, 0, width, height); 
    fill(255); 
    textAlign(CENTER, CENTER); 
    textSize(36); 
    text("⏸ GAME PAUSED ⏸ \n Press SPACE to Resume", width / 2, height / 2); 
}

function drawScoreScreen() { 
    fill(0, 200); 
    rect(0, 0, width, height); 
    fill(255); 
    textAlign(CENTER, CENTER); 
    textSize(32); 
    text(`🎉 STAGE COMPLETE! 🎉 \n Final Score: ${score}`, width / 2, height / 2); 
}

function keyPressed() { 
    // Toggle Pause Feature 
    if (key === ' ') { 
        userStartAudio();
        console.log("Space pressed! New state:", gameState);
        
        if (gameState === 'start' && song) { 
            song.play(); 
            songStartTime = millis(); 
            gameState = 'playing'; 
        } else if (gameState === 'playing') { 
            song.pause(); 
            pauseOffset = millis() - songStartTime; 
            gameState = 'paused'; 
        } else if (gameState === 'paused') { 
            song.play(); 
            songStartTime = millis() - pauseOffset; 
            gameState = 'playing'; 
        }
        return; 
    } 
    
    // Process key hits during Phase 1 
    if (gameState === 'playing' && song && song.isPlaying() && song.currentTime() < 17) {
        let targetY = height - 80; 
        for (let i = notes.length - 1; i >= 0; i--) { 
            let n = notes[i]; 
            let matchedKey = lanes[n.lane]; 
            if (key.toLowerCase() === matchedKey && abs(n.y - targetY) < 30) { 
                score += 10; 
                notes.splice(i, 1); 
            } 
        } 
    } 
}