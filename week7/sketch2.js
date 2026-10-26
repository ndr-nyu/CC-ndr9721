let pMapper; // mapper instance
let quadFront, quadLeft, quadRight;

function setup() {
    // p5.mapper needs WEBGL in createCanvas
    createCanvas(windowWidth, windowHeight, WEBGL);
    // create the mapper
    pMapper = createProjectionMapper(this);
    // create three quad surfaces
    quadFront = pMapper.createQuadMap(400, 400); 
    quadLeft = pMapper.createQuadMap(400, 400); 
    quadRight = pMapper.createQuadMap(400, 400);
}

function draw() {
    background(0);
    // Map each unique eye style to a box face 
    quadFront.displaySketch(drawSpookyEyes); 
    quadLeft.displaySketch(drawCyclopsEye); 
    quadRight.displaySketch(drawCatEyes);
}

function drawSpookyEyes(mySketch) {  
    let w = 400; 
    let h = 400;

    // Calculate an oscillating glow for the green background 
    let bgGlow = sin(frameCount * 0.06) * 60 + 195; // Waves between 135 and 255 
    mySketch.background(20, bgGlow, 60); // Pulsing neon green background

    // Blinking calculation: blinks for 10 frames out of every 120 frames 
    let isBlinking = (frameCount % 120) < 10; 
    let eyeHeight = isBlinking ? 4 : 130; // Collapses vertically when blinking

    // Calculate pulsing glow and pupil movement [5] 
    let glow = sin(frameCount * 0.06) * 60 + 195; 
    let pupilShift = cos(frameCount * 0.03) * 15; 
    mySketch.noStroke(); 
    
    // Left Eye 
    mySketch.fill(255, glow, 0); // Glowing orange 
    mySketch.ellipse(w * 0.35, h * 0.5, 90, 130); 
    mySketch.fill(0); 
    if (!isBlinking) { 
        mySketch.ellipse(w * 0.35 + pupilShift, h * 0.5, 25, 80); 
    } 
    
    // Right Eye 
    mySketch.fill(255, glow, 0); 
    mySketch.ellipse(w * 0.65, h * 0.5, 90, 130); 
    mySketch.fill(0); 
    if (!isBlinking) { 
        mySketch.ellipse(w * 0.65 + pupilShift, h * 0.5, 25, 80); 
    } 
}

function drawCyclopsEye(mySketch) { 
    let glow = sin(frameCount * 0.06) * 60 + 195;
    mySketch.background(255, glow, 0); 
    let w = 400, 
    h = 400; 
    
    // Unpredictable Squinting using Perlin noise 
    let squintNoise = noise(frameCount * 0.015); 
    let eyeHeight = mySketch.map(squintNoise, 0, 1, 160, 200); // Varies between 70px (squint) and 220px (wide) 
    
    // Unpredictable Pupil Movement using noise() with unique seed offsets 
    let rawNoiseX = (noise(frameCount * 0.01 + 10) - 0.5) * 2; // Ranges from -1 to +1 
    let rawNoiseY = (noise(frameCount * 0.01 + 500) - 0.5) * 2; // Ranges from -1 to +1 
    
    // Strict Boundary Constraints (Radius Math) 
    let eyeRadiusX = 110; // Purple eye width radius (220 / 2) 
    let eyeRadiusY = eyeHeight / 2; // Purple eye height radius (dynamic squint) 
    let pupilHeight = mySketch.map(eyeHeight, 70, 220, 35, 110); // Pupil height scales with squint 
    let pupilRadiusX = 55; // Black pupil width radius (110 / 2) 
    let pupilRadiusY = pupilHeight / 2; // Black pupil height radius 

    // Calculate maximum allowed offsets so the pupil's edge NEVER spills outside 
    let maxOffsetX = eyeRadiusX - pupilRadiusX; // 110 - 55 = 55px maximum horizontal offset 
    let maxOffsetY = eyeRadiusY - pupilRadiusY; // Dynamic maximum vertical offset 
    let pupilX = rawNoiseX * maxOffsetX; 
    let pupilY = rawNoiseY * maxOffsetY; 
    
    // Outer Purple Eye Base 
    mySketch.noStroke(); 
    mySketch.fill(180, 50, 255); 
    mySketch.ellipse(w * 0.5, h * 0.55, 220, eyeHeight); 
    
    // Outer Black Pupil Ring (Constrained inside purple boundary) 
    mySketch.fill(0); 
    mySketch.ellipse(w * 0.5 + pupilX, h * 0.55 + pupilY, 110, pupilHeight); // Inner Hot Pink Core 
    mySketch.fill(255, 0, 100); 
    mySketch.ellipse(w * 0.5 + pupilX, h * 0.55 + pupilY, 45, pupilHeight * 0.4); 
}

function drawCatEyes(mySketch) {  
    let w = 400, 
    h = 400; 

    // Calculate an oscillating glow for the purple background 
    let bgGlow = sin(frameCount * 0.04) * 50 + 205; // Waves between 155 and 255 
    mySketch.background(bgGlow * 0.7, 20, bgGlow); // Pulsing rich purple background
    
    /// Fast blink every 90 frames 
    let isBlinking = (frameCount % 90) < 8; 

    // Subtle squinting wave + pupil movement 
    let squint = sin(frameCount * 0.03) * 15; 
    let baseHeight = 75 + squint; // Narrows and opens subtly 
    let eyeHeight = isBlinking ? 3 : baseHeight;

    let catPupilX = sin(frameCount * 0.05) * 12; 
    let catPupilY = cos(frameCount * 0.03) * 6; 

    mySketch.noStroke(); 
    
    // Left Slit Eye 
    mySketch.fill(50, 255, 100); 
    mySketch.ellipse(w * 0.3, h * 0.5, 110, eyeHeight); 
    mySketch.fill(0); 
    if (!isBlinking) { 
        mySketch.ellipse(w * 0.3 + catPupilX, h * 0.5 + catPupilY, 10, eyeHeight * 0.8); 
    } 
    
    // Right Slit Eye 
    mySketch.fill(50, 255, 100); 
    mySketch.ellipse(w * 0.7, h * 0.5, 110, eyeHeight); 
    mySketch.fill(0); 
    if (!isBlinking) { 
        mySketch.ellipse(w * 0.7 + catPupilX, h * 0.5 + catPupilY, 10, eyeHeight * 0.8); 
    } 
}

    function keyPressed() {
    if (key === "c") {
        pMapper.toggleCalibration();
    }
    if (key === "s") {
        pMapper.save("map.json");
    }
    if (key === "l") {
        pMapper.load("maps/map.json");
    }
    if (key === "f") {
        let fs = fullscreen();
        fullscreen(!fs);
    }
}