let songs = [];
let amplitudeMeter; 
let fft;

// Define custom timing & settings for each track 
let trackData = [ 
    { title: "Gimme! Gimme! Gimme!", file: "assets/gimme.mp3", bpm: 120, offset: 1.1, p1End: 18, totalEnd: 34 }, 
    { title: "More Than A Woman", file: "assets/woman.mp3", bpm: 128, offset: 0.8, p1End: 9, totalEnd: 30 }, 
    { title: "I Will Survive", file: "assets/survive.mp3", bpm: 110, offset: 1.5, p1End: 23, totalEnd: 40 } 
];

let currentTrackIndex = 0; 
let song;

let notes = []; 
let noteSchedule = [];
let lanes = ['a', 's', 'd', 'f']; 
let score = 0;
let gameState = 'title'; // 'start', 'playing', 'paused'

let songStartTime = 0; // Tracks start time in milliseconds 
let pauseOffset = 0; // Tracks paused time duration

let activeRippleP1 = { x: 0, active: false, size: 0 };
let activeRipple = { x: 0, active: false, size: 0 }; // Visual burst for Phase 2

let visualHue = 180; 
let visualScale = 1.0;

async function setup() {
    createCanvas(800, 600);

    songs = await Promise.all([ 
        loadSound(trackData[0].file), 
        loadSound(trackData[1].file), 
        loadSound(trackData[2].file) 
    ]);
 
    amplitudeMeter = new p5.Amplitude(); 
    fft = new p5.FFT(32);
}

function startTrack(index) { 
    if (song && song.isPlaying()) { 
        song.stop(); 
    }
    
    currentTrackIndex = index; 
    song = songs[currentTrackIndex]; 
    song.amp(0.8); 
    
    // Connect analyzer to selected song 
    song.connect(amplitudeMeter); 
    song.connect(fft); 
    
    // Reset game state and generate track-specific beat schedule 
    score = 0; 
    notes = []; 
    visualScale = 1.0; 
    visualHue = 180;
    activeRippleP1.active = false; 
    activeRipple.active = false;
    generateBeatSchedule(); 

    userStartAudio(); 
    song.play(); 
    songStartTime = millis(); 
    gameState = 'playing';
}

function generateBeatSchedule() { 
    noteSchedule = []; 
    let track = trackData[currentTrackIndex]; 
    let beatInterval = 60 / track.bpm; 
    
    for (let t = track.offset; t < track.totalEnd; t += beatInterval) { 
        let laneChoice = floor(random(4)); 
        noteSchedule.push({ time: t, lane: laneChoice }); 
    } 
}

function draw() {
    let track = trackData[currentTrackIndex]; 
    let level = amplitudeMeter ? amplitudeMeter.getLevel() : 0; 
    let t = (gameState === 'playing' && song && song.isPlaying()) ? (millis() - songStartTime) / 1000 : 0; 
    
    background(15, 15, 30);

    // Smoothly decay visual pulse & slowly drift base color 
    visualScale = lerp(visualScale, 1.0, 0.05); 
    visualHue = (visualHue + 0.2) % 360;

    // Title Screen: 70s Disco Ball Effect 
    if (gameState === 'title') { 
        drawDiscoBall(); 
        drawTitleScreen(); 
        return; 
    } 
    
    // Song Selection Screen 
    if (gameState === 'select') { 
        drawDiscoBall(); 
        drawSongSelectionScreen(); 
        return; 
    }

    // Centered Radial FFT Visualizer (Synesthetic Background Layer) 
    if (fft && (gameState === 'playing' || gameState === 'paused')) { 
        let spectrum = fft.analyze(); 
        drawRadialFFT(spectrum, level);
    }

    // Spawn notes from noteSchedule based on song time 
    updateNoteSpawning(t);

    // Explicit State Switcher 
    if (gameState === 'paused') { 
        drawPauseOverlay(); 
    } else if (gameState === 'playing') { 
        if (t < track.p1End) { 
            drawKeyboardPhase1(level, t, track); 
        } else if (t >= track.p1End && t <= track.totalEnd) { 
            drawKeyboardPhase2(level, t, track); 
        } else { 
            gameState = 'score'; 
        }
    } else if (gameState === 'score') { 
        drawScoreScreen();
    } 
}

