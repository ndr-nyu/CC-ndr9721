let song;
let amplitudeMeter; 

let notes = []; 
let lanes = ['a', 's', 'd', 'f']; 
let score = 0;
let gameState = 'start'; // 'start', 'playing', 'paused'

let songStartTime = 0; // Tracks start time in milliseconds 
let pauseOffset = 0; // Tracks paused time duration
let activeRipple = { x: 0, active: false, size: 0 }; // Visual burst for Phase 2

async function setup() {
    createCanvas(800, 600);

    song = await loadSound('assets/gimme.mp3');
    song.amp(0.8); // Set volume to 80%

    // Connect loudness meter to sound track 
    amplitudeMeter = new p5.Amplitude(); 
    song.connect(amplitudeMeter);
}

function draw() {
    // Safely read amplitude & timestamp without crashing frame 1! 
    let level = amplitudeMeter ? amplitudeMeter.getLevel() : 0; 
    
    // Calculate elapsed time in seconds using millis() 
    let t = (gameState === 'playing' && song && song.isPlaying()) ? (millis() - songStartTime) / 1000 : 0;

    // Background color pulses subtly with music loudness 
    background(20 + level * 40, 20, 40);

    // Explicit State Switcher 
    if (gameState === 'start') { 
        drawStartScreen(); 
    } else if (gameState === 'paused') { 
        drawPauseOverlay(); 
    } else if (gameState === 'playing') { 
        if (t < 17) { 
            drawKeyboardPhase1(level, t); 
        } else if (t >= 17 && t <= 34) { 
            drawKeyboardPhase2(level, t); 
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
        text("⏳ Loading Audio ... ⏳", width / 2, height / 2);
    }
}
  
// 0 to 17 Seconds: Keyboard Rhythm Mode 
function drawKeyboardPhase1(level, t) { 
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
        stroke(255, 100); 
        strokeWeight(2);
        line(laneX, 50, laneX, height); 

        // Target zone pulses with music loudness 
        fill(100, 200, 255, 150); 
        ellipse(laneX, targetY, 40 + level * 40); 

        fill(255); 
        noStroke();
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
function drawKeyboardPhase2(level, t) { 
    fill(0, 180); 
    rect(0, 0, width, 50); 

    fill(255, 220, 0); 
    textAlign(CENTER, CENTER); 
    textSize(18); 
    text(`PHASE 2: RHYTHMIC KEY BURSTS (${nf(34 - t, 1, 1)}s remaining)`, width / 2, 25); 
    
    // Display lane key triggers 
    for (let i = 0; i < lanes.length; i++) { 
        let laneX = (width / 5) * (i + 1); 
        fill(255, 150); 
        textAlign(CENTER, CENTER); 
        textSize(24); 
        text(`Tap [ ${lanes[i].toUpperCase()} ]`, laneX, height / 2); 
    } 
    // Render expanding key-triggered audio-reactive ripple 
    if (activeRipple.active) { 
        noFill(); 
        stroke(255, 0, 180, 200); 
        strokeWeight(6 + level * 20); 
        ellipse(activeRipple.x, height / 2, activeRipple.size, activeRipple.size); 
        activeRipple.size += 15; 
        if (activeRipple.size > width) { 
            activeRipple.active = false; 
        } 
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
    if (gameState === 'playing' && song && song.isPlaying()) { 
        let t = (millis() - songStartTime) / 1000; 
        
        // Phase 1: Key hits on falling notes (0 to 17s) 
        if (t < 17) { 
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

        // Phase 2: Key hits trigger visual amplitude ripples (17 to 34s) 
        else if (t >= 17 && t <= 34) { 
            let keyIndex = lanes.indexOf(key.toLowerCase()); 
            if (keyIndex !== -1) { 
                activeRipple = { 
                    x: (width / 5) * (keyIndex + 1), 
                    active: true, 
                    size: 20 
                }; 
                score += 5; 
            } 
        } 
    } 
}