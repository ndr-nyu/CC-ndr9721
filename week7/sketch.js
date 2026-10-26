let pMapper; // mapper instance
let myQuad; // one face
let balls = [];

function setup() {
    // p5.mapper needs WEBGL in createCanvas
    createCanvas(windowWidth, windowHeight, WEBGL);
    // create the mapper
    pMapper = createProjectionMapper(this);
    // create one quad surface
    myQuad = pMapper.createQuadMap(400, 400);
    // if you want to position items in your sketch
    // do so with the quad you're targeting
    for (let i = 0; i < 20; i++) { 
        balls.push({ 
            x: random(0, myQuad.width), 
            y: random(0, myQuad.height), 
            r: random(10, 30), 
            color: color(random(255), random(255), random(255)), 
            vx: random(-2, 2), 
            vy: random(-2, 2) 
        });

    }
}

function draw() {
    background(0);
    //pass the name of a drawing function into displaySketch()
    myQuad.displaySketch(myDrawing);
}

// p5.mapper passes an offscreen canvas (mySketch) into this function
function myDrawing(mySketch) {
    // anything drawn on this surface needs 'mySketch.' in front of it
    mySketch.background("magenta");
    mySketch.stroke(0);
    mySketch.strokeWeight(4);

    for (let ball of balls) {
        mySketch.noStroke();
        mySketch.fill(ball.color);
        mySketch.ellipse(ball.x, ball.y, ball.r * 2);
        
        ball.x += ball.vx; 
        ball.y += ball.vy;
        
        if (ball.x - ball.r < 0 || ball.x + ball.r > mySketch.width) { 
            ball.vx *= -1;
        }
        
        if (ball.y - ball.r < 0 || ball.y + ball.r > mySketch.height) { 
            ball.vy *= -1; 
        }
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