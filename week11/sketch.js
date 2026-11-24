let inputField, searchBtn; 
let currentTemp = null; 
let currentCity = "";
let currentWeather = "";

let particles = []; // Global array for falling rain/snow particles 
let confetti = []; // Add a new array at the top for celebration confetti 

async function setup() {
    createCanvas(800, 600);

    // Set color mode to HSB (Hue: 0-360, Saturation: 0-100, Brightness: 0-100) [1] 
    colorMode(HSB, 360, 100, 100, 100);

    // Create UI input elements 
    inputField = createInput(''); 
    inputField.position(20, 20); 
    inputField.changed(checkWeather); // Pressing Enter now triggers search!

    searchBtn = createButton('Check Vacation Weather'); 
    searchBtn.position(180, 20); 
    searchBtn.mousePressed(checkWeather); 

    // Populate particle positions for rain/snow 
    for (let i = 0; i < 100; i++) { 
        particles.push({ 
            x: random(width), 
            y: random(height), 
            speed: random(2, 5), 
            length: random(10, 20) 
        }); 
    }

    // Populate 50 confetti particles 
    for (let i = 0; i < 50; i++) { 
        confetti.push({ 
            x: random(width), 
            y: random(height), 
            size: random(6, 12), 
            hue: random(0, 360), 
            speed: random(1, 3) 
        }); 
    }
}

async function checkWeather() {
    let cityName = inputField.value();
    let apiKey = '26c1e8101d7e49902d7f5bdfca9422ae';   
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

    try { 
        // await pauses until the weather data arrives from the API [1-3] 
        let weatherData = await loadJSON(url); 
        currentTemp = weatherData.main.temp; 
        currentCity = cityName; 
    } catch (err) { 
        console.log("Could not find that city!"); 
    } 
}

function draw() {
    // Use your aesthetic judgment to visualize the weather! 
    if (currentTemp === null) { 
        background(0, 0, 90); // Light neutral background before search 
    } else { 
        // Map temperature (0°F to 100°F) to Hue (220° Blue -&gt; 30° Warm Sun) [1, 4] 
        let bgHue = map(currentTemp, 0, 100, 220, 30, true); 
        background(bgHue, 65, 95);

        // Render weather effects conditionally 
        if (currentTemp >= 75) { 
            drawSunnyVibes(); // ☀️ 75°F+ : Warm Vacation Sun!
            drawConfetti(); // 🎉 SPECIAL VACATION CELEBRATION!
        } else if (currentTemp >= 50) { 
            drawClouds(); // ☁️ 50°F - 74.9°F : Puffy Clouds! 
        } else if (currentTemp >= 32) { 
            drawRain(); // 🌧️ 32.1°F - 49.9°F : Rain Drops! 
        } else { 
            drawSnow(); // ❄️ 32°F and below : Falling Snow! 
        } 
    }

    // Text feedback so you can see what's happening! 
    textAlign(CENTER, CENTER); 
    fill(0, 0, 15); 
    textSize(24); 

    if (currentCity === "") { 
        text("Type a city and press Enter \n to check vacation weather!", width / 2, height / 2); 
    } else if (currentTemp !== null) { 
        // Convert Fahrenheit to Celsius 
        let tempC = round((currentTemp - 32) * (5 / 9));

        // Display both temperatures 
        text(`${currentCity}: ${currentTemp}°F / ${tempC}°C`, width / 2, height / 2 - 20);

        // Special Vacation Banner Message 
        if (currentTemp >= 75) { 
            textSize(20); 
            fill(45, 100, 20); // Warm dark gold 
            text("VACATION APPROVED! PACK YOUR BAGS! \n 🌴☀️", width / 2, height / 2 + 30); 
        } 
    } else { 
        text(currentCity, width / 2, height / 2); 
    } 
}

// 🎉 Special Vacation Celebration Confetti 
function drawConfetti() { 
    noStroke(); 
    for (let c of confetti) { 
        fill(c.hue, 80, 100, 80); 
        circle(c.x, c.y, c.size); 
        
        // Gentle falling motion 
        c.y += c.speed; 
        c.x += sin(frameCount * 0.05 + c.y) * 0.5; 
        
        // Reset to top when leaving screen 
        if (c.y > height) { 
            c.y = -10; 
            c.x = random(width); 
        } 
    } 
}

// ☀️ Sunny Effect: Rotating Rays & Sun Core 
function drawSunnyVibes() { 
    push(); 
    translate(width / 2, height / 2); 
    stroke(45, 90, 100, 60); 
    strokeWeight(3); 

    let numRays = 12; 
    for (let i = 0; i < numRays; i++) { 
        let angle = (TWO_PI / numRays) * i + frameCount * 0.01; 
        let x1 = cos(angle) * 140; 
        let y1 = sin(angle) * 140; 
        let x2 = cos(angle) * 220; 
        let y2 = sin(angle) * 220; 
        line(x1, y1, x2, y2); 
    } 

    noStroke(); 
    fill(45, 80, 100, 80); 
    circle(0, 0, 240); 
    pop(); 
}

// ☁️ Cloudy Effect: Soft drifting clouds 
function drawClouds() { 
    noStroke(); 
    fill(0, 0, 100, 45); // Soft translucent white in HSB 
    
    for (let p of particles) { 
        // Draw overlapping cloud puffs across the top half 
        let yPos = (p.y % (height * 0.4)) + 60; 
        circle(p.x, yPos, 70); 
        circle(p.x + 25, yPos - 15, 50); 
        circle(p.x - 25, yPos - 15, 50); 
        
        // Slow horizontal drift 
        p.x += p.speed * 0.4; 
        
        // Wrap back around the left side when leaving the screen 
        if (p.x > width + 60) { 
            p.x = -60; 
        } 
    } 
}

// 🌧️ Rain Effect: Slanted falling drops 
function drawRain() { 
    stroke(200, 70, 90, 70); 
    strokeWeight(2); 

    for (let p of particles) { 
        line(p.x, p.y, p.x - 2, p.y + p.length); 
        p.y += p.speed * 2; 
        p.x -= 0.5; 

        if (p.y > height) { 
            p.y = random(-20, 0); 
            p.x = random(width); 
        } 
    } 
}

// ❄️ Snow Effect: Soft drifting snowflakes 
function drawSnow() { 
    noStroke(); 
    fill(0, 0, 100, 80); 
    
    for (let p of particles) { 
        let drift = sin(frameCount * 0.02 + p.x) * 1.5; 
        circle(p.x + drift, p.y, p.speed + 2); 
        p.y += p.speed * 0.8; 
        if (p.y > height) { 
            p.y = random(-20, 0); 
            p.x = random(width); 
        } 
    } 
}