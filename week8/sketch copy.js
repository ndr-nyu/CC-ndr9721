let cam;
let popPalettes;
let paletteOffset = 0; 
let gridCount = 2; // Default 2x2 grid (4 pop art frames) 
let cellImages = []; // Array to store reusable offscreen images

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

    // Define vibrant Pop Art palettes: [Shadows, Midtones, Skin/Face, Highlights] 
    popPalettes = [ 
        // Frame 1: Muted purple shadows, bright purple face, hot pink hair, yellow background 
        [color(60, 0, 90), color(150, 60, 180), color(255, 80, 180), color(255, 230, 0)], 
        // Frame 2: Dark purple lips/shadows, purple face, bubblegum pink hair, green background 
        [color(50, 0, 80), color(120, 40, 160), color(255, 130, 200), color(0, 230, 120)], 
        // Frame 3: Deep navy, electric cyan, fiery orange, bright yellow 
        [color(10, 20, 70), color(0, 180, 220), color(255, 90, 30), color(255, 240, 50)], 
        // Frame 4: Crimson red, teal, bright coral, sunshine white 
        [color(80, 0, 40), color(0, 140, 140), color(255, 60, 100), color(255, 255, 200)] 
    ];
}

function draw() {
    background(20);

    // Load latest camera pixel values 
    cam.loadPixels(); 
    // Ensure webcam feed has loaded before processing 
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
            let pIdx = (cellIdx + paletteOffset) % popPalettes.length; 
            let currentPalette = popPalettes[pIdx]; 
            
            // Reuse pre-allocated image buffer 
            let imgBuffer = cellImages[cellIdx]; 
            updatePopArtPixels(cam, imgBuffer, currentPalette); 
            
            // Render cell image scaled across full window grid 
            image(imgBuffer, x, y, cellW, cellH);

            cellIdx++;
        }
    }
}

// Update pixel values in place without creating new objects 
function updatePopArtPixels(sourceCam, targetImg, palette) { 
    targetImg.loadPixels(); 
    
    for (let i = 0; i < sourceCam.pixels.length; i += 4) { 
        let r = sourceCam.pixels[i]; 
        let g = sourceCam.pixels[i + 1]; 
        let b = sourceCam.pixels[i + 2]; 
        
        // Average RGB channels to find pixel brightness 
        let bright = (r + g + b) / 3; 
        
        let band = 0; 
        if (bright < 64) band = 0; 
        else if (bright < 128) band = 1; 
        else if (bright < 192) band = 2; 
        else band = 3; 
        
        let c = palette[band]; 
        targetImg.pixels[i] = red(c); 
        targetImg.pixels[i + 1] = green(c); 
        targetImg.pixels[i + 2] = blue(c); 
        targetImg.pixels[i + 3] = 255; 
    }
        
    targetImg.updatePixels(); 
}

// Click mouse to cycle color combinations across cells 
function mouseClicked() { 
    paletteOffset++; 
} 

// Press 'g' key to toggle grid layout (2x2 -&gt; 3x3 -&gt; 4x4) 
function keyPressed() { 
    if (key === 'g' || key === 'G') { 
        gridCount = (gridCount % 3) + 2; // Cycles grid density cleanly 
    } 
} 

// Automatically resize canvas when window dimensions change 
function windowResized() { 
    resizeCanvas(windowWidth, windowHeight); 
}