function drawRadialFFT(spectrum, level) { 
    push(); 
    // Center visualizer directly in middle of screen behind rhythm lanes 
    translate(width / 2, height / 2 - 20); 
    colorMode(HSB, 360, 100, 100, 100); 
    let numPoints = spectrum.length; 
    let baseRadius = (70 + level * 90) * visualScale; 

    // Expanding Concentric Audio Rings (Pulse to Loudness Beats) 
    noFill(); 
    for (let r = 1; r <= 3; r++) { 
        let ringSize = baseRadius * (0.6 + r * 0.45) + (level * 80 * r); 
        let ringAlpha = map(level, 0, 0.5, 20, 80) / r; 
        stroke((visualHue + r * 20) % 360, 80, 100, ringAlpha); 
        strokeWeight(2 + level * 5); 
        circle(0, 0, ringSize); 
    }
    
    // Soft Glowing Core 
    fill(visualHue, 70, 95, 25); 
    noStroke(); 
    circle(0, 0, baseRadius * 1.6);

    // Dramatic Radial Frequency Bars 
    for (let i = 0; i < numPoints; i++) { 
        let angle = map(i, 0, numPoints, 0, TWO_PI); 
        // Dramatic height mapping reacting to sound & visualScale 
        let ampLen = map(spectrum[i], 0, 255, 15, 180) * visualScale; 

        let x1 = baseRadius * cos(angle); 
        let y1 = baseRadius * sin(angle); 
        let x2 = (baseRadius + ampLen) * cos(angle); 
        let y2 = (baseRadius + ampLen) * sin(angle); 

        let rayHue = (visualHue + i * (360 / numPoints)) % 360; 
        stroke(rayHue, 85, 100, 75); 
        strokeWeight(5 + level * 8); 
        line(x1, y1, x2, y2); 
    } 
    pop(); 
}

function drawDiscoBall() { 
    push(); 
    translate(width / 2, 120); 
    
    // Soft outer glow 
    fill(255, 255, 255, 15); 
    noStroke(); 
    circle(0, 0, 180 + sin(frameCount * 0.05) * 10); 
    
    // Main ball body 
    fill(180, 190, 210, 60); 
    stroke(255, 100); 
    strokeWeight(1); 
    circle(0, 0, 140);

    // Rotating specular facets 
    let t = frameCount * 0.02; 
    for (let x = -60; x <= 60; x += 20) { 
        for (let y = -60; y <= 60; y += 20) { 
            if (dist(0, 0, x, y) < 65) { 
                let spark = sin(t + x + y) * 120 + 135; 
                fill(spark, spark, 255, 80); 
                rect(x - 6, y - 6, 12, 12, 2); 
            } 
        } 
    } 
    
    pop(); 
}

function drawTitleScreen() { 
    fill(0, 160); 
    rect(0, 0, width, height); 
    textAlign(CENTER, CENTER); 
    fill(255, 220, 0); 
    textSize(36); 
    text("✨ WELCOME TO 70s KEYBOARD DISCO ✨", width / 2, height / 2 - 20); 

    fill(200, 240, 255); 
    textSize(20); 
    text("Press ANY KEY to Start", width / 2, height / 2 + 50); 
}

