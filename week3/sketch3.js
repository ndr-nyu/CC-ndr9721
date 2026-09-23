let spacing = 110;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noFill(); // Only draw the outlines of the rings
}

function draw() {
    background(245, 242, 235); 
    
    let cols = ceil(width / spacing) + 1; 
    let rows = ceil(height / spacing) + 1; 
     
    let centerY = height / 2; 

    for (let r = 0; r < rows; r++) { 
        for (let c = 0; c < cols; c++) { 
            let x = c * spacing; 
            let y = r * spacing; 

            // 2\. Vertical distance from the screen center 
            let dY = abs(y - centerY); 
            
            // 3\. Map scale: Largest in center (1.2), shrinking toward top &amp; bottom (0.35) 
            let scaleFactor = map(dY, 0, height / 2, 1.2, 0.35, true);
            
            // 2\. CHANGED: Find distance from current tile to mouse cursor! 
            let dMouse = dist(x, y, mouseX, mouseY); 
            
            push(); 
            translate(x, y); 

            // 4\. Apply scale transformation relative to tile center 
            scale(scaleFactor); 
            let glow = map(dMouse, 0, 250, 1, 0, true);
            let weight = lerp(2, 3.8, glow); 
            strokeWeight(weight); 
            
            let rVal = lerp(60, 255, glow); 
            let gVal = lerp(60, 210, glow); 
            let bVal = lerp(70, 30, glow); 
            stroke(rVal, gVal, bVal);

            for (let ringDiam = spacing * 0.8; ringDiam > 15; ringDiam -= 24) { 
                circle(0, 0, ringDiam); 
            } 
            pop(); 
        } 
    } 
}