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
    mySketch.background(15, 5, 25); // Dark backdrop [7] 
    let w = 400; 
    let h = 400;

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
    mySketch.background(10, 20, 10); 
    let w = 400, 
    h = 400; 
    
    // Blinks every 180 frames on a different rhythm 
    let isBlinking = (frameCount % 180) < 12; 
    let eyeHeight = isBlinking ? 4 : 200; 
    mySketch.noStroke(); 
    
    // Giant Center Eye Outer Glow 
    mySketch.fill(180, 50, 255); 
    mySketch.ellipse(w * 0.5, h * 0.5, 220, eyeHeight); 
    
    // Vertical Slit Pupil 
    if (!isBlinking) { 
        mySketch.fill(0); 
        mySketch.ellipse(w * 0.5, h * 0.5, 20, 140); 
    } 
}

function drawCatEyes(mySketch) { 
    mySketch.background(5, 15, 10); 
    let w = 400, 
    h = 400; 
    
    // Fast blink every 90 frames 
    let isBlinking = (frameCount % 90) < 8; 
    let eyeHeight = isBlinking ? 3 : 90; 
    mySketch.noStroke(); 
    
    // Left Slit Eye 
    mySketch.fill(50, 255, 100); 
    mySketch.ellipse(w * 0.3, h * 0.5, 110, eyeHeight); 
    mySketch.fill(0); 
    if (!isBlinking) { 
        mySketch.ellipse(w * 0.3, h * 0.5, 10, eyeHeight * 0.8); 
    } 
    
    // Right Slit Eye 
    mySketch.fill(50, 255, 100); 
    mySketch.ellipse(w * 0.7, h * 0.5, 110, eyeHeight); 
    mySketch.fill(0); 
    if (!isBlinking) { 
        mySketch.ellipse(w * 0.7, h * 0.5, 10, eyeHeight * 0.8); 
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