function drawSongSelectionScreen() { 
    fill(0, 160); 
    rect(0, 0, width, height); 
    textAlign(CENTER, CENTER); 
    fill(255); 
    textSize(28); 
    text("🪩 SELECT YOUR TRACK 🪩", width / 2, 80);

    // Draw 3 Interactive Buttons 
    for (let i = 0; i < trackData.length; i++) { 
        let btnY = 180 + i * 90; 
        let isHovered = mouseX > width / 2 - 180 && mouseX < width / 2 + 180 && mouseY > btnY - 30 && mouseY < btnY + 30; 

        // Button background 
        stroke(255, 200); 
        strokeWeight(2); 
        fill(isHovered ? color(255, 0, 150, 200) : color(40, 30, 80, 180)); 
        rect(width / 2 - 180, btnY - 30, 360, 60, 12); 

        // Button text 
        noStroke(); 
        fill(255); 
        textSize(18); 
        text(`${trackData[i].title} (${trackData[i].bpm} BPM)`, width / 2, btnY); 
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

function drawKeyboardPhase1(level, t, track) { 
    drawLanesAndNotes(level, t, "PHASE 1: RHYTHMIC NOTES", track.p1End);

    if (activeRippleP1.active) { 
        push();
        fill(255, 40); // Soft white inner glow 
        stroke(255, 255); // Crisp pure white outline 
        strokeWeight(3 + level * 6); // Bold line thickness 
        ellipse(activeRippleP1.x, height - 80, activeRippleP1.size, activeRippleP1.size); 
        
        activeRippleP1.size += 5; // Slower growth so it lingers on screen 
        if (activeRippleP1.size > 90) { 
            activeRippleP1.active = false; 
        } 
        pop();
    }
}

function drawKeyboardPhase2(level, t, track) { 
    drawLanesAndNotes(level, t, "PHASE 2: NOTE BURST VISUALIZER", track.totalEnd);

    // Render expanding key-triggered audio-reactive ripple 
    if (activeRipple.active) { 
        noFill(); 
        stroke(255, 0, 180, 220); 
        strokeWeight(4 + level * 30); 
        ellipse(activeRipple.x, height - 80, activeRipple.size, activeRipple.size); 

        activeRipple.size += 12; 
        if (activeRipple.size > 250) { 
            activeRipple.active = false; 
        } 
    }
}

function drawLanesAndNotes(level, t, phaseTitle, targetTime) { 
    let targetY = height - 80; 
    
    // Top timer banner 
    fill(0, 180); 
    rect(0, 0, width, 50); 
    fill(255, 220, 0); 
    textAlign(CENTER, CENTER); 
    textSize(18); 
    let remaining = max(0, targetTime - t); 
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
    push();
    fill(0, 150); 
    rect(0, 0, width, height); 

    noStroke();
    fill(255); 
    textAlign(CENTER, CENTER); 
    textSize(36); 
    text("⏸ GAME PAUSED ⏸ \n Press SPACE to Resume", width / 2, height / 2); 
    pop();
}

function drawScoreScreen() { 
    fill(0, 200); 
    rect(0, 0, width, height); 
    fill(255); 
    textAlign(CENTER, CENTER); 
    textSize(32); 
    text(`🎉 STAGE COMPLETE! 🎉 \n Final Score: ${score}`, width / 2, height / 2); 

    // Return Button 
    let btnY = height / 2 + 50; 
    let isHovered = mouseX > width / 2 - 140 && mouseX < width / 2 + 140 && mouseY > btnY - 25 && mouseY < btnY + 25; 
    
    stroke(255); 
    strokeWeight(2); 
    fill(isHovered ? color(0, 200, 255) : color(60, 40, 100)); 
    rect(width / 2 - 140, btnY - 25, 280, 50, 10); 
    
    noStroke(); 
    fill(255); 
    textSize(18); 
    text("🔄 CHOOSE ANOTHER SONG", width / 2, btnY);
}

function mousePressed() { 
    // Handle Song Menu Clicks 
    if (gameState === 'select') { 
        for (let i = 0; i < trackData.length; i++) { 
            let btnY = 180 + i * 90; 
            if (mouseX > width / 2 - 180 && mouseX < width / 2 + 180 && mouseY > btnY - 30 && mouseY < btnY + 30) { 
                startTrack(i); 
                return; 
            } 
        } 
    } 
    
    // Handle Return to Menu Click on Score Screen 
    if (gameState === 'score') { 
        let btnY = height / 2 + 50; 
        if (mouseX > width / 2 - 140 && mouseX < width / 2 + 140 && mouseY > btnY - 25 && mouseY < btnY + 25) { 
            if (song && song.isPlaying()) song.stop(); 
            gameState = 'select'; 
        } 
    } 
}

function keyPressed() { 
    // Title Screen: Any key advances to Song Selection 
    if (gameState === 'title') { 
        gameState = 'select'; 
        return; 
    }
    
    // Toggle Pause Feature 
    if (key === ' ') { 
        userStartAudio();
        
        if (gameState === 'playing') { 
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
        let track = trackData[currentTrackIndex];
        let t = (millis() - songStartTime) / 1000; 
        let targetY = height - 80;
        
        // Phase 1: Key hits on falling notes (0 to 18s) 
        for (let i = notes.length - 1; i >= 0; i--) { 
            let n = notes[i]; 
            let matchedKey = lanes[n.lane]; 

            if (key.toLowerCase() === matchedKey && abs(n.y - targetY) < 30) { 
                score += 10; 

                // Pulse background spectrum scale and shift hue on hit 
                visualScale += 0.25; 
                visualHue = (visualHue + 25) % 360; 
                
                // ⚪ PHASE 1 TRIGGER: Activates white ripple during 0s to p1End 
                if (t < track.p1End) { 
                    activeRippleP1 = { 
                        x: (width / 5) * (n.lane + 1), 
                        active: true, 
                        size: 15 
                    }; 
                } 
                
                // 🌸 PHASE 2 TRIGGER: Activates pink burst during p1End to totalEnd 
                else if (t >= track.p1End && t <= track.totalEnd) { 
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