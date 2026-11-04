let cam;
let popPalettes;
let paletteIndex = 0; 
let cellImages = []; // Array to store reusable offscreen images
let gridCount = 2; // Default 2x2 grid (4 pop art frames) 

async function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1); // Ensures straightforward 1:1 pixel array calculations
    noSmooth(); // Disables smoothing for crisp, blocky Pop Art pixels!

    cam = await createCapture(VIDEO);
    cam.size(160, 120);
    cam.hide();

    // Create reusable offscreen images (max 16 for a 4x4 grid) 
    for (let i = 0; i < 16; i++) { 
        cellImages.push(createImage(160, 120)); 
    }

    // Pre-defined Pop Art palettes 
    popPalettes = [ 
        // Frame 1: Muted purple shadows, bright purple face, hot pink hair, yellow BG 
        [color(60, 0, 90), color(150, 60, 180), color(255, 80, 180), color(255, 230, 0)], 
        // Frame 2: Dark purple lips/shadows, purple face, bubblegum pink hair, green BG 
        [color(50, 0, 80), color(120, 40, 160), color(255, 130, 200), color(0, 230, 120)], 
        // Frame 3: Deep navy, electric cyan, fiery orange, bright yellow 
        [color(10, 20, 70), color(0, 180, 220), color(255, 90, 30), color(255, 240, 50)], 
        // Frame 4: Crimson red, teal, bright coral, sunshine white 
        [color(80, 0, 40), color(0, 140, 140), color(255, 60, 100), color(255, 255, 200)] 
    ]; 
}

function draw() {
    background(20);

    cam.loadPixels();  
    if (!cam.pixels || cam.pixels.length === 0) return;
 
    let cellW = width / gridCount; 
    let cellH = height / gridCount; 
    
    let cellIdx = 0;

    // Draw the Pop Art grid 
    for (let row = 0; row < gridCount; row++) {
        for (let col = 0; col < gridCount; col++) {
            let x = col * cellW;
            let y = row * cellH;

            // Select palette for this cell 
            let pIdx = (cellIdx + paletteIndex) % popPalettes.length; 
            let currentPalette = popPalettes[pIdx]; 
            
            // Reuse pre-allocated image buffer 
            let imgBuffer = cellImages[cellIdx]; 
            updatePopArt(cam, imgBuffer, currentPalette);
            
            // Render cell image scaled across full window grid 
            image(imgBuffer, x, y, cellW, cellH);

            cellIdx++;
        }
    }
}

// Update pixel values in place without creating new objects 
function updatePopArt(sourceCam, targetImg, palette) {
    targetImg.loadPixels(); 
    
    let pRGB = [ 
        [red(palette[0]), green(palette[0]), blue(palette[0])], 
        [red(palette[1]), green(palette[1]), blue(palette[1])], 
        [red(palette[2]), green(palette[2]), blue(palette[2])], 
        [red(palette[3]), green(palette[3]), blue(palette[3])] 
    ];
     
    // Assign pre-calculated RGB colors to camera pixel bands 
    for (let i = 0; i < sourceCam.pixels.length; i += 4) { 
        let r = sourceCam.pixels[i]; 
        let g = sourceCam.pixels[i + 1]; 
        let b = sourceCam.pixels[i + 2]; 
        let bright = (r + g + b) / 3;
        
        // Use dynamic threshold based on mouseY
        let band = 0; 
        if (bright < 64) band = 0; 
        else if (bright < 128) band = 1; 
        else if (bright < 192) band = 2; 
        else band = 3; 
        
        let rgb = pRGB[band]; 
        targetImg.pixels[i] = rgb[0]; 
        targetImg.pixels[i + 1] = rgb[1]; 
        targetImg.pixels[i + 2] = rgb[2]; 
        targetImg.pixels[i + 3] = 255;
    }
        
    targetImg.updatePixels(); 
}

// Press 'g' key to toggle grid layout (2x2 -&gt; 3x3 -&gt; 4x4) 
function keyPressed() { 
    if (key === 's' || key === 'S') { 
        saveCanvas('pop_art_self_portrait', 'png'); // Save snapshot! 
    } else if (key === 'g' || key === 'G') { 
        gridCount = (gridCount % 3) + 2; 
    } 
}

// Click mouse to cycle color combinations across cells 
function mouseClicked() { 
    paletteIndex++; 
} 

// Automatically resize canvas when window dimensions change 
function windowResized() { 
    resizeCanvas(windowWidth, windowHeight); 
}