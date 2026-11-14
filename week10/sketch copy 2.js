let song;
let amplitudeMeter; 

let notes = []; 
let lanes = ['a', 's', 'd', 'f']; 
let score = 0;
let gameState = 'start'; // 'start', 'playing', 'paused'

let songStartTime = 0; // Tracks start time in milliseconds 
let pauseOffset = 0; // Tracks paused time duration
let activeRipple = { x: 0, active: false, size: 0 }; // Visual burst for Phase 2

// ABBA's Gimme Gimme Gimme intro is \~120 BPM (1 beat = ~0.5 seconds) 
let noteSchedule = [ 
    // Phase 1 Notes (0s to 17s) 
    { time: 1.5, lane: 0 }, { time: 2.0, lane: 1 }, { time: 2.5, lane: 2 }, { time: 3.0, lane: 3 }, 
    { time: 4.0, lane: 1 }, { time: 4.5, lane: 2 }, { time: 5.5, lane: 0 }, { time: 6.0, lane: 3 }, 
    { time: 7.0, lane: 2 }, { time: 7.5, lane: 1 }, { time: 8.5, lane: 0 }, { time: 9.0, lane: 3 }, 
    { time: 10.0, lane: 1 }, { time: 10.5, lane: 2 }, { time: 11.5, lane: 0 }, { time: 12.0, lane: 3 }, 
    { time: 13.0, lane: 2 }, { time: 13.5, lane: 1 }, { time: 14.5, lane: 0 }, { time: 15.0, lane: 3 }, 
    
    // Phase 2 Notes (17s to 34s) 
    { time: 17.5, lane: 0 }, { time: 18.0, lane: 2 }, { time: 18.5, lane: 1 }, { time: 19.0, lane: 3 }, 
    { time: 20.0, lane: 1 }, { time: 20.5, lane: 0 }, { time: 21.5, lane: 3 }, { time: 22.0, lane: 2 }, 
    { time: 23.0, lane: 0 }, { time: 23.5, lane: 1 }, { time: 24.5, lane: 2 }, { time: 25.0, lane: 3 }, 
    { time: 26.0, lane: 1 }, { time: 26.5, lane: 3 }, { time: 27.5, lane: 0 }, { time: 28.0, lane: 2 }, 
    { time: 29.0, lane: 2 }, { time: 29.5, lane: 1 }, { time: 30.5, lane: 3 }, { time: 31.0, lane: 0 }, 
    { time: 32.0, lane: 1 }, { time: 32.5, lane: 2 } 
];

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
    background(15 + level * 50, 15, 35);

    // Spawn notes from noteSchedule based on song time 
    updateNoteSpawning(t);

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

function updateNoteSpawning(t) { 
    if (gameState !== 'playing') return; 
    
    let targetY = height - 80; 
    let speed = 5; 
    
    // Time in seconds for a note to travel from y=50 to targetY=520 
    let travelTime = (targetY - 50) / (speed * 60); 
    
    for (let i = noteSchedule.length - 1; i >= 0; i--) { 
        let item = noteSchedule[i]; 
        if (t >= item.time - travelTime) { 
            notes.push({ lane: item.lane, y: 50, speed: speed }); 
            noteSchedule.splice(i, 1); // Remove spawned note from schedule 
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
    drawLanesAndNotes(level, t, "PHASE 1: RHYTHMIC NOTES");
}

// 17 to 34 Seconds: Hand Gesture Amplitude Tracing Mode 
function drawKeyboardPhase2(level, t) { 
    drawLanesAndNotes(level, t, "PHASE 2: NOTE BURST VISUALIZER");

    // Render expanding key-triggered audio-reactive ripple 
    if (activeRipple.active) { 
        noFill(); 
        stroke(255, 0, 180, 200); 
        strokeWeight(4 + level * 30); 
        ellipse(activeRipple.x, height - 80, activeRipple.size, activeRipple.size); 
        activeRipple.size += 12; 
        if (activeRipple.size > 250) { 
            activeRipple.active = false; 
        } 
    }
}

function drawLanesAndNotes(level, t, phaseTitle) { 
    let targetY = height - 80; 
    
    // Top timer banner 
    fill(0, 180); 
    rect(0, 0, width, 50); 
    fill(255, 220, 0); 
    textAlign(CENTER, CENTER); 
    textSize(18); 
    let remaining = t < 17 ? 17 - t : 34 - t; 
    text(`${phaseTitle} (${nf(max(0, remaining), 1, 1)}s remaining)`, width / 2, 25); 
    
    // Render lanes & target indicators 
    for (let i = 0; i < lanes.length; i++) { 
        let laneX = (width / 5) * (i + 1); 
        stroke(255, 80); 
        strokeWeight(2); 
        line(laneX, 50, laneX, height); 

        fill(100, 200, 255, 150); 
        ellipse(laneX, targetY, 40 + level * 35); 

        fill(255); 
        noStroke(); 
        textAlign(CENTER, CENTER); 
        textSize(16); 
        text(lanes[i].toUpperCase(), laneX, targetY); 
    } 

    // Move & draw active falling notes 
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
        let targetY = height - 80;
        
        // Phase 1: Key hits on falling notes (0 to 17s) 
        for (let i = notes.length - 1; i >= 0; i--) { 
            let n = notes[i]; 
            let matchedKey = lanes[n.lane]; 

            if (key.toLowerCase() === matchedKey && abs(n.y - targetY) < 30) { 
                score += 10; 

                // Trigger visual ripple burst during Phase 2! 
                if (t >= 17 && t <= 34) { 
                    activeRipple = { 
                        x: (width / 5) * (n.lane + 1), 
                        active: true, 
                        size: 20
                    }; 
                } 
                
                notes.splice(i, 1);
            } 
        }
    } 
}