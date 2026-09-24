let baseWidth = 50;
let mySeed = 35188;
let margin = 20; // 1\. Margin padding from canvas edges 
let rows = 7; // 2\. Exact number of rows to fit vertically
let bDoExportSvg = false;

function setup() {
    createCanvas(576, 384);
    noiseSeed(mySeed);
}

function draw() {
    background(255);

    if (bDoExportSvg) { 
        beginRecordSvg("myOutput.svg"); 
    }

    // Calculate height dynamically so all rows fit inside margins 
    let availableHeight = height - (margin * 2); 
    let baseHeight = availableHeight / rows;
    let cols = floor((width - (margin * 2)) / (baseWidth / 2));

    for (let row = 0; row < rows; row++) { 
        for (let col = 0; col < cols; col++) { 
            let cx = margin + col * (baseWidth / 2) + baseWidth / 2; 
            let cy = margin + row * baseHeight + baseHeight / 2;

            let leftEdge = cx - baseWidth / 2; 
            let rightEdge = cx + baseWidth / 2; 
            let topEdge = cy - baseHeight / 2; 
            let bottomEdge = cy + baseHeight / 2;

            if (leftEdge >= 0 && rightEdge <= width && topEdge >= 0 && bottomEdge <= height) {
                let hatchNoise = noise(col * 0.2, row * 0.2);
                let sizeScale = 1.0;
                let isUpward = ((row + col) % 2 === 0);

                let rotAngle = map(row, 0, rows - 1, 0, radians(15));
                
                push(); 
                translate(cx, cy); 
                rotate(rotAngle);
                scale(sizeScale); 
                noFill(); 
                stroke(45, 15, 98); 
                strokeWeight(1); 
                
                // Draw triangle outline 
                if (isUpward) { 
                    triangle(-baseWidth / 2, baseHeight / 2, baseWidth / 2, baseHeight / 2, 0, -baseHeight / 2); 
                } else { 
                    triangle(-baseWidth / 2, -baseHeight / 2, baseWidth / 2, -baseHeight / 2, 0, baseHeight / 2); 
                } 

                // Favorite hatch style, activated by noise threshold 
                if (hatchNoise > 0.5) { 
                    stroke(45, 15, 98); 
                    let spacing = 6; 
                    let slant = 12; // Horizontal shift for original diagonal look 
                    for (let x = -baseWidth; x < baseWidth; x += spacing) { 
                        line(x, -baseHeight / 2, x + slant, baseHeight / 2);
                    } 
                }
                
                pop(); 
            }
        } 
    } 
    
    if (bDoExportSvg) { 
    endRecordSvg(); 
    bDoExportSvg = false; 
    }
}

function keyPressed() { 
    if (key === 's' || key === 'S') { 
        bDoExportSvg = true; 
    } 
}

// function mousePressed() { 
    // mySeed = floor(random(100000)); 
    /// console.log("Current Favorite Seed:", mySeed); 
    // noiseSeed(mySeed); 
// }