let song;
let amplitudeMeter; 
let fft;

let notes = []; 
let lanes = ['a', 's', 'd', 'f']; 
let score = 0;
let gameState = 'start'; // 'start', 'playing', 'paused'

let songStartTime = 0; // Tracks start time in milliseconds 
let pauseOffset = 0; // Tracks paused time duration
let activeRipple = { x: 0, active: false, size: 0 }; // Visual burst for Phase 2

let noteSchedule = [];

async function setup() {
    createCanvas(800, 600);

    song = await loadSound('assets/gimme.mp3');
    song.amp(0.8); // Set volume to 80%

    // Connect loudness meter to sound track 
    amplitudeMeter = new p5.Amplitude(); 
    song.connect(amplitudeMeter);

    // 32-band FFT frequency analyzer 
    fft = new p5.FFT(32); 
    song.connect(fft); 
    
    // Generate beat schedule at 120 BPM 
    generateBeatSchedule();
}

function generateBeatSchedule() { 
    let bpm = 120; 
    let beatInterval = 60 / bpm; // 0.5s per beat 
    let songOffset = 1.1; 
    
    for (let t = songOffset; t < 34; t += beatInterval) { 
        let laneChoice = floor(random(4)); 
        noteSchedule.push({ time: t, lane: laneChoice }); 
    } 
}

function draw() {
    // Safely read amplitude & timestamp without crashing frame 1! 
    let level = amplitudeMeter ? amplitudeMeter.getLevel() : 0; 
    
    // Calculate elapsed time in seconds using millis() 
    let t = (gameState === 'playing' && song && song.isPlaying()) ? (millis() - songStartTime) / 1000 : 0;

    background(15, 15, 30);

    // Draw Live FFT Frequency Spectrum Visualizer in Background 
    if (fft && gameState === 'playing') { 
        let spectrum = fft.analyze(); 
        let barWidth = width / spectrum.length; 
        for (let i = 0; i < spectrum.length; i++) { 
            let barHeight = map(spectrum[i], 0, 1, 0, height * 0.4); 
            fill(100 + i * 5, 120, 255 - i * 5, 100); 
            noStroke(); 
            rect(i * barWidth, height - barHeight, barWidth - 2, barHeight); 
        } 
    }

    // Spawn notes from noteSchedule based on song time 
    updateNoteSpawning(t);

    // Explicit State Switcher 
    if (gameState === 'start') { 
        drawStartScreen(); 
    } else if (gameState === 'paused') { 
        drawPauseOverlay(); 
    } else if (gameState === 'playing') { 
        if (t < 18) { 
            drawKeyboardPhase1(level, t); 
        } else if (t >= 18 && t <= 34) { 
            drawKeyboardPhase2(level, t); 
        } else { 
            drawScoreScreen(); 
        } 
    } 
}

function updateNoteSpawning(t) { 
    if (gameState !== 'playing') return; 
    
    let targetY = height - 80; 
    let speed = 6; 
    
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
  
// 0 to 18 Seconds: Keyboard Rhythm Mode 
function drawKeyboardPhase1(level, t) { 
    drawLanesAndNotes(level, t, "PHASE 1: RHYTHMIC NOTES");
}

// 18 to 34 Seconds: Hand Gesture Amplitude Tracing Mode 
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
    let remaining = t < 18 ? 18 - t : 34 - t; 
    text(`${phaseTitle} (${nf(max(0, remaining), 1, 1)}s remaining)`, width / 2, 25); 
    
    // Render lanes & target indicators 
    for (let i = 0; i < lanes.length; i++) { 
        let laneX = (width / 5) * (i + 1); 
        stroke(255, 100); 
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
        
        // Phase 1: Key hits on falling notes (0 to 18s) 
        for (let i = notes.length - 1; i >= 0; i--) { 
            let n = notes[i]; 
            let matchedKey = lanes[n.lane]; 

            if (key.toLowerCase() === matchedKey && abs(n.y - targetY) < 30) { 
                score += 10; 

                // Trigger visual ripple burst during Phase 2! 
                if (t >= 18 && t <= 34) { 
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