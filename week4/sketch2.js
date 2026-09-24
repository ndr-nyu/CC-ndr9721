let baseWidth = 50;
let baseHeight = 50;

function setup() {
    createCanvas(576, 384);
}

function draw() {
    background(45, 15, 98);
    
    let cols = ceil(width / (baseWidth / 2)) + 1; 
    let rows = ceil(height / baseHeight) + 1; 

    for (let row = 0; row < rows; row++) { 
        for (let col = 0; col < cols; col++) { 
            let cx = col * (baseWidth / 2);
            let cy = row * baseHeight + baseHeight / 2; 

            let sizeScale = 1.0;
            let hatchNoise = noise(col * 0.2, row * 0.2);

            push(); 
            translate(cx, cy); 
            scale(sizeScale); 
            noFill(); 
            stroke(200, 70, 40); 
            strokeWeight(1); 

            if ((row + col) % 2 === 0) { 
                triangle(-baseWidth / 2, baseHeight / 2, baseWidth / 2, baseHeight / 2, 0, -baseHeight / 2); 
            } else { 
                triangle(-baseWidth / 2, -baseHeight / 2, baseWidth / 2, -baseHeight / 2, 0, baseHeight / 2); 
            } 

            // Add diagonal hatches if noise value is above threshold 
            if (hatchNoise > 0.5) { 
                stroke(200, 70, 40); // Darker stroke for hatching 
                let spacing = 6; // Gap between hatch lines 
                for (let x = -baseWidth; x < baseWidth; x += spacing) { 
                    line(x, -baseHeight / 2, x + 12, baseHeight / 2); 
                } 
            }

            pop(); 
        
        } 
    } 
}
